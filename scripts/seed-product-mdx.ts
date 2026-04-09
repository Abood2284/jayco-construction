/**
 * Upserts every `content/products/{category}/{product}/index.mdx` into MongoDB.
 *
 * Usage (from repo root, with MONGODB_URI set in .env or .env.local):
 *   pnpm run seed:product-mdx
 *
 * Schema: MongoDB is schemaless — the collection is created automatically on first insert.
 * This script also ensures a unique index on (categorySlug, productSlug).
 */

import { config } from "dotenv"
import { constants } from "node:fs"
import { access, readdir, readFile, stat } from "node:fs/promises"
import { join } from "node:path"

import { MongoClient } from "mongodb"

config({ path: ".env.local" })
config({ path: ".env" })

const PRODUCTS_ROOT = join(process.cwd(), "content", "products")

function getMongoEnvFromProcess() {
	const uri = process.env.MONGODB_URI?.trim()
	if (!uri) {
		throw new Error("Missing MONGODB_URI. Add it to .env or .env.local.")
	}
	const dbName = process.env.MONGODB_DB?.trim() || "jayco"
	const collectionName = process.env.MONGODB_COLLECTION?.trim() || "product_mdx"
	return { uri, dbName, collectionName }
}

async function discoverCategoryDirs() {
	const entries = await readdir(PRODUCTS_ROOT, { withFileTypes: true })
	return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

async function discoverProductSlugs(categorySlug: string): Promise<string[]> {
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
			// no index.mdx
		}
	}

	return productSlugs
}

async function main() {
	try {
		await access(PRODUCTS_ROOT, constants.F_OK)
	} catch {
		console.error(
			`Missing folder: ${PRODUCTS_ROOT}\n` +
				"This script reads MDX files from disk. Restore `content/products` from git history, or add documents directly in MongoDB.",
		)
		process.exit(1)
	}

	const { uri, dbName, collectionName } = getMongoEnvFromProcess()
	const client = new MongoClient(uri)

	await client.connect()

	try {
		const coll = client.db(dbName).collection(collectionName)

		await coll.createIndex({ categorySlug: 1, productSlug: 1 }, { unique: true })

		const categorySlugs = await discoverCategoryDirs()
		let count = 0

		for (const categorySlug of categorySlugs) {
			const productSlugs = await discoverProductSlugs(categorySlug)

			for (const productSlug of productSlugs) {
				const mdxPath = join(PRODUCTS_ROOT, categorySlug, productSlug, "index.mdx")
				const mdxSource = await readFile(mdxPath, "utf8")
				const now = new Date()

				await coll.updateOne(
					{ categorySlug, productSlug },
					{
						$set: {
							mdxSource,
							updatedAt: now,
							seededFromFilesystem: true,
						},
						$setOnInsert: {
							createdAt: now,
						},
					},
					{ upsert: true },
				)

				count += 1
				console.log(`Upserted ${categorySlug}/${productSlug}`)
			}
		}

		console.log(`\nDone. Upserted ${count} product MDX document(s) into ${dbName}.${collectionName}`)
	} finally {
		await client.close()
	}
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
