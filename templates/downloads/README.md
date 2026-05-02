# Downloadable CV Templates

This folder powers the **categorized template gallery** at the top of `templates.html`. Each section appears as a row of cards on the page. To add a real template, drop the file into the right subfolder and add an entry to `manifest.json`.

## Folder structure

```
templates/downloads/
├── manifest.json           ← Edit this to register templates
├── _placeholder.svg        ← Generic preview shown when a template lacks one
├── README.md               ← (you are here)
│
├── recent-2026/            ← One subfolder per section
├── ats-friendly/
├── modern/
├── professional/
├── minimalist/
├── creative/
├── with-photo/
├── entry-level/
├── executive-2page/
├── career-change/
├── skill-based/
└── word/
```

Each section folder is where you put the actual `.docx`, `.pdf`, or `.doc` files **and** the preview image (PNG/JPG) for each one.

## How to add a new template (3 steps)

### Step 1 — Drop the files into the section folder

For example, to add a Word template to "Recent Templates 2026":

```
templates/downloads/recent-2026/
├── modern-blueprint-2026.docx       ← The file users download
└── modern-blueprint-2026.png        ← Preview image (recommended size: 680 × 880)
```

### Step 2 — Add an entry to `manifest.json`

Open `manifest.json`, find the matching section, and add a new object to its `templates` array:

```json
{
  "id": "recent-2026",
  "name": "Recent Templates 2026",
  ...
  "templates": [
    {
      "id": "modern-blueprint-2026",
      "name": "Modern Blueprint 2026",
      "file": "modern-blueprint-2026.docx",
      "preview": "modern-blueprint-2026.png",
      "format": "WORD",
      "tag": "ATS-friendly"
    }
  ]
}
```

### Step 3 — Commit & push

```bash
git add templates/downloads
git commit -m "Add new templates to <section name>"
git push
```

Cloudflare redeploys, the new card appears in that section automatically.

## Field reference

Each entry in a section's `templates` array supports:

| Field | Required | What it does |
|-------|----------|--------------|
| `id` | yes | Unique short ID (kebab-case) |
| `name` | yes | Display name on the card |
| `file` | yes | Filename inside the section folder |
| `preview` | no | Preview image filename (falls back to a generic placeholder) |
| `format` | no | Format label shown on the card. Auto-detected from extension if omitted (`.docx → WORD`, `.pdf → PDF`) |
| `tag` | no | Optional small tag like "ATS-friendly", "1 page", "Photo" |
| `downloadAs` | no | Override the filename users see when downloading |

## How sections behave

- **All 12 sections always show**, even when empty
- **If a section has fewer than 3 real templates, "Coming soon" placeholder cards fill the row** so the gallery looks complete
- **Add at least 3 real templates per section** to remove all placeholders
- **The TOC at the top** auto-generates from the manifest — quick links to every section

## Preview image tips

- **Aspect ratio: 8.5 / 11** (US Letter / A4) — matches the card shape
- **Recommended size: 680 × 880 px** (or larger; the browser scales them down)
- **Format: PNG or JPG** — keep under ~150 KB each so the page stays fast
- **Quick way to make one**: open the .docx in Word → File → Export → As PDF → screenshot the first page → crop → save as PNG
- **Alternatives**: use a free tool like [Cloud Convert](https://cloudconvert.com/docx-to-png) or open the docx in Pages/LibreOffice and export as image

## Tips

- **Sections are renderable even with zero entries** — push a manifest with empty arrays and you'll see all 12 sections with placeholders
- **Filenames with spaces work** but use hyphens or underscores for cleaner URLs (`modern-blueprint-2026.docx` rather than `Modern Blueprint 2026.docx`)
- **You can rename or reorder sections** by editing `manifest.json` — the page picks it up automatically

## Section IDs (use these in the manifest)

| Section | ID |
|---------|-----|
| Recent Templates 2026 | `recent-2026` |
| ATS Friendly Resumes | `ats-friendly` |
| Modern Resume Templates | `modern` |
| Professional Resume Templates | `professional` |
| Simple & Minimalist Templates | `minimalist` |
| Creative Resume Templates | `creative` |
| Resume Templates with Photo | `with-photo` |
| Entry Level Resumes | `entry-level` |
| 2-Page Executive Resume Templates | `executive-2page` |
| Career Change Resume Templates | `career-change` |
| Skill-Based Resume Templates | `skill-based` |
| Word CV Templates | `word` |
