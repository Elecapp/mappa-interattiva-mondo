# Adding and editing items — a guide for the researcher

You never need to touch any code or the website itself. Everything you add
or change in the shared Google Sheet appears on the website automatically,
usually within a minute or two of saving.

The sheet link: **[paste the Google Sheet link here]**

## The columns

Each row in the sheet is one item on the map. Row 1 has the column names —
please don't rename, delete, or reorder them. Add new items in the next
empty row.

| Column | What to put there | Example |
|---|---|---|
| `id` | A unique number or short code for the row. Just count up. | `13` |
| `title` | The name of the item, as it should appear on the map. | `Pilgrim Badge from Canterbury` |
| `year` | The year (or approximate year) associated with the item. Plain numbers work best; "c. 1350" is fine too. | `1350` or `c. 1350` |
| `author` | Who made it, wrote it, or is associated with it. | `Unknown workshop, Canterbury` |
| `material` | What it's made of (or its format, for documents). | `Lead-tin alloy` |
| `description` | A short paragraph describing the item and its significance. | *(a few sentences)* |
| `image` | A link to a picture of the item. See below for how to get one. | `images/badge-13.jpg` |
| `lat` | The latitude of the place associated with the item. See below. | `51.2802` |
| `lng` | The longitude of the place associated with the item. See below. | `1.0789` |
| `location_name` | The place name, shown in the item's pop-up. | `Canterbury, Kingdom of England` |
| `themes` | Which thematic path(s) this item belongs to. Separate several with a semicolon. | `Pilgrimage` or `Pilgrimage;Trade Routes` |

**Leaving a column empty is fine** (except `title`, `lat`, and `lng` — a row
without valid coordinates won't appear on the map at all, since the site
doesn't know where to place it).

## Finding latitude and longitude

1. Open [Google Maps](https://www.google.com/maps) and search for or right-click
   the place.
2. Click the coordinates that appear (e.g. `51.279835, 1.080338`) — this
   copies them to your clipboard.
3. Paste the first number into `lat` and the second into `lng`.

## Adding an image

You have two easy options — no image-editing or coding needed:

**Option A — the image is already online** (a museum website, Wikimedia
Commons, a digital archive): right-click the image itself (not the page)
and choose "Copy image address" / "Copy image link", then paste that link
into the `image` column. It should end in something like `.jpg` or `.png`.

**Option B — you have the image file on your computer:** ask your
developer to add an `images/` folder to the website (already included in
this project) where you can drag and drop image files directly into the
project through GitHub's website — no software or commands required.
Then in the `image` column, write `images/` followed by the exact file
name, for example `images/badge-13.jpg`.

## Creating a new thematic path

Thematic paths are not pre-defined — they come entirely from what you type
in the `themes` column. To create a brand-new path (say, "Diplomacy"),
simply type `Diplomacy` into the `themes` column for the items that belong
to it. The next time someone visits the "Thematic Paths" page, "Diplomacy"
will appear there automatically, with a route connecting its items in
chronological order.

## Removing an item

Delete its entire row from the sheet (right-click the row number → Delete
row). It will disappear from the website the next time the page is loaded.

## A few things to avoid

- Don't rename the column headers in row 1.
- Don't leave the `id` column empty or reuse the same id twice.
- Keep `lat` / `lng` as plain numbers (no letters, no "N"/"E", no degree
  symbols).
- If a change doesn't seem to appear on the site, wait a minute or two and
  refresh the page — Google's published link updates on a short delay.

---

# Editing a thematic path's description and posts

Each thematic path page (the one you get to from "Thematic Paths") can also
show an introductory description and a feed of short posts underneath the
map. These come from a **second, separate Google Sheet** — the one with
"descriptions" and "posts" tabs — not the items sheet above.

The content sheet link: **[paste the content Google Sheet link here]**

## Tab 1 — "descriptions"

One row per thematic path.

| Column | What to put there | Example |
|---|---|---|
| `theme` | The exact name of the thematic path, spelled identically to how it appears in the `themes` column of the items sheet. | `Pilgrimage` |
| `description` | A short paragraph introducing the path, shown right under the page title. | *(a few sentences)* |

If a theme has no row here, the page simply shows no description — that's
fine, nothing breaks.

## Tab 2 — "posts"

Several rows per thematic path — one row per post/card.

| Column | What to put there | Example |
|---|---|---|
| `id` | A unique number or short code for the row. Just count up. | `1` |
| `theme` | The exact name of the thematic path this post belongs to. | `Pilgrimage` |
| `order` | A number controlling the order the cards appear in (lowest first). | `1`, `2`, `3`… |
| `title` | The post's title. | `Why pilgrim badges matter` |
| `body` | The post's text. | *(a short paragraph)* |
| `image` | Optional. A link to an image for the post. Leave empty for a text-only card. See below for how to get one. | |

If a theme has no rows here, the "Related posts" section simply doesn't
appear on that page.

## Getting an image link for a post

The easiest way is the same as for items: right-click an image already
online and choose "Copy image address" / "Copy image link", then paste it
into `image`.

If your image only exists as a file in Google Drive, you can turn its
share link into a direct image link without downloading or re-uploading
anything:

1. Upload the image to Drive, right-click it → **Share** → set access to
   "Anyone with the link", then **Copy link**. You'll get something like
   `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`.
2. Paste that link into a spare column in the sheet, then in the `image`
   column use a formula to convert it into a direct link, for example:

   ```
   ="https://drive.google.com/uc?export=view&id="&SUBSTITUTE(SUBSTITUTE(A1,"https://drive.google.com/file/d/",""),"/view?usp=sharing","")
   ```

   (replace `A1` with the cell holding the Drive share link). The `image`
   column then contains a plain URL, exactly like the ones you'd copy from
   a website — the site doesn't need to know it came from a formula.

## Publishing the content sheet

Just like the items sheet, each tab needs to be published **separately**:
in the content sheet, go to **File → Share → Publish to web**, pick the
"descriptions" tab, format "Comma-separated values (.csv)", **Publish**,
then repeat the same steps for the "posts" tab. Your developer needs both
resulting links once, to paste into the site's configuration — after that,
any edit and save in either tab appears on the site automatically within a
minute or two, exactly like the items sheet.
