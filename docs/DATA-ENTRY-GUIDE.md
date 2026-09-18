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
