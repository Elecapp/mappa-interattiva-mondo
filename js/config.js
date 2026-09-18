/**
 * SITE CONFIGURATION
 * -------------------
 * This is the ONLY file a developer normally needs to touch after launch.
 * The researcher never edits this file — she only edits the Google Sheet.
 *
 * HOW TO CONNECT YOUR GOOGLE SHEET
 * 1. Create a Google Sheet with these column headers in row 1 (exact names,
 *    lowercase, no accents):
 *      id, title, year, author, material, description, image, lat, lng,
 *      location_name, themes
 * 2. In Google Sheets: File > Share > Publish to web
 * 3. Choose the specific sheet/tab (not "Entire document"), pick "Comma
 *    separated values (.csv)" as the format, and click Publish.
 * 4. Copy the generated link and paste it below as SHEET_CSV_URL.
 * 5. Every time the researcher edits and saves the sheet, the published CSV
 *    updates automatically within a minute or two — the website will pick
 *    up the new data on the next page load, no rebuild needed.
 *
 * Until a Google Sheet is connected, the site falls back to the sample data
 * in data/sample-items.csv so you can develop and preview locally.
 *
 * HOW TO CONNECT THE THEMATIC PATH CONTENT SHEET (optional)
 * A second, separate Google Sheet lets the researcher edit the intro text
 * and post feed shown on each thematic path page (theme.html), without
 * touching code. That sheet has two tabs:
 *   - "descriptions": columns theme, description (one row per theme)
 *   - "posts": columns id, theme, order, title, body, image (several rows
 *     per theme, shown as cards in "order")
 * Publish EACH tab separately (File > Share > Publish to web > pick the
 * specific tab > "Comma separated values (.csv)" > Publish) and paste the
 * two resulting links below as THEME_DESCRIPTIONS_CSV_URL and
 * THEME_POSTS_CSV_URL. Leave them empty to use the bundled sample data.
 */

const SITE_CONFIG = {
  // Paste your published Google Sheet CSV link here. Leave empty ("") to
  // use the local sample data instead.
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1ZQVoQQ1trmU8ll2cEbxtoGnx6qtYsWwphS3QGK2oHJphBPPASxROUOSs0xwV72zYosF1ghD6o3Ux/pub?gid=725912554&single=true&output=csv",

  // Local fallback data (bundled with the site, used when SHEET_CSV_URL is
  // empty or fails to load).
  FALLBACK_CSV_PATH: "data/sample-items.csv",

  // Published CSV link for the "descriptions" tab of the thematic-path
  // content sheet. Leave empty ("") to use the local sample data instead.
  THEME_DESCRIPTIONS_CSV_URL: "",

  // Local fallback data for thematic path descriptions.
  THEME_DESCRIPTIONS_FALLBACK_CSV_PATH: "data/theme-descriptions.csv",

  // Published CSV link for the "posts" tab of the thematic-path content
  // sheet. Leave empty ("") to use the local sample data instead.
  THEME_POSTS_CSV_URL: "",

  // Local fallback data for thematic path posts.
  THEME_POSTS_FALLBACK_CSV_PATH: "data/theme-posts.csv",

  // Default map view (roughly centred on late medieval Western/Central
  // Europe). Adjust if your dataset covers a different region.
  MAP_CENTER: [48.5, 8.0],
  MAP_ZOOM: 4,
  MAP_MIN_ZOOM: 3,
  MAP_MAX_ZOOM: 12,

  // Site text
  SITE_TITLE: "Mapping Mobility in Late Medieval Europe",
  SITE_TAGLINE: "An interactive map of people, objects, and journeys across late medieval Europe",
};
