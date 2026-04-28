import { del, put } from "@vercel/blob"

import {
	createProductImageInDatabase,
	deleteProductImageFromDatabase,
	getProductImageByIdFromDatabase,
	listProductImagesFromDatabase,
	reorderProductImagesInDatabase,
	updateProductImageInDatabase,
	type ProductImageRecord,
} from "@/lib/mongodb/product-images"
import { getProductByKeyFromDatabase, normalizeProductSlug } from "@/lib/mongodb/products"
import { normalizeCategorySlug } from "@/lib/mongodb/product-categories"

type ProductImageRole = "hero" | "gallery"

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024
const MIME_EXTENSION_MAP = new Map([
	["image/jpeg", ".jpg"],
	["image/png", ".png"],
	["image/webp", ".webp"],
	["image/avif", ".avif"],
])
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

function assertBlobTokenConfigured() {
	if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
		throw new Error("Missing BLOB_READ_WRITE_TOKEN. Add it to .env.local or export it before managing product media.")
	}
}

function assertSupportedRole(role: ProductImageRole) {
	if (role !== "hero" && role !== "gallery") throw new Error("Invalid image role.")
}

function normalizeProductIdentity(categorySlug: string, productSlug: string) {
	const normalizedCategorySlug = normalizeCategorySlug(categorySlug)
	const normalizedProductSlug = normalizeProductSlug(productSlug)
	if (!normalizedCategorySlug || !normalizedProductSlug) throw new Error("Invalid product identity.")
	return { categorySlug: normalizedCategorySlug, productSlug: normalizedProductSlug }
}

function getExtensionFromFileName(fileName: string): string {
	const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/)
	return match?.[0] ?? ""
}

function getSafeImageExtension(file: File): string {
	const fromMime = MIME_EXTENSION_MAP.get(file.type)
	if (fromMime) return fromMime

	const fromName = getExtensionFromFileName(file.name)
	if (ALLOWED_EXTENSIONS.has(fromName)) return fromName

	throw new Error("Unsupported image type. Upload JPG, PNG, WebP, or AVIF images.")
}

function assertValidImageFile(file: File) {
	if (!(file instanceof File) || file.size === 0) throw new Error("Select an image file to upload.")
	if (file.size > MAX_IMAGE_SIZE_BYTES) throw new Error("Image is too large. Maximum size is 8 MB.")
	getSafeImageExtension(file)
}

function createProductImagePath(input: {
	categorySlug: string
	productSlug: string
	role: ProductImageRole
	file: File
}): string {
	const { categorySlug, productSlug } = normalizeProductIdentity(input.categorySlug, input.productSlug)
	assertSupportedRole(input.role)
	const extension = getSafeImageExtension(input.file)
	const timestamp = Date.now()
	return `products/${categorySlug}/${productSlug}/${input.role}-${timestamp}${extension}`
}

function fileNameFromPath(pathname: string): string {
	return pathname.split("/").pop() ?? pathname
}

function warnBlobCleanupFailure(error: unknown) {
	if (process.env.NODE_ENV !== "production") {
		console.warn("Product media Blob cleanup failed.", error)
	}
}

function isMissingBlobError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false
	const message = "message" in error ? String(error.message ?? "").toLowerCase() : ""
	const status = "status" in error ? String(error.status ?? "") : ""
	return status === "404" || message.includes("not found") || message.includes("no such")
}

async function deleteBlobBestEffort(urlOrPathname: string) {
	try {
		await del(urlOrPathname)
	} catch (error) {
		if (!isMissingBlobError(error)) warnBlobCleanupFailure(error)
	}
}

async function assertProductExists(categorySlug: string, productSlug: string) {
	const product = await getProductByKeyFromDatabase(categorySlug, productSlug)
	if (!product) throw new Error("Product was not found. Product media can only be managed for DB-backed products.")
}

function nextGallerySortOrder(images: ProductImageRecord[]): number {
	const galleryOrders = images
		.filter((image) => image.role === "gallery")
		.map((image) => image.sortOrder)
		.filter((order) => Number.isFinite(order))
	return galleryOrders.length > 0 ? Math.max(...galleryOrders) + 1 : 1
}

async function getExistingHeroImage(image: ProductImageRecord): Promise<ProductImageRecord | null> {
	const existingImages = await listProductImagesFromDatabase(image.categorySlug, image.productSlug)
	return existingImages.find((candidate) => candidate.role === "hero" && String(candidate._id) !== String(image._id)) ?? null
}

export async function uploadProductImage(input: {
	categorySlug: string
	productSlug: string
	file: File
	role: ProductImageRole
	alt?: string
}): Promise<ProductImageRecord> {
	assertBlobTokenConfigured()
	assertSupportedRole(input.role)
	assertValidImageFile(input.file)

	const { categorySlug, productSlug } = normalizeProductIdentity(input.categorySlug, input.productSlug)
	await assertProductExists(categorySlug, productSlug)

	const existingImages = await listProductImagesFromDatabase(categorySlug, productSlug)
	if (input.role === "hero" && existingImages.some((image) => image.role === "hero")) {
		throw new Error("This product already has a hero image. Replace the existing hero image instead.")
	}

	const pathname = createProductImagePath({ categorySlug, productSlug, role: input.role, file: input.file })
	const blob = await put(pathname, input.file, {
		access: "public",
		addRandomSuffix: false,
	})

	try {
		return await createProductImageInDatabase({
			categorySlug,
			productSlug,
			blobUrl: blob.url,
			blobPathname: blob.pathname,
			fileName: fileNameFromPath(blob.pathname),
			role: input.role,
			sortOrder: input.role === "hero" ? 0 : nextGallerySortOrder(existingImages),
			alt: input.alt,
			mimeType: input.file.type,
			sizeBytes: input.file.size,
		})
	} catch (error) {
		await deleteBlobBestEffort(blob.url)
		throw error
	}
}

export async function replaceProductImage(input: {
	imageId: string
	file: File
	alt?: string
}): Promise<ProductImageRecord> {
	assertBlobTokenConfigured()
	assertValidImageFile(input.file)

	const existingImage = await getProductImageByIdFromDatabase(input.imageId)
	if (!existingImage) throw new Error("Product image was not found.")
	await assertProductExists(existingImage.categorySlug, existingImage.productSlug)

	const pathname = createProductImagePath({
		categorySlug: existingImage.categorySlug,
		productSlug: existingImage.productSlug,
		role: existingImage.role,
		file: input.file,
	})
	const blob = await put(pathname, input.file, {
		access: "public",
		addRandomSuffix: false,
	})

	let updated: ProductImageRecord | null
	try {
		updated = await updateProductImageInDatabase(input.imageId, {
			blobUrl: blob.url,
			blobPathname: blob.pathname,
			fileName: fileNameFromPath(blob.pathname),
			alt: input.alt,
			mimeType: input.file.type,
			sizeBytes: input.file.size,
		})
	} catch (error) {
		await deleteBlobBestEffort(blob.url)
		throw error
	}

	if (!updated) {
		await deleteBlobBestEffort(blob.url)
		throw new Error("Product image was not found after replacement upload.")
	}

	await deleteBlobBestEffort(existingImage.blobUrl || existingImage.blobPathname)
	return updated
}

export async function deleteProductImage(input: { imageId: string }): Promise<void> {
	assertBlobTokenConfigured()

	const image = await getProductImageByIdFromDatabase(input.imageId)
	if (!image) throw new Error("Product image was not found.")

	try {
		await del(image.blobUrl || image.blobPathname)
	} catch (error) {
		if (!isMissingBlobError(error)) throw error
	}

	const deleted = await deleteProductImageFromDatabase(input.imageId)
	if (!deleted) throw new Error("Product image record was not deleted.")
}

export async function updateProductImageMetadata(input: {
	imageId: string
	role?: ProductImageRole
	sortOrder?: number
	alt?: string
}): Promise<ProductImageRecord> {
	const existingImage = await getProductImageByIdFromDatabase(input.imageId)
	if (!existingImage) throw new Error("Product image was not found.")

	if (input.role !== undefined) assertSupportedRole(input.role)
	if (input.role === "hero") {
		const existingHero = await getExistingHeroImage(existingImage)
		if (existingHero?._id !== undefined) {
			const existingImages = await listProductImagesFromDatabase(existingImage.categorySlug, existingImage.productSlug)
			await updateProductImageInDatabase(String(existingHero._id), {
				role: "gallery",
				sortOrder: nextGallerySortOrder(existingImages),
			})
		}
	}

	const updated = await updateProductImageInDatabase(input.imageId, {
		role: input.role,
		sortOrder: input.role === "hero" ? 0 : input.sortOrder,
		alt: input.alt,
	})
	if (!updated) throw new Error("Product image was not found.")
	return updated
}

export async function reorderProductImages(input: {
	categorySlug: string
	productSlug: string
	orderedImageIds: string[]
}): Promise<void> {
	const { categorySlug, productSlug } = normalizeProductIdentity(input.categorySlug, input.productSlug)
	await reorderProductImagesInDatabase(categorySlug, productSlug, input.orderedImageIds)
}
