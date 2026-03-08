import { readdir, readFile, stat } from "node:fs/promises"
import { join } from "node:path"

import { compileMDX } from "next-mdx-remote/rsc"

import type { Product, ProductCategory } from "@/lib/cms/types"

const PRODUCTS_ROOT = join(process.cwd(), "content", "products")
const PRODUCT_IMAGE_PUBLIC_ROOT = "/images/products"
const PRODUCT_IMAGE_FS_ROOT = join(process.cwd(), "public", "images", "products")

const GALLERY_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"]

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

async function discoverCategoryDirs() {
	const entries = await readdir(PRODUCTS_ROOT, { withFileTypes: true })
	return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

async function discoverProductDirs(categorySlug: string) {
	const categoryPath = join(PRODUCTS_ROOT, categorySlug)
	const entries = await readdir(categoryPath, { withFileTypes: true })
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

async function discoverProductImages(categorySlug: string, productSlug: string): Promise<string[]> {
	const dirPath = join(PRODUCT_IMAGE_FS_ROOT, categorySlug, productSlug)
	let entries: string[]
	try {
		entries = await readdir(dirPath)
	} catch {
		return []
	}

	const heroMatch = entries.find(
		(name) => hasGalleryExtension(name) && name.toLowerCase().startsWith("hero."),
	)
	const galleryNums: number[] = []
	for (let n = 1; n <= 6; n++) {
		const prefix = `gallery-${n}.`
		const found = entries.find(
			(name) => hasGalleryExtension(name) && name.toLowerCase().startsWith(prefix),
		)
		if (found) galleryNums.push(n)
	}

	const baseUrl = `${PRODUCT_IMAGE_PUBLIC_ROOT}/${categorySlug}/${productSlug}`
	const ordered: string[] = []
	if (heroMatch) ordered.push(`${baseUrl}/${heroMatch}`)
	for (const n of galleryNums) {
		const name = entries.find(
			(e) => hasGalleryExtension(e) && e.toLowerCase().startsWith(`gallery-${n}.`),
		)
		if (name) ordered.push(`${baseUrl}/${name}`)
	}
	return ordered
}

async function loadProductFromMdx(categorySlug: string, productSlug: string): Promise<Product> {
	const mdxPath = join(PRODUCTS_ROOT, categorySlug, productSlug, "index.mdx")
	const source = await readFile(mdxPath, "utf8")

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

	const product: Product = {
		name: displayName,
		slug: productSlug,
		categorySlug,
		heroImages,
		description: frontmatter.description,
		features: [],
		applications: [],
		specs: [],
		complianceNotes: [],
		ctaLabel: "Request Quote",
		relatedProductSlugs: [],
		faq: [],
		seo: {
			title: frontmatter.title,
			description: frontmatter.description,
		},
	}

	return product
}

async function buildFilesystemCatalog(): Promise<Catalog> {
	const categorySlugs = await discoverCategoryDirs()

	const fsProducts: Product[] = []
	const fsCategories: ProductCategory[] = []

	for (const categorySlug of categorySlugs) {
		const productSlugs = await discoverProductDirs(categorySlug)
		if (!productSlugs.length) continue

		const productsForCategory: Product[] = []
		for (const productSlug of productSlugs) {
			const product = await loadProductFromMdx(categorySlug, productSlug)
			productsForCategory.push(product)
			fsProducts.push(product)
		}

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

export async function loadCatalog(): Promise<Catalog> {
	if (!catalogPromise) {
		catalogPromise = buildFilesystemCatalog()
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

