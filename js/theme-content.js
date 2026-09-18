/**
 * THEMATIC PATH CONTENT (descriptions + post feed)
 * -------------------------------------------------
 * Loads the two extra tabs of the researcher's content Google Sheet
 * (published separately as CSV) that let her edit the intro text and the
 * post feed shown on each thematic path page, without touching code.
 *
 * "descriptions" tab — one row per theme:
 *   theme, description
 *
 * "posts" tab — several rows per theme, shown as cards in "order":
 *   id, theme, order, title, body, image
 * ("body" can also be named "text" in the sheet — both are accepted.)
 *
 * Falls back to the bundled sample CSVs in data/ when no sheet is
 * configured or the fetch fails, following the same pattern as
 * js/data.js.
 */

const ThemeContent = (() => {
  let descriptionsCache = null;
  let descriptionsPromise = null;
  let postsCache = null;
  let postsPromise = null;

  function cacheBustUrl(url) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}_=${Date.now()}`;
  }

  async function fetchCsv(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV (${response.status}): ${url}`);
    }
    return response.text();
  }

  function lowerKeys(row) {
    const lower = {};
    Object.keys(row).forEach((k) => {
      lower[k.trim().toLowerCase()] = row[k];
    });
    return lower;
  }

  function normalizeDescriptionRow(row) {
    const lower = lowerKeys(row);
    return {
      theme: (lower.theme || "").trim(),
      description: (lower.description || "").trim(),
    };
  }

  function parseDescriptionsCsv(csvText) {
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    return result.data
      .map(normalizeDescriptionRow)
      .filter((row) => row.theme && row.description);
  }

  function normalizePostRow(row, index) {
    const lower = lowerKeys(row);
    const orderNum = parseFloat(String(lower.order ?? "").replace(",", "."));
    return {
      id: (lower.id && String(lower.id).trim()) || `post-${index}`,
      theme: (lower.theme || "").trim(),
      order: Number.isFinite(orderNum) ? orderNum : index,
      title: (lower.title || "").trim(),
      body: (lower.body || lower.text || "").trim(),
      image: (lower.image || "").trim(),
    };
  }

  function parsePostsCsv(csvText) {
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    return result.data
      .map(normalizePostRow)
      .filter((post) => post.theme && (post.title || post.body));
  }

  async function loadDescriptions() {
    if (descriptionsCache) return descriptionsCache;
    if (descriptionsPromise) return descriptionsPromise;

    descriptionsPromise = (async () => {
      const remoteUrl =
        SITE_CONFIG.THEME_DESCRIPTIONS_CSV_URL && SITE_CONFIG.THEME_DESCRIPTIONS_CSV_URL.trim();

      if (remoteUrl) {
        try {
          const csvText = await fetchCsv(cacheBustUrl(remoteUrl));
          const rows = parseDescriptionsCsv(csvText);
          if (rows.length > 0) {
            descriptionsCache = rows;
            return descriptionsCache;
          }
          console.warn("Theme descriptions CSV loaded but contained no valid rows; falling back to sample data.");
        } catch (err) {
          console.warn("Could not load the theme descriptions CSV, falling back to sample data.", err);
        }
      }

      try {
        const csvText = await fetchCsv(SITE_CONFIG.THEME_DESCRIPTIONS_FALLBACK_CSV_PATH);
        descriptionsCache = parseDescriptionsCsv(csvText);
      } catch (err) {
        console.warn("Could not load the fallback theme descriptions CSV.", err);
        descriptionsCache = [];
      }
      return descriptionsCache;
    })();

    return descriptionsPromise;
  }

  async function loadPosts() {
    if (postsCache) return postsCache;
    if (postsPromise) return postsPromise;

    postsPromise = (async () => {
      const remoteUrl = SITE_CONFIG.THEME_POSTS_CSV_URL && SITE_CONFIG.THEME_POSTS_CSV_URL.trim();

      if (remoteUrl) {
        try {
          const csvText = await fetchCsv(cacheBustUrl(remoteUrl));
          const rows = parsePostsCsv(csvText);
          if (rows.length > 0) {
            postsCache = rows;
            return postsCache;
          }
          console.warn("Theme posts CSV loaded but contained no valid rows; falling back to sample data.");
        } catch (err) {
          console.warn("Could not load the theme posts CSV, falling back to sample data.", err);
        }
      }

      try {
        const csvText = await fetchCsv(SITE_CONFIG.THEME_POSTS_FALLBACK_CSV_PATH);
        postsCache = parsePostsCsv(csvText);
      } catch (err) {
        console.warn("Could not load the fallback theme posts CSV.", err);
        postsCache = [];
      }
      return postsCache;
    })();

    return postsPromise;
  }

  function getDescriptionForTheme(descriptions, themeName) {
    const match = descriptions.find((row) => row.theme === themeName);
    return match ? match.description : "";
  }

  function getPostsForTheme(posts, themeName) {
    return posts
      .filter((post) => post.theme === themeName)
      .sort((a, b) => a.order - b.order);
  }

  return { loadDescriptions, loadPosts, getDescriptionForTheme, getPostsForTheme };
})();
