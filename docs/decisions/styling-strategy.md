# Styling Strategy (Tailwind v4 + Design Tokens)

The project uses Tailwind CSS v4 for component‑level styling and a small set of CSS custom properties as global design tokens. The goal is to avoid a 90s “boxy” look while keeping the system maintainable for a data‑heavy industrial site.

## Division of responsibilities

- **Design tokens in `globals.css`**
  - Colors (background, surfaces, text, accent, lines).
  - Layout constants such as `--container`.
  - Base resets for `*`, `html`, `body`, typography, links, and images.
- **Component styling with Tailwind utilities**
  - Layout, spacing, borders, and hover/active states live next to the JSX via Tailwind classes.
  - Section‑level patterns (hero, metrics bands, cards, footer) are encoded directly on components like `HeroSection`, `CapabilityBand`, and `Footer`.

By pushing layout and component styles into Tailwind classes, we avoid a scattered mix of BEM‑style classes in `globals.css` and keep each component self‑contained.

## What we are phasing out

The legacy global classes (for example `.hero`, `.card-grid`, `.trust-band`, `.site-footer`, `.footer-grid`, `.breadcrumbs`, `.spec-table`, `.faq-list`, `.category-link-blocks`) are being removed from `globals.css` and reimplemented as Tailwind utility compositions at the component level.

This makes it easier to:

- Reason about where a visual rule comes from.
- Safely refactor individual sections (such as the header or hero) without risking unrelated pages.
- Gradually evolve the design as we refine Jayco’s visual language.

## Design direction

- **Industrial premium, not retro**:
  - Light, slightly warm background.
  - High‑contrast dark slate anchors for header, footer, and key panels.
  - Amber accent (`--accent`) for CTAs and metrics.
- **Shapes and motion**:
  - Medium‑tight radii on cards and panels.
  - Subtle elevation and translation on hover, avoiding heavy drop shadows.
  - Tailwind’s transition utilities for quick, consistent motion.

New components should prefer Tailwind utilities plus the shared CSS variables instead of adding new global CSS class blocks.

