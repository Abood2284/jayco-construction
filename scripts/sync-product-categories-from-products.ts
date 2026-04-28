// scripts/sync-product-categories-from-products.ts

/**
 * Creates missing `product_categories` records for category slugs currently used
 * by non-archived products. Existing category records are never overwritten.
 */

import { config } from "dotenv"
import { MongoClient, type Collection } from "mongodb"

import {
	isValidCategorySlug,
	normalizeCategorySlug,
	type ProductCategoryStatus,
} from "@/lib/mongodb/product-categories"

config({ path: ".env.local" })
config({ path: ".env" })

const PRODUCTS_COLLECTION = "products"
const PRODUCT_CATEGORIES_COLLECTION = "product_categories"
const ACRONYMS = new Map([
	["eot", "EOT"],
	["hyd", "Hyd"],
])

interface ProductDocument {
	categorySlug?: unknown
	status?: unknown
}

interface ProductCategoryDocument {
	slug: string
	name: string
	intro?: string
	seoCopy?: string
	order?: number
	status: ProductCategoryStatus
	createdAt: Date
	updatedAt: Date
}

interface SyncSummary {
	foundSlugs: number
	existing: number
	inserted: number
	invalidSkipped: number
	invalidSlugs: string[]
	insertedSlugs: string[]
}

function getMongoSettings() {
	const uri = process.env.MONGODB_URI?.trim()
	if (!uri) throw new Error("Missing MONGODB_URI. Add it to .env or .env.local.")

	return {
		uri,
		dbName: process.env.MONGODB_DB?.trim() || "jayco",
	}
}

function toTitleCaseFromSlug(slug: string): string {
	return slug
		.split("-")
		.map((part) => {
			const acronym = ACRONYMS.get(part)
			if (acronym) return acronym
			return part ? part[0]!.toUpperCase() + part.slice(1) : ""
		})
		.join(" ")
}

async function ensureProductCategoryIndexes(collection: Collection<ProductCategoryDocument>) {
	await collection.createIndex({ slug: 1 }, { unique: true, name: "product_categories_slug_unique" })
	await collection.createIndex(
		{ status: 1, order: 1, name: 1 },
		{ name: "product_categories_status_order_name" },
	)
}

async function syncCategories(input: {
	products: Collection<ProductDocument>
	categories: Collection<ProductCategoryDocument>
}): Promise<SyncSummary> {
	const rawSlugs = await input.products.distinct("categorySlug", {
		status: { $ne: "archived" },
	})
	const normalizedSlugs = new Set<string>()
	const invalidSlugs: string[] = []

	for (const rawSlug of rawSlugs) {
		const slug = normalizeCategorySlug(String(rawSlug ?? ""))
		if (!slug || !isValidCategorySlug(slug)) {
			invalidSlugs.push(String(rawSlug ?? ""))
			continue
		}
		normalizedSlugs.add(slug)
	}

	const summary: SyncSummary = {
		foundSlugs: normalizedSlugs.size,
		existing: 0,
		inserted: 0,
		invalidSkipped: invalidSlugs.length,
		invalidSlugs,
		insertedSlugs: [],
	}

	for (const slug of [...normalizedSlugs].sort((a, b) => a.localeCompare(b))) {
		const existing = await input.categories.findOne({ slug }, { projection: { _id: 1 } })
		if (existing) {
			summary.existing += 1
			continue
		}

		const now = new Date()
		await input.categories.insertOne({
			slug,
			name: toTitleCaseFromSlug(slug),
			intro: "",
			seoCopy: "",
			status: "published",
			createdAt: now,
			updatedAt: now,
		})
		summary.inserted += 1
		summary.insertedSlugs.push(slug)
	}

	return summary
}

async function main() {
	const { uri, dbName } = getMongoSettings()
	const client = new MongoClient(uri)

	await client.connect()

	try {
		const db = client.db(dbName)
		const products = db.collection<ProductDocument>(PRODUCTS_COLLECTION)
		const categories = db.collection<ProductCategoryDocument>(PRODUCT_CATEGORIES_COLLECTION)

		await ensureProductCategoryIndexes(categories)
		const summary = await syncCategories({ products, categories })

		console.log("\nProduct category sync complete.")
		console.log(`Product category slugs found in products: ${summary.foundSlugs}`)
		console.log(`Existing categories: ${summary.existing}`)
		console.log(`Inserted categories: ${summary.inserted}`)
		console.log(`Invalid/skipped slugs: ${summary.invalidSkipped}`)

		if (summary.insertedSlugs.length > 0) {
			console.log("\nInserted category slugs:")
			for (const slug of summary.insertedSlugs) console.log(`- ${slug}`)
		}

		if (summary.invalidSlugs.length > 0) {
			console.warn("\nInvalid/skipped category slugs:")
			for (const slug of summary.invalidSlugs) console.warn(`- ${slug}`)
		}
	} finally {
		await client.close()
	}
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
