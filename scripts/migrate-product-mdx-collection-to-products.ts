// scripts/migrate-product-mdx-collection-to-products.ts

/**
 * Migrates MongoDB `product_mdx` documents into admin-managed `products` records.
 *
 * Usage (from repo root, with MONGODB_URI set in .env or .env.local):
 *   pnpm run migrate:product-mdx-to-products
 *   pnpm run migrate:product-mdx-to-products -- --dry-run
 */

import { config } from "dotenv"
import matter from "gray-matter"
import { MongoClient, type Collection } from "mongodb"

import type { ProductSpec } from "@/lib/cms/types"
import { isValidCategorySlug, normalizeCategorySlug } from "@/lib/mongodb/product-categories"
import {
	isProductStatus,
	isValidProductSlug,
	normalizeProductSlug,
	type ProductRecord,
} from "@/lib/mongodb/products"

config({ path: ".env.local" })
config({ path: ".env" })

const PRODUCTS_COLLECTION = "products"
const PRODUCT_MDX_COLLECTION = process.env.MONGODB_COLLECTION?.trim() || "product_mdx"

interface ProductMdxMigrationDocument {
	_id?: unknown
	categorySlug?: unknown
	productSlug?: unknown
	mdxSource?: unknown
	seededFromFilesystem?: unknown
	createdAt?: unknown
	updatedAt?: unknown
	source?: unknown
	mdx?: unknown
	content?: unknown
	frontmatter?: unknown
}

interface MigrationMongoEnv {
	uri: string
	dbName: string
}

interface MigratedProductContent {
	categorySlug: string
	productSlug: string
	productKey: string
	title: string
	description: string
	shortTitle?: string
	excerpt?: string
	specs?: ProductSpec[]
	applications?: string[]
	features?: string[]
	additionalInfo?: ProductSpec[]
	complianceNotes?: string[]
	ctaLabel?: string
	warnings: string[]
}

interface MigrationSummary {
	scanned: number
	inserted: number
	updatedOrSkipped: number
	invalidSkipped: number
	skipped: string[]
	warnings: string[]
}

type ProductCollection = Collection<ProductRecord>
type ProductMdxCollection = Collection<ProductMdxMigrationDocument>

function isDryRun(): boolean {
	return process.argv.includes("--dry-run")
}

function getMigrationMongoEnv(): MigrationMongoEnv {
	const uri = process.env.MONGODB_URI?.trim()
	if (!uri) throw new Error("Missing MONGODB_URI. Add it to .env or .env.local.")

	const dbName = process.env.MONGODB_DB?.trim() || "jayco"
	return { uri, dbName }
}

function normalizeString(value: unknown): string {
	return typeof value === "string" ? value.trim() : ""
}

function normalizeOptionalString(value: unknown): string | undefined {
	const normalized = normalizeString(value)
	return normalized || undefined
}

function normalizeSpecRows(value: unknown): ProductSpec[] | undefined {
	if (!Array.isArray(value)) return undefined

	const rows: ProductSpec[] = []
	for (const row of value) {
		if (!row || typeof row !== "object") continue
		const label = normalizeString((row as { label?: unknown }).label)
		const specValue = normalizeString((row as { value?: unknown }).value)
		if (label && specValue) rows.push({ label, value: specValue })
	}

	return rows.length > 0 ? rows : undefined
}

function normalizeLines(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined
	const lines = value.map((line) => normalizeString(line)).filter(Boolean)
	return lines.length > 0 ? lines : undefined
}

function getMdxSource(doc: ProductMdxMigrationDocument): string {
	return normalizeString(doc.mdxSource) || normalizeString(doc.source) || normalizeString(doc.mdx) || normalizeString(doc.content)
}

function parseFrontmatter(doc: ProductMdxMigrationDocument): Record<string, unknown> | null {
	const source = getMdxSource(doc)
	if (source) return matter(source).data
	if (doc.frontmatter && typeof doc.frontmatter === "object" && !Array.isArray(doc.frontmatter)) {
		return doc.frontmatter as Record<string, unknown>
	}
	return null
}

function getDocumentKey(doc: ProductMdxMigrationDocument): string {
	const categorySlug = normalizeString(doc.categorySlug) || "unknown-category"
	const productSlug = normalizeString(doc.productSlug) || "unknown-product"
	return `${categorySlug}/${productSlug}`
}

function parseMigratedProduct(doc: ProductMdxMigrationDocument): MigratedProductContent | null {
	const warnings: string[] = []
	const rawCategorySlug = normalizeString(doc.categorySlug)
	const rawProductSlug = normalizeString(doc.productSlug)
	const categorySlug = normalizeCategorySlug(rawCategorySlug)
	const productSlug = normalizeProductSlug(rawProductSlug)
	const docKey = getDocumentKey(doc)

	if (!categorySlug || !isValidCategorySlug(categorySlug)) {
		throw new Error("Invalid or missing document categorySlug.")
	}
	if (!productSlug || !isValidProductSlug(productSlug)) {
		throw new Error("Invalid or missing document productSlug.")
	}

	const frontmatter = parseFrontmatter(doc)
	if (!frontmatter) throw new Error("Missing MDX source/frontmatter.")

	const frontmatterCategorySlug = normalizeOptionalString(frontmatter.categorySlug)
	const frontmatterProductSlug = normalizeOptionalString(frontmatter.productSlug)
	if (frontmatterCategorySlug) {
		const normalizedFrontmatterCategorySlug = normalizeCategorySlug(frontmatterCategorySlug)
		if (normalizedFrontmatterCategorySlug !== categorySlug) {
			throw new Error(`Frontmatter categorySlug "${frontmatterCategorySlug}" does not match document categorySlug "${categorySlug}".`)
		}
	} else {
		warnings.push("frontmatter.categorySlug is missing; used document categorySlug.")
	}

	if (frontmatterProductSlug) {
		const normalizedFrontmatterProductSlug = normalizeProductSlug(frontmatterProductSlug)
		if (normalizedFrontmatterProductSlug !== productSlug) {
			throw new Error(`Frontmatter productSlug "${frontmatterProductSlug}" does not match document productSlug "${productSlug}".`)
		}
	} else {
		warnings.push("frontmatter.productSlug is missing; used document productSlug.")
	}

	const title = normalizeString(frontmatter.title)
	const description = normalizeString(frontmatter.description)
	if (!title) throw new Error("Missing frontmatter title.")
	if (!description) throw new Error("Missing frontmatter description.")

	return {
		categorySlug,
		productSlug,
		productKey: `${categorySlug}/${productSlug}`,
		title,
		description,
		...(normalizeOptionalString(frontmatter.shortTitle) ? { shortTitle: normalizeOptionalString(frontmatter.shortTitle) } : {}),
		...(normalizeOptionalString(frontmatter.excerpt) ? { excerpt: normalizeOptionalString(frontmatter.excerpt) } : {}),
		...(normalizeSpecRows(frontmatter.specs) ? { specs: normalizeSpecRows(frontmatter.specs) } : {}),
		...(normalizeLines(frontmatter.applications) ? { applications: normalizeLines(frontmatter.applications) } : {}),
		...(normalizeLines(frontmatter.features) ? { features: normalizeLines(frontmatter.features) } : {}),
		...(normalizeSpecRows(frontmatter.additionalInfo) ? { additionalInfo: normalizeSpecRows(frontmatter.additionalInfo) } : {}),
		...(normalizeLines(frontmatter.complianceNotes) ? { complianceNotes: normalizeLines(frontmatter.complianceNotes) } : {}),
		...(normalizeOptionalString(frontmatter.ctaLabel) ? { ctaLabel: normalizeOptionalString(frontmatter.ctaLabel) } : {}),
		warnings: warnings.map((warning) => `${docKey}: ${warning}`),
	}
}

async function ensureProductIndexes(collection: ProductCollection) {
	await collection.createIndex({ productKey: 1 }, { unique: true, name: "products_productKey_unique" })
	await collection.createIndex(
		{ categorySlug: 1, productSlug: 1 },
		{ name: "products_categorySlug_productSlug_lookup" },
	)
	await collection.createIndex(
		{ status: 1, categorySlug: 1, title: 1 },
		{ name: "products_status_category_title" },
	)
}

function buildSafeSet(product: MigratedProductContent) {
	return {
		title: product.title,
		description: product.description,
		...(product.shortTitle ? { shortTitle: product.shortTitle } : {}),
		...(product.excerpt ? { excerpt: product.excerpt } : {}),
		...(product.specs?.length ? { specs: product.specs } : {}),
		...(product.applications?.length ? { applications: product.applications } : {}),
		...(product.features?.length ? { features: product.features } : {}),
		...(product.additionalInfo?.length ? { additionalInfo: product.additionalInfo } : {}),
		...(product.complianceNotes?.length ? { complianceNotes: product.complianceNotes } : {}),
		...(product.ctaLabel ? { ctaLabel: product.ctaLabel } : {}),
	}
}

function buildSafeUnset(product: MigratedProductContent): Record<string, ""> {
	return {
		...(!product.shortTitle ? { shortTitle: "" as const } : {}),
		...(!product.excerpt ? { excerpt: "" as const } : {}),
		...(!product.specs?.length ? { specs: "" as const } : {}),
		...(!product.applications?.length ? { applications: "" as const } : {}),
		...(!product.features?.length ? { features: "" as const } : {}),
		...(!product.additionalInfo?.length ? { additionalInfo: "" as const } : {}),
		...(!product.complianceNotes?.length ? { complianceNotes: "" as const } : {}),
		...(!product.ctaLabel ? { ctaLabel: "" as const } : {}),
	}
}

async function migrateProducts(input: {
	productMdxCollection: ProductMdxCollection
	productsCollection: ProductCollection
	dryRun: boolean
}): Promise<MigrationSummary> {
	const summary: MigrationSummary = {
		scanned: 0,
		inserted: 0,
		updatedOrSkipped: 0,
		invalidSkipped: 0,
		skipped: [],
		warnings: [],
	}
	const docs = await input.productMdxCollection
		.find(
			{
				categorySlug: { $exists: true, $ne: "" },
				productSlug: { $exists: true, $ne: "" },
			},
			{
				projection: {
					categorySlug: 1,
					productSlug: 1,
					mdxSource: 1,
					source: 1,
					mdx: 1,
					content: 1,
					frontmatter: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		)
		.sort({ categorySlug: 1, productSlug: 1 })
		.toArray()

	for (const doc of docs) {
		summary.scanned += 1
		const docKey = getDocumentKey(doc)
		let product: MigratedProductContent

		try {
			const parsed = parseMigratedProduct(doc)
			if (!parsed) throw new Error("Could not parse product frontmatter.")
			product = parsed
			summary.warnings.push(...product.warnings)
		} catch (error) {
			const reason = error instanceof Error ? error.message : "Unknown validation error."
			summary.invalidSkipped += 1
			summary.skipped.push(`${docKey}: ${reason}`)
			continue
		}

		const existing = await input.productsCollection.findOne(
			{ productKey: product.productKey },
			{ projection: { _id: 1, status: 1 } },
		)

		if (input.dryRun) {
			if (existing) summary.updatedOrSkipped += 1
			else summary.inserted += 1
			continue
		}

		const now = new Date()
		const safeSet = buildSafeSet(product)
		const safeUnset = buildSafeUnset(product)

		if (existing) {
			if (existing.status !== undefined && !isProductStatus(existing.status)) {
				summary.invalidSkipped += 1
				summary.skipped.push(`${product.productKey}: Existing products.status is invalid.`)
				continue
			}

			const update = Object.keys(safeUnset).length > 0
				? { $set: { ...safeSet, updatedAt: now }, $unset: safeUnset }
				: { $set: { ...safeSet, updatedAt: now } }

			await input.productsCollection.updateOne(
				{ productKey: product.productKey },
				update,
			)
			summary.updatedOrSkipped += 1
			continue
		}

		await input.productsCollection.insertOne({
			categorySlug: product.categorySlug,
			productSlug: product.productSlug,
			productKey: product.productKey,
			...safeSet,
			status: "published",
			createdAt: doc.createdAt instanceof Date ? doc.createdAt : now,
			updatedAt: now,
		})
		summary.inserted += 1
	}

	return summary
}

async function main() {
	const dryRun = isDryRun()
	const { uri, dbName } = getMigrationMongoEnv()
	const client = new MongoClient(uri)

	await client.connect()

	try {
		const db = client.db(dbName)
		const productMdxCollection = db.collection<ProductMdxMigrationDocument>(PRODUCT_MDX_COLLECTION)
		const productsCollection = db.collection<ProductRecord>(PRODUCTS_COLLECTION)
		if (!dryRun) await ensureProductIndexes(productsCollection)

		const summary = await migrateProducts({
			productMdxCollection,
			productsCollection,
			dryRun,
		})

		if (summary.warnings.length > 0) {
			console.warn("\nWarnings:")
			for (const warning of summary.warnings) console.warn(`- ${warning}`)
		}

		if (summary.skipped.length > 0) {
			console.warn("\nSkipped records:")
			for (const skipped of summary.skipped) console.warn(`- ${skipped}`)
		}

		console.log(`\nProduct MDX collection migration complete.${dryRun ? " (dry run)" : ""}`)
		console.log(`product_mdx records scanned: ${summary.scanned}`)
		console.log(`Inserted: ${summary.inserted}`)
		console.log(`Updated/skipped: ${summary.updatedOrSkipped}`)
		console.log(`Invalid/skipped: ${summary.invalidSkipped}`)
	} finally {
		await client.close()
	}
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
