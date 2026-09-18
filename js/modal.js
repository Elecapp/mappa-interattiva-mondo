/**
 * ITEM DETAIL MODAL
 * -----------------
 * A small, dependency-free modal used by both the main map and the
 * thematic path pages to show full item details on click.
 */

const ItemModal = (() => {
  let overlayEl = null;

  function ensureOverlay() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement("div");
    overlayEl.className = "modal-overlay";
    overlayEl.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="modal-content"></div>
      </div>
    `;
    document.body.appendChild(overlayEl);

    overlayEl.addEventListener("click", (e) => {
      if (e.target === overlayEl) close();
    });
    overlayEl.querySelector(".modal-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    return overlayEl;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  function themesMarkup(themes) {
    if (!themes || themes.length === 0) return "";
    const chips = themes
      .map(
        (t) =>
          `<a class="theme-chip" href="theme.html?theme=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`
      )
      .join("");
    return `<div class="modal-themes">${chips}</div>`;
  }

  function open(item) {
    const overlay = ensureOverlay();
    const content = overlay.querySelector(".modal-content");

    const imageMarkup = item.image
      ? `<img class="modal-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.style.display='none'">`
      : "";

    content.innerHTML = `
      ${imageMarkup}
      <h2 class="modal-title">${escapeHtml(item.title)}</h2>
      <div class="modal-meta">
        ${item.year ? `<span><strong>Year:</strong> ${escapeHtml(item.year)}</span>` : ""}
        ${item.author ? `<span><strong>Author / origin:</strong> ${escapeHtml(item.author)}</span>` : ""}
        ${item.material ? `<span><strong>Material:</strong> ${escapeHtml(item.material)}</span>` : ""}
        ${item.locationName ? `<span><strong>Place:</strong> ${escapeHtml(item.locationName)}</span>` : ""}
      </div>
      ${item.description ? `<p class="modal-description">${escapeHtml(item.description)}</p>` : ""}
      ${themesMarkup(item.themes)}
    `;

    overlay.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function close() {
    if (!overlayEl) return;
    overlayEl.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  return { open, close };
})();
