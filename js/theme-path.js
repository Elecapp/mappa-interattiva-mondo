/**
 * SINGLE THEMATIC PATH PAGE (theme.html?theme=Pilgrimage)
 * --------------------------------------------------------
 * Shows only the items belonging to one theme, listed underneath as a
 * chronological itinerary (items with a recognizable year are sorted and
 * numbered; undated items are listed separately), plus an optional
 * description and post feed for the theme.
 */

(async function initThemePathPage() {
  const params = new URLSearchParams(window.location.search);
  const themeName = params.get("theme");

  const titleEl = document.getElementById("theme-title");
  const introEl = document.getElementById("theme-intro");
  const descriptionEl = document.getElementById("theme-description");
  const statusEl = document.getElementById("theme-status");
  const listEl = document.getElementById("theme-item-list");
  const postsSectionEl = document.getElementById("theme-posts");
  const postsListEl = document.getElementById("theme-posts-list");

  if (!listEl) return;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  if (!themeName) {
    if (titleEl) titleEl.textContent = "No theme selected";
    if (introEl) introEl.textContent = "Choose a thematic path from the themes page.";
    return;
  }

  if (titleEl) titleEl.textContent = themeName;

  // Must match .post-item__panel's transition-duration in css/style.css.
  const POST_TRANSITION_MS = 250;

  // Expands or collapses one post's panel, animating its height. Each post
  // toggles independently of the others. Post-transition cleanup runs on a
  // plain timer (matched to the CSS transition duration) rather than a
  // "transitionend" listener, since browsers can skip or delay that event
  // (background tabs, reduced-motion settings, interrupted transitions).
  function setPostOpen(article, open) {
    const button = article.querySelector(".post-item__toggle");
    const panel = article.querySelector(".post-item__panel");

    if (panel.animationTimer) clearTimeout(panel.animationTimer);

    if (open) {
      panel.hidden = false;
      const targetHeight = panel.scrollHeight;
      panel.style.maxHeight = "0px";
      // Force a reflow so the browser registers the 0px state before it's
      // changed again below — otherwise the two assignments collapse into
      // one and there's nothing to transition.
      void panel.offsetHeight;
      panel.style.maxHeight = `${targetHeight}px`;
      article.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      // Once open, drop the fixed max-height so the panel can grow
      // naturally afterwards (e.g. a lazy-loaded image finishing loading).
      panel.animationTimer = setTimeout(() => {
        panel.style.maxHeight = "none";
      }, POST_TRANSITION_MS);
    } else {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      void panel.offsetHeight;
      panel.style.maxHeight = "0px";
      article.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      panel.animationTimer = setTimeout(() => {
        panel.hidden = true;
        panel.style.maxHeight = "";
      }, POST_TRANSITION_MS);
    }
  }

  if (postsListEl) {
    postsListEl.addEventListener("click", (e) => {
      const button = e.target.closest(".post-item__toggle");
      if (!button) return;
      const article = button.closest(".post-item");
      const isOpen = button.getAttribute("aria-expanded") === "true";
      setPostOpen(article, !isOpen);
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
          .map((post, index) => {
            const panelId = `theme-post-panel-${index}-${post.id}`;
            const imageMarkup = post.image
              ? `<img class="post-item__image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" onerror="this.style.display='none'">`
              : "";
            return `
              <article class="post-item">
                <h3 class="post-item__heading">
                  <button type="button" class="post-item__toggle" aria-expanded="false" aria-controls="${panelId}">
                    <span class="post-item__title">${escapeHtml(post.title || "Untitled post")}</span>
                    <span class="post-item__chevron" aria-hidden="true">&#9662;</span>
                  </button>
                </h3>
                <div class="post-item__panel" id="${panelId}" hidden>
                  <div class="post-item__panel-inner">
                    ${imageMarkup}
                    ${post.body ? `<p class="post-item__text">${escapeHtml(post.body)}</p>` : ""}
                  </div>
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
      listEl.innerHTML = `<p class="empty-state">No items are tagged with this theme yet.</p>`;
      return;
    }

    // Items with a recognizable year are sorted chronologically and
    // numbered; undated items are listed afterwards, unnumbered.
    const dated = themeItems.filter((i) => i.sortYear !== null).sort((a, b) => a.sortYear - b.sortYear);
    const undated = themeItems.filter((i) => i.sortYear === null);
    const orderedForList = [...dated, ...undated];

    listEl.innerHTML = orderedForList
      .map((item) => {
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
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = "Could not load this thematic path.";
  }
})();
