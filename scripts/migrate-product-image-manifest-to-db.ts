// scripts/migrate-product-image-manifest-to-db.ts

/**
 * Upserts `src/lib/content/product-image-manifest.json` into MongoDB `product_images`.
 *
 * Usage (from repo root, with MONGODB_URI set in .env or .env.local):
 *   pnpm run migrate:product-images
 */

import { config } from "dotenv"
import { readFile } from "node:fs/promises"
import { basename, join } from "node:path"

import { MongoClient, type Collection } from "mongodb"

import type { ProductImageRecord } from "@/lib/mongodb/product-images"

config({ path: ".env.local" })
config({ path: ".env" })

const MANIFEST_PATH = join(process.cwd(), "src", "lib", "content", "product-image-manifest.json")
const PRODUCT_IMAGES_COLLECTION = "product_images"

type ProductImageManifest = Record<string, string[]>
type ProductImageCollection = Collection<ProductImageRecord>

interface MigrationSummary {
	productsScanned: number
	imageUrlsScanned: number
	inserted: number
	updatedOrSkipped: number
	invalidSkipped: number
}

function getMongoEnvFromProcess() {
	const uri = process.env.MONGODB_URI?.trim()
	if (!uri) {
		throw new Error("Missing MONGODB_URI. Add it to .env.local or export it before running this script.")
	}

	const dbName = process.env.MONGODB_DB?.trim() || "jayco"
	return { uri, dbName }
}

function toTitleCaseFromSlug(slug: string): string {
	return slug
		.split("-")
		.map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : ""))
		.join(" ")
}

function inferSortOrder(fileName: string, index: number): number {
	const lower = fileName.toLowerCase()
	if (lower.startsWith("hero.")) return 0

	const match = lower.match(/^gallery-(\d+)\./)
	if (match) return Number(match[1])

	return 9999 + index
}

function parseProductKey(productKey: string): { categorySlug: string; productSlug: string } | null {
	const parts = productKey.split("/")
	if (parts.length !== 2) return null

	const [categorySlug, productSlug] = parts.map((part) => part.trim())
	if (!categorySlug || !productSlug) return null

	return { categorySlug, productSlug }
}

function parseManifestImage(
	productKey: string,
	blobUrl: string,
	index: number,
): Omit<ProductImageRecord, "_id" | "createdAt" | "updatedAt"> | null {
	const productSlugs = parseProductKey(productKey)
	if (!productSlugs) return null

	let url: URL
	try {
		url = new URL(blobUrl)
	} catch {
		return null
	}

	if (url.protocol !== "https:") return null

	const blobPathname = url.pathname.replace(/^\/+/, "")
	const fileName = basename(blobPathname)
	if (!blobPathname || !fileName || fileName === "." || fileName === "/") return null

	const lowerFileName = fileName.toLowerCase()
	const role: ProductImageRecord["role"] = lowerFileName.startsWith("hero.") ? "hero" : "gallery"
	const { categorySlug, productSlug } = productSlugs

	return {
		productKey,
		categorySlug,
		productSlug,
		blobUrl,
		blobPathname,
		fileName,
		role,
		sortOrder: inferSortOrder(fileName, index),
		alt: toTitleCaseFromSlug(productSlug),
	}
}

async function loadManifest(): Promise<ProductImageManifest> {
	const raw = await readFile(MANIFEST_PATH, "utf8")
	const parsed = JSON.parse(raw) as unknown

	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
		throw new Error(`Invalid product image manifest: expected an object at ${MANIFEST_PATH}`)
	}

	return parsed as ProductImageManifest
}

async function ensureIndexes(collection: ProductImageCollection) {
	await collection.createIndex(
		{ productKey: 1, blobPathname: 1 },
		{ unique: true, name: "product_images_productKey_blobPathname_unique" },
	)

	await collection.createIndex(
		{ categorySlug: 1, productSlug: 1, role: 1, sortOrder: 1 },
		{ name: "product_images_catalog_lookup" },
	)
}

async function migrateManifest(collection: ProductImageCollection, manifest: ProductImageManifest): Promise<MigrationSummary> {
	const summary: MigrationSummary = {
		productsScanned: Object.keys(manifest).length,
		imageUrlsScanned: 0,
		inserted: 0,
		updatedOrSkipped: 0,
		invalidSkipped: 0,
	}

	for (const [productKey, imageUrls] of Object.entries(manifest)) {
		if (!Array.isArray(imageUrls)) {
			console.warn(`Skipping invalid manifest entry for ${productKey}: expected an array of URLs.`)
			summary.invalidSkipped += 1
			continue
		}

		for (let index = 0; index < imageUrls.length; index += 1) {
			const imageUrl = imageUrls[index]
			summary.imageUrlsScanned += 1

			if (typeof imageUrl !== "string" || !imageUrl.trim()) {
				console.warn(`Skipping invalid image URL for ${productKey} at index ${index}.`)
				summary.invalidSkipped += 1
				continue
			}

			const image = parseManifestImage(productKey, imageUrl.trim(), index)
			if (!image) {
				console.warn(`Skipping invalid image URL for ${productKey}: ${imageUrl}`)
				summary.invalidSkipped += 1
				continue
			}

			const now = new Date()
			const result = await collection.updateOne(
				{ productKey: image.productKey, blobPathname: image.blobPathname },
				{
					$set: {
						productKey: image.productKey,
						categorySlug: image.categorySlug,
						productSlug: image.productSlug,
						blobUrl: image.blobUrl,
						blobPathname: image.blobPathname,
						fileName: image.fileName,
						role: image.role,
						sortOrder: image.sortOrder,
						alt: image.alt,
						updatedAt: now,
					},
					$setOnInsert: {
						createdAt: now,
					},
				},
				{ upsert: true },
			)

			if (result.upsertedCount > 0) {
				summary.inserted += result.upsertedCount
			} else {
				summary.updatedOrSkipped += result.matchedCount
			}
		}
	}

	return summary
}

async function main() {
	const manifest = await loadManifest()
	const { uri, dbName } = getMongoEnvFromProcess()
	const client = new MongoClient(uri)

	await client.connect()

	try {
		const collection = client.db(dbName).collection<ProductImageRecord>(PRODUCT_IMAGES_COLLECTION)
		await ensureIndexes(collection)

		const summary = await migrateManifest(collection, manifest)

		console.log("\nProduct image manifest migration complete.")
		console.log(`Products scanned: ${summary.productsScanned}`)
		console.log(`Image URLs scanned: ${summary.imageUrlsScanned}`)
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
