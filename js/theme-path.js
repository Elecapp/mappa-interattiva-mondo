/**
 * SINGLE THEMATIC PATH PAGE (theme.html?theme=Pilgrimage)
 * --------------------------------------------------------
 * Shows only the items belonging to one theme, draws a chronological
 * route line connecting them on the map (items with a recognizable year
 * are sorted and numbered), and lists them underneath as an itinerary.
 */

(async function initThemePathPage() {
  const mapEl = document.getElementById("theme-map");
  if (!mapEl) return;

  const params = new URLSearchParams(window.location.search);
  const themeName = params.get("theme");

  const titleEl = document.getElementById("theme-title");
  const introEl = document.getElementById("theme-intro");
  const descriptionEl = document.getElementById("theme-description");
  const statusEl = document.getElementById("theme-status");
  const listEl = document.getElementById("theme-item-list");
  const postsSectionEl = document.getElementById("theme-posts");
  const postsListEl = document.getElementById("theme-posts-list");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  if (!themeName) {
    if (titleEl) titleEl.textContent = "No theme selected";
    if (introEl) introEl.textContent = "Choose a thematic path from the themes page.";
    mapEl.style.display = "none";
    return;
  }

  if (titleEl) titleEl.textContent = themeName;

  const map = L.map("theme-map", {
    minZoom: SITE_CONFIG.MAP_MIN_ZOOM,
    maxZoom: SITE_CONFIG.MAP_MAX_ZOOM,
  }).setView(SITE_CONFIG.MAP_CENTER, SITE_CONFIG.MAP_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: SITE_CONFIG.MAP_MAX_ZOOM,
  }).addTo(map);

  function numberedIcon(n) {
    return L.divIcon({
      className: "route-marker",
      html: `<span>${n}</span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }

  try {
    if (statusEl) statusEl.textContent = "Loading path…";
    const [allItems, descriptions, posts] = await Promise.all([
      DataStore.loadItems(),
      ThemeContent.loadDescriptions(),
      ThemeContent.loadPosts(),
    ]);
    if (statusEl) statusEl.textContent = "";

    const themeItems = allItems.filter((item) => item.themes.includes(themeName));

    if (introEl) {
      introEl.textContent = `${themeItems.length} item${themeItems.length === 1 ? "" : "s"} on this thematic path.`;
    }

    if (descriptionEl) {
      const description = ThemeContent.getDescriptionForTheme(descriptions, themeName);
      if (description) {
        descriptionEl.textContent = description;
        descriptionEl.hidden = false;
      } else {
        descriptionEl.hidden = true;
      }
    }

    if (postsSectionEl && postsListEl) {
      const themePosts = ThemeContent.getPostsForTheme(posts, themeName);
      if (themePosts.length > 0) {
        postsListEl.innerHTML = themePosts
          .map((post) => {
            const imageMarkup = post.image
              ? `<img class="post-card__image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" onerror="this.style.display='none'">`
              : "";
            return `
              <article class="post-card">
                ${imageMarkup}
                <div class="post-card__body">
                  ${post.title ? `<h3 class="post-card__title">${escapeHtml(post.title)}</h3>` : ""}
                  ${post.body ? `<p class="post-card__text">${escapeHtml(post.body)}</p>` : ""}
                </div>
              </article>
            `;
          })
          .join("");
        postsSectionEl.hidden = false;
      } else {
        postsSectionEl.hidden = true;
      }
    }

    if (themeItems.length === 0) {
      if (listEl) listEl.innerHTML = `<p class="empty-state">No items are tagged with this theme yet.</p>`;
      return;
    }

    // Items with a recognizable year are sorted chronologically and drawn
    // as a numbered route; undated items are still shown as plain markers.
    const dated = themeItems.filter((i) => i.sortYear !== null).sort((a, b) => a.sortYear - b.sortYear);
    const undated = themeItems.filter((i) => i.sortYear === null);

    const bounds = [];

    dated.forEach((item, index) => {
      const marker = L.marker([item.lat, item.lng], { icon: numberedIcon(index + 1) }).addTo(map);
      marker.bindTooltip(`${index + 1}. ${item.title} (${item.year})`, { direction: "top" });
      marker.on("click", () => ItemModal.open(item));
      bounds.push([item.lat, item.lng]);
    });

    if (dated.length > 1) {
      L.polyline(
        dated.map((i) => [i.lat, i.lng]),
        { color: "#7a2e2e", weight: 2, dashArray: "6 6", opacity: 0.8 }
      ).addTo(map);
    }

    undated.forEach((item) => {
      const marker = L.circleMarker([item.lat, item.lng], {
        radius: 7,
        weight: 2,
        color: "#7a2e2e",
        fillColor: "#c9c9c9",
        fillOpacity: 0.9,
      }).addTo(map);
      marker.bindTooltip(item.title, { direction: "top" });
      marker.on("click", () => ItemModal.open(item));
      bounds.push([item.lat, item.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: SITE_CONFIG.MAP_MAX_ZOOM });
    }

    if (listEl) {
      const orderedForList = [...dated, ...undated];
      listEl.innerHTML = orderedForList
        .map((item, i) => {
          const stepLabel = item.sortYear !== null ? dated.indexOf(item) + 1 : null;
          return `
            <li class="theme-item-row" data-id="${item.id}">
              ${stepLabel ? `<span class="step-badge">${stepLabel}</span>` : `<span class="step-badge step-badge--muted">–</span>`}
              <div>
                <strong>${item.title}</strong>
                <span class="theme-item-meta">${item.year ? item.year : "undated"}${item.locationName ? " · " + item.locationName : ""}</span>
              </div>
            </li>
          `;
        })
        .join("");

      listEl.querySelectorAll(".theme-item-row").forEach((row) => {
        row.addEventListener("click", () => {
          const item = orderedForList.find((i) => i.id === row.dataset.id);
          if (item) ItemModal.open(item);
        });
      });
    }
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = "Could not load this thematic path.";
  }
})();
