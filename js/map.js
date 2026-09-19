/**
 * MAIN MAP PAGE
 * -------------
 * Renders every item as a clickable marker on a Leaflet/OpenStreetMap map,
 * with an optional year and theme filter above the map.
 */

(async function initMapPage() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const statusEl = document.getElementById("map-status");
  const themeFilterEl = document.getElementById("theme-filter");
  const searchEl = document.getElementById("item-search");
  const countEl = document.getElementById("item-count");

  const map = L.map("map", {
    minZoom: SITE_CONFIG.MAP_MIN_ZOOM,
    maxZoom: SITE_CONFIG.MAP_MAX_ZOOM,
  }).setView(SITE_CONFIG.MAP_CENTER, SITE_CONFIG.MAP_ZOOM);

  // Esri's "Light Gray Canvas" basemap: same light, minimal look as CARTO
  // Positron, but free to use without an API key (CARTO's raster basemaps
  // now require one and otherwise stamp "API key required" on every tile).
  const basemapAttribution =
    "Esri, HERE, Garmin, &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, and the GIS community";

  L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    { attribution: basemapAttribution, maxZoom: SITE_CONFIG.MAP_MAX_ZOOM }
  ).addTo(map);

  // Reference layer adds place labels/borders on top of the plain base.
  L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: SITE_CONFIG.MAP_MAX_ZOOM }
  ).addTo(map);

  let markers = [];
  let allItems = [];

  function clearMarkers() {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
  }

  function renderMarkers(items) {
    clearMarkers();
    items.forEach((item) => {
      const marker = L.circleMarker([item.lat, item.lng], {
        radius: 8,
        weight: 2,
        color: "#7a2e2e",
        fillColor: "#c9553d",
        fillOpacity: 0.85,
      }).addTo(map);

      marker.bindTooltip(item.title, { direction: "top", offset: [0, -6] });
      marker.on("click", () => ItemModal.open(item));
      markers.push(marker);
    });
    if (countEl) {
      countEl.textContent = `${items.length} item${items.length === 1 ? "" : "s"} shown`;
    }
  }

  function populateThemeFilter(items) {
    if (!themeFilterEl) return;
    const themes = DataStore.getAllThemes(items);
    themes.forEach((theme) => {
      const opt = document.createElement("option");
      opt.value = theme;
      opt.textContent = theme;
      themeFilterEl.appendChild(opt);
    });
  }

  function applyFilters() {
    const themeValue = themeFilterEl ? themeFilterEl.value : "";
    const searchValue = searchEl ? searchEl.value.trim().toLowerCase() : "";

    const filtered = allItems.filter((item) => {
      const matchesTheme = !themeValue || item.themes.includes(themeValue);
      const matchesSearch =
        !searchValue ||
        item.title.toLowerCase().includes(searchValue) ||
        item.author.toLowerCase().includes(searchValue) ||
        item.locationName.toLowerCase().includes(searchValue);
      return matchesTheme && matchesSearch;
    });

    renderMarkers(filtered);
  }

  if (themeFilterEl) themeFilterEl.addEventListener("change", applyFilters);
  if (searchEl) searchEl.addEventListener("input", applyFilters);

  try {
    if (statusEl) statusEl.textContent = "Loading items…";
    allItems = await DataStore.loadItems();
    if (statusEl) statusEl.textContent = "";

    populateThemeFilter(allItems);
    renderMarkers(allItems);

    if (allItems.length === 0 && statusEl) {
      statusEl.textContent = "No items found yet. Check back soon.";
    }
  } catch (err) {
    console.error(err);
    if (statusEl) {
      statusEl.textContent = "Could not load the map data. Please try again later.";
    }
  }
})();
