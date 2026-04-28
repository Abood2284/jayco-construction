import type { Product, ProductCategory } from "@/lib/cms/types"
import { listProductCategoriesFromDatabase, type ProductCategoryRecord } from "@/lib/mongodb/product-categories"
import { listProductImagesFromDatabase } from "@/lib/mongodb/product-images"
import { listProductsFromDatabase, type ProductRecord } from "@/lib/mongodb/products"

const DEFAULT_PRODUCT_IMAGE = "/images/category-default.svg"

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

async function discoverProductImages(
	categorySlug: string,
	productSlug: string,
): Promise<string[]> {
	const fromDb = await listProductImagesFromDatabase(categorySlug, productSlug)

	if (fromDb.length > 0) {
		return fromDb.map((image) => image.blobUrl).filter(Boolean)
	}

	return []
}

async function loadProductFromRecord(record: ProductRecord): Promise<Product> {
	const displayName = record.shortTitle ?? record.title
	const discoveredPaths = await discoverProductImages(record.categorySlug, record.productSlug)
	const heroImages =
		discoveredPaths.length > 0
			? discoveredPaths.map((src) => ({
					src,
					alt: displayName,
					width: 1600,
					height: 900,
				}))
			: [
					{
						src: DEFAULT_PRODUCT_IMAGE,
						alt: displayName,
						width: 1600,
						height: 900,
					},
				]

	return {
		name: displayName,
		slug: record.productSlug,
		categorySlug: record.categorySlug,
		heroImages,
		description: record.description,
		excerpt: record.excerpt?.trim() || undefined,
		applications: record.applications ?? [],
		features: record.features ?? [],
		specs: record.specs ?? [],
		...(record.additionalInfo?.length ? { additionalInfo: record.additionalInfo } : {}),
		complianceNotes: record.complianceNotes ?? [],
		ctaLabel: record.ctaLabel?.trim() || "Request Quote",
		relatedProductSlugs: [],
		faq: [],
		seo: {
			title: record.seo?.title || record.title,
			description: record.seo?.description || record.description,
		},
	}
}

function buildCategoryFromRecord({
	categorySlug,
	dbRecord,
	productsForCategory,
}: {
	categorySlug: string
	dbRecord: ProductCategoryRecord | undefined
	productsForCategory: Product[]
}): ProductCategory {
	const inferredName = toTitleCaseFromSlug(categorySlug)
	const name = dbRecord?.name ?? inferredName
	const intro = dbRecord?.intro ?? ""
	const seoCopy = dbRecord?.seoCopy ?? ""
	const order =
		typeof dbRecord?.order === "number"
			? dbRecord.order
			: Number.POSITIVE_INFINITY

	const firstProductHeroImage = productsForCategory[0]?.heroImages[0]
	const heroImagePath = firstProductHeroImage?.src

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

	const featuredProductSlugs = productsForCategory.map((product) => product.slug)

	return {
		name,
		slug: categorySlug,
		intro,
		seoCopy,
		heroImage,
		order,
		featuredProductSlugs,
		relatedCategorySlugs: [],
	}
}

async function buildCatalog(): Promise<Catalog> {
	const dbProductRecords = await listProductsFromDatabase({
		includeDrafts: false,
		includeArchived: false,
	})

	if (dbProductRecords.length === 0) {
		return { categories: [], products: [] }
	}

	const products = await Promise.all(dbProductRecords.map(loadProductFromRecord))

	const byCategory = new Map<string, Product[]>()
	for (const product of products) {
		if (!byCategory.has(product.categorySlug)) byCategory.set(product.categorySlug, [])
		byCategory.get(product.categorySlug)!.push(product)
	}

	const categorySlugs = [...byCategory.keys()].sort((a, b) => a.localeCompare(b))
	const dbCategoryRecords = await listProductCategoriesFromDatabase({
		includeDrafts: true,
		includeArchived: true,
	})
	const dbCategoryBySlug = new Map(dbCategoryRecords.map((record) => [record.slug, record]))

	const categoriesFromProducts: ProductCategory[] = []

	for (const categorySlug of categorySlugs) {
		const dbCategory = dbCategoryBySlug.get(categorySlug)
		if (!dbCategory || dbCategory.status !== "published") continue

		const productsForCategory = [...(byCategory.get(categorySlug) ?? [])].sort((a, b) => a.name.localeCompare(b.name))

		if (productsForCategory.length === 0) continue

		const category = buildCategoryFromRecord({
			categorySlug,
			dbRecord: dbCategory,
			productsForCategory,
		})

		categoriesFromProducts.push(category)
	}

	const categories = [...categoriesFromProducts].sort((a, b) => {
		if (a.order === b.order) {
			return a.name.localeCompare(b.name)
		}
		return a.order - b.order
	})
	const visibleCategorySlugs = new Set(categories.map((category) => category.slug))
	const visibleProducts = products.filter((product) => visibleCategorySlugs.has(product.categorySlug))

	return { categories, products: visibleProducts }
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
