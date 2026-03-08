# Jayco Industrial Website Rebuild

Next.js (App Router) + TypeScript rebuild focused on SEO-safe migration, clean route architecture, crawlability, and CMS-ready dynamic content.

## Route Architecture

- `/`
- `/about`
- `/clients`
- `/gallery`
- `/gallery/[galleryCategorySlug]`
- `/careers`
- `/contact`
- `/products`
- `/products/[categorySlug]`
- `/products/[categorySlug]/[productSlug]`

## SEO Foundation

- Canonical + unique metadata helpers in `src/lib/seo/metadata.ts`
- JSON-LD:
  - Organization (Home)
  - LocalBusiness (Contact)
  - BreadcrumbList + Product (Product pages)
- Sitemap index and segmented sitemaps:
  - `/sitemap.xml`
  - `/sitemap-pages.xml`
  - `/sitemap-products.xml`
  - `/sitemap-gallery.xml`
- `robots.txt` generated via `src/app/robots.ts`
- Server-side normalization/redirects in `middleware.ts` and `next.config.ts`

## Migration Pack

- Legacy redirect rules source: `src/lib/seo/legacy-redirect-rules.json`
- Generated mapping CSV: `scripts/output/redirect-map.csv`
- URL inventory CSV seed: `scripts/output/legacy-url-inventory.csv`

### Scripts

- Crawl legacy URLs:
  - `npm run seo:crawl -- https://legacy-domain.com scripts/output/legacy-url-inventory.csv`
- Generate redirect map CSV:
  - `npm run seo:redirects`

## Forms

- Contact API: `src/app/api/forms/contact/route.ts`
- Careers API: `src/app/api/forms/careers/route.ts`
- Spam protection: honeypot + in-memory IP rate limiting
- Persistence: JSONL logs in `/tmp/jayco-submissions`
- Resume uploads stored in `/tmp/jayco-submissions/resumes`

Optional env vars:

- `FORM_STORAGE_DIR` (override storage path)
- `FORM_NOTIFICATION_EMAIL` (enables notification hook)
- `NEXT_PUBLIC_SITE_URL` (canonical base URL)

## Dev

```bash
npm run dev
```

## Lint + Build

```bash
npm run lint
npm run build
```

## Cloudflare

```bash
npm run preview
npm run deploy
```
