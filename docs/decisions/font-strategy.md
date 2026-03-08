# Font Strategy (Quilon & Rowan)

Jayco uses two custom local fonts to establish a distinct industrial brand feel while keeping readability high for dense technical content.

## Fonts and roles

- **Quilon** (heading font)
  - Loaded from `public/fonts/quilon/*.woff2`.
  - Used for all headings, key metrics, and brand marks.
  - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).
  - Character: condensed, engineered look suited to heavy‑industrial branding.
- **Rowan** (body font)
  - Loaded from `public/fonts/rowan/*.woff2`.
  - Used for all paragraph copy, lists, and long‑form content.
  - Weights: 300–600 with both roman and italic styles.
  - Character: calm, legible serif suitable for data‑heavy product pages and blogs.

## Implementation details

- Fonts are wired through `next/font/local` in `src/lib/font.ts`.
- `headingFont` and `bodyFont` are exported with:
  - `variable: "--font-heading"` for Quilon.
  - `variable: "--font-body"` for Rowan.
- `src/app/layout.tsx` applies both variables on the `<body>` element:
  - `className={`${headingFont.variable} ${bodyFont.variable}`}`
- `src/app/globals.css` then uses these variables:
  - `body { font-family: var(--font-body), system-ui, -apple-system, sans-serif; }`
  - `h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading), system-ui, sans-serif; }`

This design keeps the font choice centralized: changing fonts later only requires updates in `font.ts` and the CSS variables, without touching individual components.

## Usage guidelines

- **Headings and brand elements**
  - Use components and HTML elements that inherit the heading font (e.g. `h1–h6`, hero titles, metrics).
  - For numbers and short labels, prefer Quilon to emphasize key KPIs.
- **Body and rich text**
  - Use Rowan for any multi‑line text: technical specs, applications, FAQs, and blog content.
  - Use the italic weights for notes, compliance remarks, and pull‑quotes instead of introducing a third font.

Following this pattern keeps typography opinionated but simple: two fonts, clear roles, and one wiring point.

