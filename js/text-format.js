/**
 * TEXT FORMATTING
 * ---------------
 * Turns the plain text a researcher types into a Google Sheet cell into
 * formatted HTML, using a tiny Markdown-like syntax instead of asking her
 * to write HTML:
 *
 *   # Title            -> subheading (large)
 *   ## Subtitle         -> subheading (small)
 *   **bold**            -> <strong>
 *   *italic*            -> <em>
 *   (blank line)         -> new paragraph
 *
 * The raw text is HTML-escaped before any tag is added, so the sheet can
 * never inject arbitrary markup — only the handful of tags this file
 * produces.
 */

const TextFormat = (() => {
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  function renderInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  function toHtml(raw) {
    const text = (raw || "").trim();
    if (!text) return "";

    const blocks = escapeHtml(text).split(/\n\s*\n/);

    return blocks
      .map((block) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return `<h5 class="rich-text__subheading">${renderInline(trimmed.slice(3).trim())}</h5>`;
        }
        if (trimmed.startsWith("# ")) {
          return `<h4 class="rich-text__heading">${renderInline(trimmed.slice(2).trim())}</h4>`;
        }
        return `<p class="rich-text__paragraph">${renderInline(trimmed).replace(/\n/g, "<br>")}</p>`;
      })
      .join("");
  }

  return { toHtml };
})();
