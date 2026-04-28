import { ObjectId } from "mongodb"

import { getMongoClient } from "@/lib/mongodb/client"
import { getMongoEnv } from "@/lib/mongodb/env"
import { normalizeCategorySlug } from "@/lib/mongodb/product-categories"
import { isValidProductSlug, normalizeProductSlug } from "@/lib/mongodb/products"

export interface ProductImageRecord {
	_id?: unknown
	productKey: string
	categorySlug: string
	productSlug: string
	blobUrl: string
	blobPathname: string
	fileName: string
	role: "hero" | "gallery"
	sortOrder: number
	alt?: string
	width?: number
	height?: number
	mimeType?: string
	sizeBytes?: number
	createdAt: Date
	updatedAt: Date
}

type ProductImageDocument = Partial<ProductImageRecord>

const PRODUCT_IMAGES_COLLECTION = "product_images"
const IMAGE_PROJECTION = {
	_id: 1,
	productKey: 1,
	categorySlug: 1,
	productSlug: 1,
	blobUrl: 1,
	blobPathname: 1,
	fileName: 1,
	role: 1,
	sortOrder: 1,
	alt: 1,
	width: 1,
	height: 1,
	mimeType: 1,
	sizeBytes: 1,
	createdAt: 1,
	updatedAt: 1,
}

function warnDatabaseImageLookupFailure(error: unknown) {
	if (process.env.NODE_ENV !== "production") {
		console.warn("Product image lookup failed; falling back to manifest.", error)
	}
}

function normalizeString(value: unknown): string {
	return typeof value === "string" ? value.trim() : ""
}

function normalizeDate(value: unknown): Date {
	return value instanceof Date ? value : new Date(0)
}

function objectIdFromString(id: string): ObjectId | null {
	return ObjectId.isValid(id) ? new ObjectId(id) : null
}

function assertWritableMongoConfigured() {
	if (!process.env.MONGODB_URI?.trim()) {
		throw new Error("Missing MONGODB_URI. Add it to .env.local or export it before managing product images.")
	}
}

function deriveSortOrder(fileName: string, role: ProductImageRecord["role"]): number {
	const lower = fileName.toLowerCase()
	if (role === "hero" || lower.startsWith("hero.")) return 0

	const galleryMatch = lower.match(/^gallery-(\d+)\./)
	if (galleryMatch) return Number(galleryMatch[1])

	return Number.MAX_SAFE_INTEGER
}

function normalizeProductImageDocument(doc: ProductImageDocument): ProductImageRecord | null {
	const categorySlug = normalizeString(doc.categorySlug)
	const productSlug = normalizeString(doc.productSlug)
	const productKey = normalizeString(doc.productKey)
	const expectedProductKey = `${categorySlug}/${productSlug}`
	const blobUrl = normalizeString(doc.blobUrl)
	const blobPathname = normalizeString(doc.blobPathname)
	const fileName = normalizeString(doc.fileName)
	const role = doc.role === "hero" ? "hero" : doc.role === "gallery" ? "gallery" : null

	if (!categorySlug || !productSlug || !productKey || productKey !== expectedProductKey) return null
	if (!blobUrl || !blobPathname || !fileName || !role) return null

	const sortOrder =
		role === "hero"
			? 0
			: typeof doc.sortOrder === "number" && Number.isFinite(doc.sortOrder)
				? doc.sortOrder
				: deriveSortOrder(fileName, role)
	const image: ProductImageRecord = {
		productKey,
		categorySlug,
		productSlug,
		blobUrl,
		blobPathname,
		fileName,
		role,
		sortOrder,
		...(doc.alt ? { alt: doc.alt } : {}),
		...(typeof doc.width === "number" ? { width: doc.width } : {}),
		...(typeof doc.height === "number" ? { height: doc.height } : {}),
		...(doc.mimeType ? { mimeType: doc.mimeType } : {}),
		...(typeof doc.sizeBytes === "number" ? { sizeBytes: doc.sizeBytes } : {}),
		createdAt: normalizeDate(doc.createdAt),
		updatedAt: normalizeDate(doc.updatedAt),
	}

	if (doc._id !== undefined) image._id = doc._id

	return image
}

function sortProductImages(images: ProductImageRecord[]): ProductImageRecord[] {
	return [...images].sort((a, b) => {
		if (a.role !== b.role) return a.role === "hero" ? -1 : 1
		if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
		return a.fileName.localeCompare(b.fileName)
	})
}

async function findProductImages(query: Record<string, unknown>): Promise<ProductImageRecord[]> {
	if (!process.env.MONGODB_URI?.trim()) return []

	try {
		const { dbName } = getMongoEnv()
		const client = await getMongoClient()
		const docs = await client
			.db(dbName)
			.collection<ProductImageDocument>(PRODUCT_IMAGES_COLLECTION)
			.find(
				{
					...query,
					blobUrl: { $exists: true, $ne: "" },
				},
				{
					projection: IMAGE_PROJECTION,
				},
			)
			.sort({ sortOrder: 1, fileName: 1 })
			.toArray()

		return sortProductImages(
			docs
				.map(normalizeProductImageDocument)
				.filter((image): image is ProductImageRecord => Boolean(image)),
		)
	} catch (error) {
		warnDatabaseImageLookupFailure(error)
		return []
	}
}

export async function listProductImagesFromDatabase(
	categorySlug: string,
	productSlug: string,
): Promise<ProductImageRecord[]> {
	const normalizedCategorySlug = categorySlug.trim()
	const normalizedProductSlug = productSlug.trim()
	if (!normalizedCategorySlug || !normalizedProductSlug) return []

	const productKey = `${normalizedCategorySlug}/${normalizedProductSlug}`
	return findProductImages({
		productKey,
		categorySlug: normalizedCategorySlug,
		productSlug: normalizedProductSlug,
	})
}

export async function listProductImagesByProductKeyFromDatabase(
	productKey: string,
): Promise<ProductImageRecord[]> {
	const normalizedProductKey = productKey.trim()
	if (!normalizedProductKey) return []

	return findProductImages({ productKey: normalizedProductKey })
}

async function getProductImagesCollection() {
	const { dbName } = getMongoEnv()
	const client = await getMongoClient()
	return client.db(dbName).collection<ProductImageDocument>(PRODUCT_IMAGES_COLLECTION)
}

async function ensureProductImageIndexes() {
	const collection = await getProductImagesCollection()
	await collection.createIndex(
		{ productKey: 1, blobPathname: 1 },
		{ unique: true, name: "product_images_productKey_blobPathname_unique" },
	)
	await collection.createIndex(
		{ categorySlug: 1, productSlug: 1, role: 1, sortOrder: 1 },
		{ name: "product_images_catalog_lookup" },
	)
	return collection
}

export async function createProductImageInDatabase(input: {
	categorySlug: string
	productSlug: string
	blobUrl: string
	blobPathname: string
	fileName: string
	role: "hero" | "gallery"
	sortOrder: number
	alt?: string
	width?: number
	height?: number
	mimeType?: string
	sizeBytes?: number
}): Promise<ProductImageRecord> {
	assertWritableMongoConfigured()

	const categorySlug = input.categorySlug.trim()
	const productSlug = input.productSlug.trim()
	const productKey = `${categorySlug}/${productSlug}`
	const blobUrl = input.blobUrl.trim()
	const blobPathname = input.blobPathname.trim()
	const fileName = input.fileName.trim()

	if (!categorySlug || !productSlug) throw new Error("Product image requires category and product slugs.")
	if (!blobUrl || !blobPathname || !fileName) throw new Error("Product image requires Blob URL, pathname, and file name.")
	if (input.role !== "hero" && input.role !== "gallery") throw new Error("Invalid product image role.")
	if (!Number.isFinite(input.sortOrder)) throw new Error("Invalid product image sort order.")

	const now = new Date()
	const image: ProductImageRecord = {
		productKey,
		categorySlug,
		productSlug,
		blobUrl,
		blobPathname,
		fileName,
		role: input.role,
		sortOrder: input.role === "hero" ? 0 : input.sortOrder,
		...(input.alt?.trim() ? { alt: input.alt.trim() } : {}),
		...(typeof input.width === "number" && Number.isFinite(input.width) ? { width: input.width } : {}),
		...(typeof input.height === "number" && Number.isFinite(input.height) ? { height: input.height } : {}),
		...(input.mimeType?.trim() ? { mimeType: input.mimeType.trim() } : {}),
		...(typeof input.sizeBytes === "number" && Number.isFinite(input.sizeBytes) ? { sizeBytes: input.sizeBytes } : {}),
		createdAt: now,
		updatedAt: now,
	}

	const collection = await ensureProductImageIndexes()
	const result = await collection.insertOne({
		productKey: image.productKey,
		categorySlug: image.categorySlug,
		productSlug: image.productSlug,
		blobUrl: image.blobUrl,
		blobPathname: image.blobPathname,
		fileName: image.fileName,
		role: image.role,
		sortOrder: image.sortOrder,
		...(image.alt ? { alt: image.alt } : {}),
		...(image.width !== undefined ? { width: image.width } : {}),
		...(image.height !== undefined ? { height: image.height } : {}),
		...(image.mimeType ? { mimeType: image.mimeType } : {}),
		...(image.sizeBytes !== undefined ? { sizeBytes: image.sizeBytes } : {}),
		createdAt: image.createdAt,
		updatedAt: image.updatedAt,
	})
	image._id = result.insertedId

	return image
}

export async function getProductImageByIdFromDatabase(id: string): Promise<ProductImageRecord | null> {
	if (!process.env.MONGODB_URI?.trim()) return null

	const objectId = objectIdFromString(id)
	if (!objectId) return null

	try {
		const collection = await getProductImagesCollection()
		const doc = await collection.findOne({ _id: objectId }, { projection: IMAGE_PROJECTION })
		return doc ? normalizeProductImageDocument(doc) : null
	} catch {
		return null
	}
}

export async function updateProductImageInDatabase(
	id: string,
	patch: {
		role?: "hero" | "gallery"
		sortOrder?: number
		alt?: string
		blobUrl?: string
		blobPathname?: string
		fileName?: string
		width?: number
		height?: number
		mimeType?: string
		sizeBytes?: number
	},
): Promise<ProductImageRecord | null> {
	assertWritableMongoConfigured()

	const objectId = objectIdFromString(id)
	if (!objectId) return null

	const set: ProductImageDocument = { updatedAt: new Date() }
	const unset: Record<string, ""> = {}

	if (patch.role !== undefined) {
		if (patch.role !== "hero" && patch.role !== "gallery") throw new Error("Invalid product image role.")
		set.role = patch.role
		if (patch.role === "hero") set.sortOrder = 0
	}
	if (patch.sortOrder !== undefined) {
		if (!Number.isFinite(patch.sortOrder)) throw new Error("Invalid product image sort order.")
		set.sortOrder = patch.role === "hero" ? 0 : patch.sortOrder
	}
	for (const [key, value] of [
		["blobUrl", patch.blobUrl],
		["blobPathname", patch.blobPathname],
		["fileName", patch.fileName],
		["mimeType", patch.mimeType],
	] as const) {
		if (value === undefined) continue
		const trimmed = value.trim()
		if (!trimmed) throw new Error(`Invalid product image ${key}.`)
		set[key] = trimmed
	}
	if (patch.alt !== undefined) {
		const alt = patch.alt.trim()
		if (alt) set.alt = alt
		else unset.alt = ""
	}
	if (patch.width !== undefined) {
		if (!Number.isFinite(patch.width)) throw new Error("Invalid product image width.")
		set.width = patch.width
	}
	if (patch.height !== undefined) {
		if (!Number.isFinite(patch.height)) throw new Error("Invalid product image height.")
		set.height = patch.height
	}
	if (patch.sizeBytes !== undefined) {
		if (!Number.isFinite(patch.sizeBytes)) throw new Error("Invalid product image size.")
		set.sizeBytes = patch.sizeBytes
	}

	const collection = await ensureProductImageIndexes()
	const update = Object.keys(unset).length > 0 ? { $set: set, $unset: unset } : { $set: set }
	const result = await collection.findOneAndUpdate(
		{ _id: objectId },
		update,
		{ returnDocument: "after", projection: IMAGE_PROJECTION },
	)

	return result ? normalizeProductImageDocument(result) : null
}

export async function deleteProductImageFromDatabase(id: string): Promise<boolean> {
	assertWritableMongoConfigured()

	const objectId = objectIdFromString(id)
	if (!objectId) return false

	const collection = await getProductImagesCollection()
	const result = await collection.deleteOne({ _id: objectId })
	return result.deletedCount > 0
}

export async function reorderProductImagesInDatabase(
	categorySlug: string,
	productSlug: string,
	orderedImageIds: string[],
): Promise<void> {
	assertWritableMongoConfigured()

	const objectIds: ObjectId[] = []
	for (const id of orderedImageIds) {
		const objectId = objectIdFromString(id)
		if (!objectId) throw new Error("Invalid product image ID.")
		objectIds.push(objectId)
	}

	const productKey = `${categorySlug.trim()}/${productSlug.trim()}`
	const collection = await getProductImagesCollection()
	const docs = await collection
		.find({ _id: { $in: objectIds } }, { projection: IMAGE_PROJECTION })
		.toArray()
	const images = docs
		.map(normalizeProductImageDocument)
		.filter((image): image is ProductImageRecord => Boolean(image))

	if (images.length !== orderedImageIds.length) throw new Error("One or more product images were not found.")
	if (images.some((image) => image.productKey !== productKey)) {
		throw new Error("One or more product images do not belong to this product.")
	}

	let galleryOrder = 1
	const now = new Date()
	const updates = orderedImageIds.map((id, index) => {
		const image = images.find((item) => String(item._id) === id)
		if (!image) throw new Error("One or more product images were not found.")
		const sortOrder = image.role === "hero" ? 0 : galleryOrder++
		return {
			updateOne: {
				filter: { _id: objectIds[index] },
				update: { $set: { sortOrder, updatedAt: now } },
			},
		}
	})

	if (updates.length > 0) await collection.bulkWrite(updates)
}

export async function renameProductImagesProductSlugInDatabase(input: {
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
	imagePathUpdates: Array<{
		id: string
		blobUrl: string
		blobPathname: string
	}>
}): Promise<void> {
	assertWritableMongoConfigured()

	const categorySlug = normalizeCategorySlug(input.categorySlug)
	const oldProductSlug = normalizeProductSlug(input.oldProductSlug)
	const newProductSlug = normalizeProductSlug(input.newProductSlug)
	if (!categorySlug) throw new Error("Invalid category slug.")
	if (!oldProductSlug || !isValidProductSlug(oldProductSlug)) throw new Error("Invalid product slug.")
	if (!newProductSlug || !isValidProductSlug(newProductSlug)) throw new Error("Invalid new product slug.")

	const oldProductKey = `${categorySlug}/${oldProductSlug}`
	const newProductKey = `${categorySlug}/${newProductSlug}`
	const collection = await ensureProductImageIndexes()
	const existingDocs = await collection
		.find({ categorySlug, productSlug: oldProductSlug, productKey: oldProductKey }, { projection: IMAGE_PROJECTION })
		.toArray()
	const existingImages = existingDocs
		.map(normalizeProductImageDocument)
		.filter((image): image is ProductImageRecord => Boolean(image))
	const updatesById = new Map(input.imagePathUpdates.map((update) => [update.id, update]))

	if (existingImages.length !== input.imagePathUpdates.length) {
		throw new Error("One or more product image updates do not match the current product images.")
	}

	for (const image of existingImages) {
		const id = image._id !== undefined ? String(image._id) : ""
		const update = updatesById.get(id)
		if (!id || !update) throw new Error("One or more product images do not belong to this product.")
		if (!update.blobUrl.trim() || !update.blobPathname.trim()) throw new Error("Product image rename requires Blob URL and pathname updates.")
	}

	const objectIds = input.imagePathUpdates.map((update) => objectIdFromString(update.id))
	if (objectIds.some((objectId) => !objectId)) throw new Error("Invalid product image ID.")
	if (input.imagePathUpdates.length === 0) return

	const now = new Date()
	const result = await collection.bulkWrite(
		input.imagePathUpdates.map((update, index) => ({
			updateOne: {
				filter: {
					_id: objectIds[index]!,
					categorySlug,
					productSlug: oldProductSlug,
					productKey: oldProductKey,
				},
				update: {
					$set: {
						categorySlug,
						productSlug: newProductSlug,
						productKey: newProductKey,
						blobUrl: update.blobUrl.trim(),
						blobPathname: update.blobPathname.trim(),
						updatedAt: now,
					},
				},
			},
		})),
	)
	if (result.matchedCount !== input.imagePathUpdates.length) {
		throw new Error("One or more product images were not renamed.")
	}
}

export async function moveProductImagesToCategoryInDatabase(input: {
	oldCategorySlug: string
	productSlug: string
	newCategorySlug: string
	imagePathUpdates: Array<{
		id: string
		blobUrl: string
		blobPathname: string
	}>
}): Promise<void> {
	assertWritableMongoConfigured()

	const oldCategorySlug = normalizeCategorySlug(input.oldCategorySlug)
	const newCategorySlug = normalizeCategorySlug(input.newCategorySlug)
	const productSlug = normalizeProductSlug(input.productSlug)
	if (!oldCategorySlug) throw new Error("Invalid current category slug.")
	if (!newCategorySlug) throw new Error("Invalid target category slug.")
	if (!productSlug || !isValidProductSlug(productSlug)) throw new Error("Invalid product slug.")

	const oldProductKey = `${oldCategorySlug}/${productSlug}`
	const newProductKey = `${newCategorySlug}/${productSlug}`
	const collection = await ensureProductImageIndexes()
	const existingDocs = await collection
		.find({ categorySlug: oldCategorySlug, productSlug, productKey: oldProductKey }, { projection: IMAGE_PROJECTION })
		.toArray()
	const existingImages = existingDocs
		.map(normalizeProductImageDocument)
		.filter((image): image is ProductImageRecord => Boolean(image))
	const updatesById = new Map(input.imagePathUpdates.map((update) => [update.id, update]))

	if (existingImages.length !== input.imagePathUpdates.length) {
		throw new Error("One or more product image updates do not match the current product images.")
	}

	for (const image of existingImages) {
		const id = image._id !== undefined ? String(image._id) : ""
		const update = updatesById.get(id)
		if (!id || !update) throw new Error("One or more product images do not belong to this product.")
		if (!update.blobUrl.trim() || !update.blobPathname.trim()) throw new Error("Product image move requires Blob URL and pathname updates.")
	}

	const objectIds = input.imagePathUpdates.map((update) => objectIdFromString(update.id))
	if (objectIds.some((objectId) => !objectId)) throw new Error("Invalid product image ID.")
	if (input.imagePathUpdates.length === 0) return

	const now = new Date()
	const result = await collection.bulkWrite(
		input.imagePathUpdates.map((update, index) => ({
			updateOne: {
				filter: {
					_id: objectIds[index]!,
					categorySlug: oldCategorySlug,
					productSlug,
					productKey: oldProductKey,
				},
				update: {
					$set: {
						categorySlug: newCategorySlug,
						productSlug,
						productKey: newProductKey,
						blobUrl: update.blobUrl.trim(),
						blobPathname: update.blobPathname.trim(),
						updatedAt: now,
					},
				},
			},
		})),
	)
	if (result.matchedCount !== input.imagePathUpdates.length) {
		throw new Error("One or more product images were not moved.")
	}
}

export async function listRecentProductImagesFromDatabase(limit = 50): Promise<ProductImageRecord[]> {
	if (!process.env.MONGODB_URI?.trim()) return []

	try {
		const collection = await getProductImagesCollection()
		const docs = await collection
			.find({ blobUrl: { $exists: true, $ne: "" } }, { projection: IMAGE_PROJECTION })
			.sort({ updatedAt: -1, createdAt: -1 })
			.limit(Math.max(1, Math.min(limit, 100)))
			.toArray()

		return docs
			.map(normalizeProductImageDocument)
			.filter((image): image is ProductImageRecord => Boolean(image))
	} catch {
		return []
	}
}

export async function listAllProductImagesFromDatabase(): Promise<ProductImageRecord[]> {
	if (!process.env.MONGODB_URI?.trim()) return []

	try {
		const collection = await getProductImagesCollection()
		const docs = await collection
			.find({ blobUrl: { $exists: true, $ne: "" } }, { projection: IMAGE_PROJECTION })
			.sort({ productKey: 1, role: 1, sortOrder: 1, fileName: 1 })
			.toArray()

		return docs
			.map(normalizeProductImageDocument)
			.filter((image): image is ProductImageRecord => Boolean(image))
	} catch {
		return []
	}
}
