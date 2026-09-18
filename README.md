# Mapping Mobility in Late Medieval Europe

An interactive map website for exploring items (objects, documents, records)
connected to human mobility in late medieval Europe. Visitors can browse an
interactive map, click points to see item details, or follow curated
thematic paths (e.g. "Pilgrimage", "Trade Routes") that draw a chronological
route across the map.

The site is **static** (plain HTML/CSS/JavaScript, no build step, no
server, no database to run) and reads its data from a **Google Sheet**, so
the researcher can add, edit, or remove items herself without touching any
code. See [`docs/DATA-ENTRY-GUIDE.md`](docs/DATA-ENTRY-GUIDE.md) for the
non-technical guide to send her.

---

## How it works

```
Google Sheet (data entry)
      │  File > Share > Publish to web (CSV)
      ▼
Published CSV URL  ──configured in──▶  js/config.js
      │
      ▼
js/data.js  (fetches + parses the CSV with PapaParse)
      │
      ├──▶ js/map.js          → index.html    (full map, all items)
      ├──▶ js/themes.js       → themes.html   (list of thematic paths)
      └──▶ js/theme-path.js   → theme.html    (one thematic path + route)
```

No backend, no database server, no build tooling. The "database" is the
Google Sheet itself; the site just reads it as CSV on every page load.

## Folder structure

```
index.html          Main interactive map (all items)
themes.html          Index of thematic paths (auto-generated from data)
theme.html           A single thematic path, with a chronological route
about.html           Project description — edit this with real project text
css/style.css        All styling (design tokens at the top of the file)
js/config.js         ⭐ Site settings — Google Sheet URL, map defaults, title
js/data.js           Fetches & normalizes the CSV data
js/map.js            Logic for the main map page
js/themes.js         Logic for the thematic-paths index page
js/theme-path.js      Logic for a single thematic-path page (route + list)
js/modal.js          Shared "item detail" popup used by every page
data/sample-items.csv Bundled sample data (fallback + local development)
vendor/              Local copies of Leaflet and PapaParse (no external
                      CDN dependency — the site works even if a CDN is
                      blocked or offline-cached)
docs/DATA-ENTRY-GUIDE.md  Non-technical guide for the researcher
```

## Running it locally

Because the site loads data with `fetch()`, it needs to be served over
`http://`, not opened directly as a `file://` path (browsers block that for
security reasons). From the project folder, run:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000/index.html` in a browser. Any other
static server works too (VS Code's "Live Server" extension, `npx serve`,
etc.).

With no Google Sheet configured yet, the site automatically uses the
bundled sample data in `data/sample-items.csv` — 12 example items already
in place so you can see the full site (map, thematic paths, routes) working
end to end before connecting the real spreadsheet.

## Connecting the Google Sheet

1. Create a Google Sheet with exactly these column headers in row 1:

   ```
   id, title, year, author, material, description, image, lat, lng, location_name, themes
   ```

2. In the Sheet: **File → Share → Publish to web**. Choose the specific
   sheet/tab (not "Entire document"), format **Comma-separated values
   (.csv)**, then **Publish**.
3. Copy the generated URL.
4. Open `js/config.js` and paste it into `SHEET_CSV_URL`:

   ```js
   SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv",
   ```

5. Commit and push. From then on, whenever the researcher edits and saves
   the sheet, the published CSV updates within a minute or two, and the
   site picks up the new data on the next page load — no redeploy needed.

Column notes:

- `themes` can hold several values separated by `;` (e.g.
  `Pilgrimage;Trade Routes`). A new thematic path appears on `themes.html`
  automatically the moment any row uses a new value there — nothing to
  configure.
- `lat` / `lng` are decimal degrees (e.g. `45.4408, 12.3155` for Venice).
  Rows missing valid coordinates are silently skipped so a typo can't break
  the whole map.
- `year` is free text (it's just displayed), but the app also extracts the
  first 3–4 digit number from it to sort thematic-path routes
  chronologically, so plain years like `1350` work best. Something like
  `c. 1350` still sorts correctly because the app finds the `1350` inside
  it.
- `image` should be a direct link to an image file (ending in `.jpg`,
  `.png`, etc.) — see the data-entry guide for the two easy ways to get
  one.

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this folder to it (see the
   commands `git log` / `git remote` already set up if this was delivered
   as a git repo, or run `git init` if not).
2. In the repository: **Settings → Pages → Build and deployment → Source:
   Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
3. GitHub gives you a URL like `https://<username>.github.io/<repo>/`
   within a minute or two.

No build step is required — GitHub Pages serves the HTML/CSS/JS files as-is.

## Customizing

- **Site title / tagline / default map view**: `js/config.js`.
- **Colors / fonts / spacing**: CSS custom properties at the top of
  `css/style.css` (`--color-accent`, `--font-serif`, etc.) — change them
  once and the whole site updates.
- **About page text, citation, contact info**: edit `about.html` directly
  (replace the `<em>` placeholder paragraphs).
- **Navigation links**: the `<nav class="site-nav">` block, repeated at the
  top of each HTML file.

## Adding a new page or feature

Each page is self-contained plain HTML with its own small JS file, so you
can duplicate `theme.html` + `js/theme-path.js` as a starting point for a
new page type, or add a new `<script>` to any page. There's no framework or
build step to learn — everything is readable top-to-bottom.
