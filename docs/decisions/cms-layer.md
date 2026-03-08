# CMS Layer

The CMS layer in `src/lib/cms/` models all of Jayco’s content and product data in TypeScript instead of relying on a remote headless CMS. It gives us strong types, predictable performance, and a clear upgrade path if we later move to an API‑driven source.

## Folder purpose

- `src/lib/cms/types.ts` defines the shape of all content: `SiteSettings`, `ProductCategory`, `Product`, `GalleryCategory`, `Client`, `CareersPage`, and form submission payloads. This is the single source of truth for what data exists and how components can safely consume it.
- `src/lib/cms/data.ts` contains the actual content as plain TypeScript objects (images, copy, specs, FAQs, etc.). Because it is static, it is trivially cacheable by the framework and works well with static rendering.
- `src/lib/cms/index.ts` exposes query‑style helpers such as `getSiteSettings`, `getProductCategories`, `getProducts`, `getFeaturedProducts`, `getGalleryCategories`, `getClients`, and convenience maps. These helpers implement read patterns (sorting, filtering, related items) so components do not need to understand the raw arrays.

The combination of `types.ts` + `data.ts` + `index.ts` gives the rest of the app a small, stable API surface: “ask the CMS layer for what you need, do not import raw data directly.”

## Why this approach

- **Performance & simplicity**: For a marketing + product catalogue site, static TypeScript data is enough and keeps runtime complexity low. There is no network latency or authentication required to read content.
- **Type safety end‑to‑end**: The `types.ts` definitions are reused throughout the app, so a change to a product shape surfaces as a TypeScript error wherever that data is consumed.
- **Easy to migrate later**: If we adopt a headless CMS or database in the future, we can keep the `index.ts` function signatures the same and swap their implementations to call an API instead of reading local arrays.

## How pages use the CMS layer

Pages and components should:

1. Import from `src/lib/cms` (the barrel file) instead of addressing `data.ts` directly.
2. Call the smallest helper that fits the need, for example:
   - `getSiteSettings()` for global company and SEO context.
   - `getProductCategories()` for navigation and category grids.
   - `getFeaturedProducts()` for homepage rails and mega menus.
   - `getProductsByCategory()` and `getProductByCategoryAndSlug()` for detail pages.
3. Treat the returned values as read‑only domain objects and avoid mutating them.

This keeps business logic around “how do we fetch and relate products, categories, galleries, and clients” centralized in one place instead of leaking into layout components.

