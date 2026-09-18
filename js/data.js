/**
 * DATA LAYER
 * ----------
 * Loads item data from the configured Google Sheet CSV (or the bundled
 * fallback CSV), normalizes it into a predictable shape, and exposes it
 * to the rest of the app through window.DataStore.
 *
 * Expected columns (case-insensitive, extra columns are ignored):
 *   id, title, year, author, material, description, image, lat, lng,
 *   location_name, themes
 *
 * "themes" may contain several themes separated by ";" or ",", e.g.
 *   "Pilgrimage;Trade Routes"
 */

const DataStore = (() => {
  let itemsCache = null;
  let loadPromise = null;

  function cacheBustUrl(url) {
    // Google's published-CSV links are cached aggressively by Google's own
    // edge servers; append a timestamp so the browser always asks for the
    // latest version instead of showing stale data from its own cache.
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}_=${Date.now()}`;
  }

  function toNumber(value) {
    if (value === undefined || value === null || value === "") return null;
    const n = parseFloat(String(value).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  function parseSortYear(yearRaw) {
    if (!yearRaw) return null;
    const match = String(yearRaw).match(/-?\d{3,4}/);
    if (!match) return null;
    return parseInt(match[0], 10);
  }

  function parseThemes(themesRaw) {
    if (!themesRaw) return [];
    return String(themesRaw)
      .split(/[;,]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function normalizeRow(row, index) {
    // Build a case-insensitive lookup of the row's keys.
    const lower = {};
    Object.keys(row).forEach((k) => {
      lower[k.trim().toLowerCase()] = row[k];
    });

    const lat = toNumber(lower.lat);
    const lng = toNumber(lower.lng ?? lower.lon ?? lower.long ?? lower.longitude);

    return {
      id: (lower.id && String(lower.id).trim()) || `row-${index}`,
      title: (lower.title || "Untitled item").trim(),
      year: (lower.year || "").toString().trim(),
      sortYear: parseSortYear(lower.year),
      author: (lower.author || "").trim(),
      material: (lower.material || "").trim(),
      description: (lower.description || "").trim(),
      image: (lower.image || "").trim(),
      lat,
      lng,
      locationName: (lower.location_name || lower.location || "").trim(),
      themes: parseThemes(lower.themes),
    };
  }

  function parseCsvText(csvText) {
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    return result.data
      .map(normalizeRow)
      .filter((item) => item.lat !== null && item.lng !== null);
  }

  async function fetchCsv(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV (${response.status}): ${url}`);
    }
    return response.text();
  }

  async function loadItems() {
    if (itemsCache) return itemsCache;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      const remoteUrl = SITE_CONFIG.SHEET_CSV_URL && SITE_CONFIG.SHEET_CSV_URL.trim();

      if (remoteUrl) {
        try {
          const csvText = await fetchCsv(cacheBustUrl(remoteUrl));
          const items = parseCsvText(csvText);
          if (items.length > 0) {
            itemsCache = items;
            return itemsCache;
          }
          console.warn("Google Sheet CSV loaded but contained no valid rows; falling back to sample data.");
        } catch (err) {
          console.warn("Could not load the Google Sheet CSV, falling back to sample data.", err);
        }
      }

      const csvText = await fetchCsv(SITE_CONFIG.FALLBACK_CSV_PATH);
      itemsCache = parseCsvText(csvText);
      return itemsCache;
    })();

    return loadPromise;
  }

  function getAllThemes(items) {
    const set = new Set();
    items.forEach((item) => item.themes.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  return { loadItems, getAllThemes };
})();
