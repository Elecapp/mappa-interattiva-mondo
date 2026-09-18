/**
 * THEMES INDEX PAGE
 * -----------------
 * Lists every theme found in the data as a clickable card, with a count
 * of how many items belong to it. Themes are entirely data-driven: the
 * researcher creates a new thematic path just by typing a new theme name
 * into the "themes" column of the spreadsheet.
 */

(async function initThemesPage() {
  const listEl = document.getElementById("theme-list");
  const statusEl = document.getElementById("themes-status");
  if (!listEl) return;

  try {
    if (statusEl) statusEl.textContent = "Loading thematic paths…";
    const items = await DataStore.loadItems();
    if (statusEl) statusEl.textContent = "";

    const counts = {};
    items.forEach((item) => {
      item.themes.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    const themes = Object.keys(counts).sort((a, b) => a.localeCompare(b));

    if (themes.length === 0) {
      listEl.innerHTML = `<p class="empty-state">No thematic paths yet. Add a value in the "themes" column of the spreadsheet to create one.</p>`;
      return;
    }

    listEl.innerHTML = themes
      .map(
        (theme) => `
        <a class="theme-card" href="theme.html?theme=${encodeURIComponent(theme)}">
          <h3>${theme}</h3>
          <p>${counts[theme]} item${counts[theme] === 1 ? "" : "s"}</p>
        </a>
      `
      )
      .join("");
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = "Could not load thematic paths.";
  }
})();
