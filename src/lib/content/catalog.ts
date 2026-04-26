// src/lib/content/catalog.ts
import productImageManifest from "./product-image-manifest.json";
import type { Dirent } from "node:fs"
import { readdir, readFile, stat } from "node:fs/promises"
import { join } from "node:path"


import { compileMDX } from "next-mdx-remote/rsc"

import type { Product, ProductCategory, ProductSpec } from "@/lib/cms/types"
import { getProductMdxSource } from "@/lib/content/get-product-mdx-source"
import { listProductMdxSlugsFromDatabase } from "@/lib/mongodb/list-product-mdx-slugs"

const PRODUCTS_ROOT = join(process.cwd(), "content", "products")
const PRODUCT_IMAGE_PUBLIC_ROOT = "/images/products"
const PRODUCT_IMAGE_FS_ROOT = join(process.cwd(), "public", "images", "products")

const GALLERY_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"]
const PRODUCT_IMAGE_MANIFEST = productImageManifest as Record<string, string[]>;

function hasGalleryExtension(name: string): boolean {
	const lower = name.toLowerCase()
	return GALLERY_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

interface ProductFrontmatter {
	title: string
	description: string
	categorySlug: string
	productSlug: string
	shortTitle?: string
	heroImage?: string
	excerpt?: string
	keywords?: string[]
	specs?: ProductSpec[]
	applications?: string[]
	features?: string[]
	additionalInfo?: ProductSpec[]
	complianceNotes?: string[]
	ctaLabel?: string
}

interface CategoryConfig {
	name?: string
	intro?: string
	seoCopy?: string
	order?: number
	heroImage?: string
	featuredProductSlugs?: string[]
	relatedCategorySlugs?: string[]
}

interface Catalog {
	categories: ProductCategory[]
	products: Product[]
}

let catalogPromise: Promise<Catalog> | null = null

function toTitleCaseFromSlug(slug: string) {
	return slug
		.split("-")
		.map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : ""))
		.join(" ")
}

function normalizeSpecRows(raw: unknown): ProductSpec[] {
	if (!Array.isArray(raw)) return []
	const out: ProductSpec[] = []
	for (const row of raw) {
		if (!row || typeof row !== "object") continue
		const label = String((row as { label?: unknown }).label ?? "").trim()
		const value = String((row as { value?: unknown }).value ?? "").trim()
		if (!label || !value) continue
		out.push({ label, value })
	}
	return out
}

function normalizeFeatureLines(raw: unknown): string[] {
	if (!Array.isArray(raw)) return []
	return raw
		.map((line) => String(line ?? "").trim())
		.filter(Boolean)
}

async function readCategoryConfig(categoryPath: string): Promise<CategoryConfig | null> {
	const configPath = join(categoryPath, "category.json")
	try {
		const raw = await readFile(configPath, "utf8")
		const parsed = JSON.parse(raw) as CategoryConfig
		return parsed
	} catch {
		return null
	}
}

function isEnoentError(error: unknown) {
	return Boolean(error && typeof error === "object" && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT")
}

async function discoverCategoryDirsFromFilesystem(): Promise<string[]> {
	try {
		const entries = await readdir(PRODUCTS_ROOT, { withFileTypes: true })
		return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
	} catch (error) {
		if (isEnoentError(error)) return []
		throw error
	}
}

async function discoverProductDirsFromFilesystem(categorySlug: string): Promise<string[]> {
	const categoryPath = join(PRODUCTS_ROOT, categorySlug)
	let entries: Dirent[]
	try {
		entries = await readdir(categoryPath, { withFileTypes: true })
	} catch (error) {
		if (isEnoentError(error)) return []
		throw error
	}

	const productSlugs: string[] = []

	for (const entry of entries) {
		if (!entry.isDirectory()) continue
		const productSlug = entry.name
		const mdxPath = join(categoryPath, productSlug, "index.mdx")
		try {
			const fileStat = await stat(mdxPath)
			if (fileStat.isFile()) productSlugs.push(productSlug)
		} catch {
			// no index.mdx, skip
		}
	}

	return productSlugs
}

/**
 * Slugs to index: MongoDB when `MONGODB_URI` is set and the collection has rows; else repo `content/products`.
 */
async function discoverProductSlugPairs(): Promise<Array<{ categorySlug: string; productSlug: string }>> {
	if (process.env.MONGODB_URI?.trim()) {
		const fromDb = await listProductMdxSlugsFromDatabase()
		if (fromDb.length > 0) return fromDb
	}

	const pairs: Array<{ categorySlug: string; productSlug: string }> = []
	for (const categorySlug of await discoverCategoryDirsFromFilesystem()) {
		for (const productSlug of await discoverProductDirsFromFilesystem(categorySlug)) {
			pairs.push({ categorySlug, productSlug })
		}
	}
	return pairs
}

async function discoverProductImages(
  categorySlug: string,
  productSlug: string,
): Promise<string[]> {
  const manifestKey = `${categorySlug}/${productSlug}`;
  return PRODUCT_IMAGE_MANIFEST[manifestKey] ?? [];
}

async function loadProductFromMdx(categorySlug: string, productSlug: string): Promise<Product> {
	const resolved = await getProductMdxSource(categorySlug, productSlug)
	if (!resolved) {
		throw new Error(`Product MDX not found for ${categorySlug}/${productSlug}`)
	}
	const { source } = resolved

	const { frontmatter } = await compileMDX<ProductFrontmatter>({
		source,
		options: {
			parseFrontmatter: true,
		},
	})

	if (!frontmatter.title || !frontmatter.description) {
		throw new Error(
			`Product MDX ${categorySlug}/${productSlug} must include title and description in frontmatter`,
		)
	}

	if (frontmatter.categorySlug !== categorySlug || frontmatter.productSlug !== productSlug) {
		throw new Error(
			`Product MDX frontmatter mismatch for ${categorySlug}/${productSlug}: expected categorySlug=${categorySlug}, productSlug=${productSlug} but received categorySlug=${frontmatter.categorySlug}, productSlug=${frontmatter.productSlug}`,
		)
	}

	const displayName = frontmatter.shortTitle ?? frontmatter.title
	const heroImageAlt = displayName

	const discoveredPaths = await discoverProductImages(categorySlug, productSlug)

	const heroImages =
		discoveredPaths.length > 0
			? discoveredPaths.map((src) => ({
					src,
					alt: heroImageAlt,
					width: 1600,
					height: 900,
				}))
			: (() => {
					const fallbackPath =
						frontmatter.heroImage ??
						`${PRODUCT_IMAGE_PUBLIC_ROOT}/${categorySlug}/${productSlug}/hero.webp`
					if (
						!fallbackPath.startsWith(
							`${PRODUCT_IMAGE_PUBLIC_ROOT}/${categorySlug}/${productSlug}/`,
						)
					) {
						throw new Error(
							`Product MDX heroImage for ${categorySlug}/${productSlug} must live under ${PRODUCT_IMAGE_PUBLIC_ROOT}/${categorySlug}/${productSlug}/`,
						)
					}
					return [
						{
							src: fallbackPath,
							alt: heroImageAlt,
							width: 1600,
							height: 900,
						},
					]
				})()

	const specs = normalizeSpecRows(frontmatter.specs)
	const additionalInfo = normalizeSpecRows(frontmatter.additionalInfo)
	const applications = normalizeFeatureLines(frontmatter.applications)
	const features = normalizeFeatureLines(frontmatter.features)
	const complianceNotes = normalizeFeatureLines(frontmatter.complianceNotes)
	const ctaTrimmed = frontmatter.ctaLabel?.trim()

	const product: Product = {
		name: displayName,
		slug: productSlug,
		categorySlug,
		heroImages,
		description: frontmatter.description,
		excerpt: frontmatter.excerpt?.trim() || undefined,
		applications,
		features,
		specs,
		...(additionalInfo.length > 0 ? { additionalInfo } : {}),
		complianceNotes,
		ctaLabel: ctaTrimmed || "Request Quote",
		relatedProductSlugs: [],
		faq: [],
		seo: {
			title: frontmatter.title,
			description: frontmatter.description,
		},
	}

	return product
}

async function buildCatalog(): Promise<Catalog> {
	const pairs = await discoverProductSlugPairs()

	if (pairs.length === 0) {
		return { categories: [], products: [] }
	}

	const byCategory = new Map<string, string[]>()
	for (const { categorySlug, productSlug } of pairs) {
		if (!byCategory.has(categorySlug)) byCategory.set(categorySlug, [])
		byCategory.get(categorySlug)!.push(productSlug)
	}

	const categorySlugs = [...byCategory.keys()].sort((a, b) => a.localeCompare(b))

	const fsProducts: Product[] = []
	const fsCategories: ProductCategory[] = []

	for (const categorySlug of categorySlugs) {
		const rawSlugs = byCategory.get(categorySlug) ?? []
		const productSlugs = [...new Set(rawSlugs)].sort((a, b) => a.localeCompare(b))
		if (!productSlugs.length) continue

		const productsForCategory: Product[] = []
		for (const productSlug of productSlugs) {
			try {
				const product = await loadProductFromMdx(categorySlug, productSlug)
				productsForCategory.push(product)
				fsProducts.push(product)
			} catch {
				// Skip broken or missing MDX for this slug (e.g. stale index row).
			}
		}

		if (productsForCategory.length === 0) continue

		const categoryPath = join(PRODUCTS_ROOT, categorySlug)
		const config = await readCategoryConfig(categoryPath)

		const inferredName = toTitleCaseFromSlug(categorySlug)
		const name = config?.name ?? inferredName
		const intro = config?.intro ?? ""
		const seoCopy = config?.seoCopy ?? ""
		const order = typeof config?.order === "number" ? config.order : Number.POSITIVE_INFINITY

		const firstProductHeroImage = productsForCategory[0]?.heroImages[0]
		const heroImagePath = config?.heroImage ?? firstProductHeroImage?.src

		const heroImage =
			heroImagePath && firstProductHeroImage
				? {
						src: heroImagePath,
						alt: firstProductHeroImage.alt,
						width: firstProductHeroImage.width,
						height: firstProductHeroImage.height,
					}
				: {
						src: "/images/category-default.svg",
						alt: name,
						width: 1600,
						height: 900,
					}

		const featuredProductSlugs =
			config?.featuredProductSlugs && config.featuredProductSlugs.length
				? config.featuredProductSlugs
				: productsForCategory.map((product) => product.slug)

		const relatedCategorySlugs = config?.relatedCategorySlugs ?? []

		const category: ProductCategory = {
			name,
			slug: categorySlug,
			intro,
			seoCopy,
			heroImage,
			order,
			featuredProductSlugs,
			relatedCategorySlugs,
		}

		fsCategories.push(category)
	}

	const categories = [...fsCategories].sort((a, b) => {
		if (a.order === b.order) {
			return a.name.localeCompare(b.name)
		}
		return a.order - b.order
	})

	return { categories, products: fsProducts }
}

export function resetCatalogCache() {
	catalogPromise = null
}

export async function loadCatalog(): Promise<Catalog> {
	if (!catalogPromise) {
		catalogPromise = buildCatalog()
	}
	return catalogPromise
}

export async function loadCategories(): Promise<ProductCategory[]> {
	const catalog = await loadCatalog()
	return catalog.categories
}

export async function loadProducts(): Promise<Product[]> {
	const catalog = await loadCatalog()
	return catalog.products
}
