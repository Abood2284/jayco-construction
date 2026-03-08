# SEO Layer

The SEO layer in `src/lib/seo/` exists to keep all search, discovery, and machine‑readable concerns in one place, instead of scattering them across individual pages.

## Folder purpose

- `src/lib/seo/config.ts` centralizes the canonical site URL and exposes an `absoluteUrl` helper so every part of the app builds full URLs consistently.
- `src/lib/seo/metadata.ts` encapsulates Next.js `Metadata` construction in a single `buildMetadata` helper so pages only declare intent (title, description, path) while the function enforces a shared title template, canonical URLs, and Open Graph/Twitter image rules.
- `src/lib/seo/schema.ts` builds JSON‑LD objects for organization, local business, breadcrumbs, and products in a strongly‑typed way so pages can drop in `<JsonLd>` components without manual schema wiring.
- `src/lib/seo/routes.ts` knows about all canonical routes (static pages, categories, products, gallery entries) and exposes them with simple priorities for downstream consumers.
- `src/lib/seo/sitemap.ts` turns route lists into XML sitemaps and sitemap indexes that search engines can crawl efficiently.
- `src/lib/seo/redirects.ts` exposes a typed view of legacy redirect rules, keeping the mapping in one place (JSON file) while giving application code a fast `Map` lookup for old → new paths.

Together, these modules provide a single, explicit surface for any code that needs canonical URLs, SEO metadata, or crawler‑facing XML/JSON‑LD output.

## How pages use the SEO layer

At the page level, the flow is:

1. A route file under `src/app/**/page.tsx` implements `generateMetadata` or uses a helper that calls `buildMetadata` with a title, description, and path.
2. The `buildMetadata` helper pulls `SiteSettings` from the CMS layer, applies the global title/description templates, and returns a fully formed `Metadata` object (HTML `<title>`, canonical tag, robots, Open Graph, and Twitter).
3. When richer schema is required, the page calls builders from `schema.ts` (for example `buildOrganizationSchema`, `buildBreadcrumbSchema`, or `buildProductSchema`) and passes the resulting JSON to the `<JsonLd>` UI helper.
4. XML sitemap routes and sitemap index files are generated server‑side by combining `getCanonicalRoutes` from `routes.ts` with the XML helpers in `sitemap.ts`.

This separation lets us evolve SEO behavior (title structure, default images, sitemap cadence, redirect policy) in one place without touching every page.

