import "server-only"

import { ObjectId } from "mongodb"

import { snapshotCategory, writeAdminAuditLog } from "@/lib/admin/audit"
import { deletePublicBlobObjectBestEffort, movePublicBlobObject } from "@/lib/blob/blob-move"
import { resetCatalogCache } from "@/lib/content/catalog"
import { getMongoClient } from "@/lib/mongodb/client"
import { getMongoEnv } from "@/lib/mongodb/env"
import {
	isValidCategorySlug,
	normalizeCategorySlug,
	type ProductCategoryRecord,
} from "@/lib/mongodb/product-categories"

export interface CategoryRenameImpact {
	oldSlug: string
	newSlug: string
	categoryExists: boolean
	targetSlugAvailable: boolean
	affectedProducts: Array<{
		productSlug: string
		oldProductKey: string
		newProductKey: string
	}>
	affectedImages: Array<{
		id: string
		fileName: string
		oldProductKey: string
		newProductKey: string
		oldBlobPathname?: string
		newBlobPathname?: string
		oldBlobUrl?: string
	}>
	affectedRedirects: Array<{
		source: string
		destination: string
	}>
	warnings: string[]
}

type Actor = {
	email?: string
	name?: string
}

type CategoryDocument = Partial<ProductCategoryRecord>
type ProductDocument = {
	_id?: unknown
	categorySlug?: string
	productSlug?: string
	productKey?: string
	title?: string
}
type ProductImageDocument = {
	_id?: unknown
	categorySlug?: string
	productSlug?: string
	productKey?: string
	blobUrl?: string
	blobPathname?: string
	fileName?: string
}

type MovedBlob = Awaited<ReturnType<typeof movePublicBlobObject>> & {
	imageId: string
	oldBlobUrl?: string
}

const PRODUCTS_COLLECTION = "products"
const PRODUCT_CATEGORIES_COLLECTION = "product_categories"
const PRODUCT_IMAGES_COLLECTION = "product_images"

function assertMongoConfigured() {
	if (!process.env.MONGODB_URI?.trim()) {
		throw new Error("Missing MONGODB_URI. Add it to .env.local or export it before renaming category slugs.")
	}
}

function getCollections() {
	const { dbName } = getMongoEnv()
	return getMongoClient().then((client) => ({
		client,
		db: client.db(dbName),
	}))
}

function normalizeRenameSlugs(input: { oldSlug: string; newSlug: string }) {
	const oldSlug = normalizeCategorySlug(input.oldSlug)
	const newSlug = normalizeCategorySlug(input.newSlug)
	if (!oldSlug || !isValidCategorySlug(oldSlug)) throw new Error("Invalid current category slug.")
	if (!newSlug || !isValidCategorySlug(newSlug)) throw new Error("Enter a valid new slug using lowercase letters, numbers, and hyphens.")
	if (oldSlug === newSlug) throw new Error("New category slug must be different from the current slug.")
	return { oldSlug, newSlug }
}

function productKeyFor(categorySlug: string, productSlug: string): string {
	return `${categorySlug}/${productSlug}`
}

function newBlobPathnameFor(oldPathname: string | undefined, oldSlug: string, newSlug: string): string | undefined {
	const normalizedPathname = oldPathname?.trim().replace(/^\/+/, "")
	if (!normalizedPathname) return undefined
	const oldPrefix = `products/${oldSlug}/`
	if (!normalizedPathname.startsWith(oldPrefix)) return undefined
	return `products/${newSlug}/${normalizedPathname.slice(oldPrefix.length)}`
}

function buildWarnings(input: {
	oldSlug: string
	newSlug: string
	imagesWithUnmappedBlobPaths: number
	redirectsCount: number
}): string[] {
	const warnings = [
		"Runtime redirect creation is not available yet. Add the listed redirects manually or implement DB-backed redirects in a later PR.",
	]

	if (input.imagesWithUnmappedBlobPaths > 0) {
		warnings.push(`${input.imagesWithUnmappedBlobPaths} image record(s) do not use the expected Blob path prefix and will not have Blob objects moved.`)
	}

	if (input.redirectsCount === 0) {
		warnings.push("No DB-managed products were found, so no product redirects were generated.")
	}

	return warnings
}

function snapshotImpact(impact: CategoryRenameImpact) {
	return {
		oldSlug: impact.oldSlug,
		newSlug: impact.newSlug,
		categoryExists: impact.categoryExists,
		targetSlugAvailable: impact.targetSlugAvailable,
		affectedProductCount: impact.affectedProducts.length,
		affectedImageCount: impact.affectedImages.length,
		blobObjectsToMoveCount: impact.affectedImages.filter((image) => image.oldBlobPathname && image.newBlobPathname).length,
		redirects: impact.affectedRedirects,
		warnings: impact.warnings,
	}
}

function objectIdFromString(id: string): ObjectId | null {
	return ObjectId.isValid(id) ? new ObjectId(id) : null
}

export async function previewCategorySlugRename(input: {
	oldSlug: string
	newSlug: string
}): Promise<CategoryRenameImpact> {
	assertMongoConfigured()

	const { oldSlug, newSlug } = normalizeRenameSlugs(input)
	const { db } = await getCollections()
	const categories = db.collection<CategoryDocument>(PRODUCT_CATEGORIES_COLLECTION)
	const products = db.collection<ProductDocument>(PRODUCTS_COLLECTION)
	const images = db.collection<ProductImageDocument>(PRODUCT_IMAGES_COLLECTION)

	const [category, targetCategory, affectedProductDocs, affectedImageDocs] = await Promise.all([
		categories.findOne({ slug: oldSlug }),
		categories.findOne({ slug: newSlug }),
		products
			.find(
				{ categorySlug: oldSlug },
				{ projection: { _id: 1, productSlug: 1, productKey: 1, categorySlug: 1, title: 1 } },
			)
			.sort({ productSlug: 1 })
			.toArray(),
		images
			.find(
				{ categorySlug: oldSlug },
				{
					projection: {
						_id: 1,
						categorySlug: 1,
						productSlug: 1,
						productKey: 1,
						blobUrl: 1,
						blobPathname: 1,
						fileName: 1,
					},
				},
			)
			.sort({ productKey: 1, sortOrder: 1, fileName: 1 })
			.toArray(),
	])

	const affectedProducts = affectedProductDocs
		.map((product) => {
			const productSlug = typeof product.productSlug === "string" ? product.productSlug.trim() : ""
			if (!productSlug) return null
			return {
				productSlug,
				oldProductKey: productKeyFor(oldSlug, productSlug),
				newProductKey: productKeyFor(newSlug, productSlug),
			}
		})
		.filter((product): product is NonNullable<typeof product> => Boolean(product))

	const affectedImages = affectedImageDocs
		.map((image) => {
			const id = image._id !== undefined ? String(image._id) : ""
			const productSlug = typeof image.productSlug === "string" ? image.productSlug.trim() : ""
			const fileName = typeof image.fileName === "string" ? image.fileName.trim() : ""
			if (!id || !productSlug || !fileName) return null
			const oldProductKey = productKeyFor(oldSlug, productSlug)
			const newProductKey = productKeyFor(newSlug, productSlug)
			return {
				id,
				fileName,
				oldProductKey,
				newProductKey,
				oldBlobPathname: image.blobPathname,
				newBlobPathname: newBlobPathnameFor(image.blobPathname, oldSlug, newSlug),
				oldBlobUrl: image.blobUrl,
			}
		})
		.filter((image): image is NonNullable<typeof image> => Boolean(image))

	const affectedRedirects = affectedProducts.map((product) => ({
		source: `/products/${oldSlug}/${product.productSlug}`,
		destination: `/products/${newSlug}/${product.productSlug}`,
	}))

	const imagesWithUnmappedBlobPaths = affectedImages.filter((image) => image.oldBlobPathname && !image.newBlobPathname).length

	return {
		oldSlug,
		newSlug,
		categoryExists: Boolean(category),
		targetSlugAvailable: !targetCategory,
		affectedProducts,
		affectedImages,
		affectedRedirects,
		warnings: buildWarnings({
			oldSlug,
			newSlug,
			imagesWithUnmappedBlobPaths,
			redirectsCount: affectedRedirects.length,
		}),
	}
}

export async function executeCategorySlugRename(input: {
	oldSlug: string
	newSlug: string
	actor?: Actor | null
}): Promise<CategoryRenameImpact> {
	let impact: CategoryRenameImpact | null = null
	const movedBlobs: MovedBlob[] = []
	const cleanupWarnings: string[] = []
	let didUpdateDatabase = false

	try {
		impact = await previewCategorySlugRename(input)
		if (!impact.categoryExists) throw new Error(`Category "${impact.oldSlug}" was not found.`)
		if (!impact.targetSlugAvailable) throw new Error(`Category slug "${impact.newSlug}" is not available.`)
		const renameImpact = impact

		for (const image of renameImpact.affectedImages) {
			if (!image.oldBlobPathname || !image.newBlobPathname) continue
			const moved = await movePublicBlobObject({
				oldPathname: image.oldBlobPathname,
				newPathname: image.newBlobPathname,
			})
			movedBlobs.push({
				...moved,
				imageId: image.id,
				oldBlobUrl: image.oldBlobUrl,
			})
		}

		const { client, db } = await getCollections()
		const session = client.startSession()
		try {
			await session.withTransaction(async () => {
				const now = new Date()
					const categories = db.collection<CategoryDocument>(PRODUCT_CATEGORIES_COLLECTION)
					const products = db.collection<ProductDocument>(PRODUCTS_COLLECTION)
					const images = db.collection<ProductImageDocument>(PRODUCT_IMAGES_COLLECTION)

					const categoryResult = await categories.updateOne(
						{ slug: renameImpact.oldSlug },
						{ $set: { slug: renameImpact.newSlug, updatedAt: now } },
						{ session },
					)
					if (categoryResult.matchedCount !== 1) throw new Error(`Category "${renameImpact.oldSlug}" was not found.`)

					if (renameImpact.affectedProducts.length > 0) {
						await products.bulkWrite(
							renameImpact.affectedProducts.map((product) => ({
								updateOne: {
									filter: {
										categorySlug: renameImpact.oldSlug,
										productSlug: product.productSlug,
										productKey: product.oldProductKey,
									},
									update: {
										$set: {
											categorySlug: renameImpact.newSlug,
											productKey: product.newProductKey,
											updatedAt: now,
										},
								},
							},
						})),
						{ session },
						)
					}

					if (renameImpact.affectedImages.length > 0) {
						await images.bulkWrite(
							renameImpact.affectedImages.map((image) => {
							const movedBlob = movedBlobs.find((blob) => blob.imageId === image.id)
							const objectId = objectIdFromString(image.id)
							if (!objectId) throw new Error("Invalid product image ID.")
							return {
								updateOne: {
									filter: { _id: objectId },
										update: {
											$set: {
												categorySlug: renameImpact.newSlug,
												productKey: image.newProductKey,
											...(movedBlob
												? {
														blobUrl: movedBlob.newUrl,
														blobPathname: movedBlob.newPathname,
													}
												: {}),
											updatedAt: now,
										},
									},
								},
							}
						}),
						{ session },
					)
				}
			})
		} finally {
			await session.endSession()
		}
		didUpdateDatabase = true

		for (const movedBlob of movedBlobs) {
			const deleted = await deletePublicBlobObjectBestEffort(movedBlob.oldBlobUrl || movedBlob.oldPathname)
			if (!deleted) cleanupWarnings.push(`Old Blob cleanup failed or was skipped for ${movedBlob.oldPathname}.`)
		}

			resetCatalogCache()
			const finalImpact: CategoryRenameImpact = {
				...renameImpact,
				warnings: [...renameImpact.warnings, ...cleanupWarnings],
			}
		await writeAdminAuditLog({
			actor: input.actor,
			action: "category.slug_rename",
			status: "success",
			entityType: "category",
			entityKey: finalImpact.newSlug,
			summary: `Renamed category slug "${finalImpact.oldSlug}" to "${finalImpact.newSlug}"`,
			before: { slug: finalImpact.oldSlug },
			after: { slug: finalImpact.newSlug },
			metadata: {
				...snapshotImpact(finalImpact),
			},
		})
		return finalImpact
	} catch (error) {
		if (!didUpdateDatabase) {
			for (const movedBlob of movedBlobs) {
				await deletePublicBlobObjectBestEffort(movedBlob.newUrl || movedBlob.newPathname)
			}
		}

		await writeAdminAuditLog({
			actor: input.actor,
			action: "category.slug_rename",
			status: "failure",
			entityType: "category",
			entityKey: (impact?.oldSlug ?? normalizeCategorySlug(input.oldSlug)) || undefined,
			summary: `Failed to rename category slug "${normalizeCategorySlug(input.oldSlug)}" to "${normalizeCategorySlug(input.newSlug)}"`,
			before: impact ? snapshotCategory({ slug: impact.oldSlug } as ProductCategoryRecord) : { slug: normalizeCategorySlug(input.oldSlug) },
			after: { slug: normalizeCategorySlug(input.newSlug) },
			metadata: impact ? snapshotImpact(impact) : undefined,
			error,
		})
		throw error
	}
}
