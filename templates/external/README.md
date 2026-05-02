# External CV Templates

This folder lets you add new CV template designs **without writing any JavaScript**. Drop in an HTML file with placeholders and add an entry to `manifest.json` — the site picks it up automatically on the next page load.

## How to add a new template

### Step 1 — Create your HTML file

Create a new `.html` file in this folder, e.g. `my-template.html`. Use placeholders to inject the user's CV data:

```html
<div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 40pt; color: {{color.text}};">
  <h1 style="color: {{color.primary}};">{{personal.fullName}}</h1>
  <p>{{personal.title}}</p>
  ...
</div>
```

### Step 2 — Add it to the manifest

Open `manifest.json` and add a new entry to the `templates` array:

```json
{
  "id": "my-template",
  "name": "My Template",
  "category": "Modern",
  "file": "my-template.html",
  "colors": ["navy", "slate", "burgundy", "forest", "charcoal"]
}
```

| Field | Required | What it does |
|-------|----------|--------------|
| `id` | yes | Unique short ID (used in URLs) |
| `name` | yes | Display name shown in the gallery |
| `category` | no | One of: `Modern`, `Traditional`, `Simple`, `Creative` (defaults to `Modern`) |
| `file` | yes | Filename inside this folder |
| `colors` | no | Which color schemes to register the template with. Defaults to all 5. |

### Step 3 — Push & deploy

Commit and push. Cloudflare redeploys automatically.

---

## Placeholder reference

### Personal details

```
{{personal.fullName}}     {{personal.email}}
{{personal.title}}        {{personal.phone}}
{{personal.location}}     {{personal.website}}
{{personal.linkedin}}
```

### Top-level fields

```
{{summary}}
```

### Color scheme (use these in inline styles)

```
{{color.primary}}     — Main brand color
{{color.secondary}}   — Slightly lighter accent
{{color.accent}}      — Soft tint of primary
{{color.text}}        — Body text color
{{color.muted}}       — Secondary text color
{{color.line}}        — Border / divider color
{{color.bgSoft}}      — Soft background tint
```

### Conditionals

Wrap a block to render only when a field has a value:

```
{{#if summary}}
  <p>{{summary}}</p>
{{/if}}
```

### Loops

For repeating sections (experience, education, projects, certifications, languages):

```
{{#each experience}}
  <div>
    <strong>{{role}}</strong> at {{company}}
    <span>{{start}} – {{end}}</span>
    {{#if location}}<span>{{location}}</span>{{/if}}
    {{#each bullets}}
      <li>{{.}}</li>
    {{/each}}
  </div>
{{/each}}
```

`{{.}}` refers to the current item when looping over a list of strings (like `bullets` or `skills`).

### Available collections

| Field | Item shape |
|-------|-----------|
| `experience` | `{ role, company, location, start, end, bullets[] }` |
| `education` | `{ degree, school, location, start, end, notes }` |
| `skills` | `string[]` (use `{{.}}`) |
| `projects` | `{ name, link, description }` |
| `certifications` | `{ name, issuer, date }` |
| `languages` | `{ name, level }` |

`additionalSections` are appended automatically below your template — you don't need to render them.

---

## Tips

- **Keep CSS inline.** External CSS won't apply when the resume is exported to PDF.
- **Use point units (`pt`)** for fonts and spacing so PDFs match the on-screen preview.
- **Wrap your content in `<div class="resume-doc">`** with width-friendly padding so it fills the A4 frame correctly.
- **Test by previewing locally**, then check the PDF and Word export both render the same way.
- **Want fewer color variants?** Set `"colors": ["navy"]` in the manifest to register only one variant.

---

## Examples in this folder

- `clean-pro.html` — A clean modern single-column template
- `executive-classic.html` — A traditional centered serif template

Open them in any code editor to see complete working examples of every placeholder type.
