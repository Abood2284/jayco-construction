"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireAdminUser } from "@/lib/admin/auth"
import {
	snapshotProductImage,
	writeAdminAuditLog,
} from "@/lib/admin/audit"
import {
	deleteProductImage,
	reorderProductImages,
	replaceProductImage,
	updateProductImageMetadata,
	uploadProductImage,
} from "@/lib/blob/product-media-service"
import { resetCatalogCache } from "@/lib/content/catalog"
import {
	getProductImageByIdFromDatabase,
	listProductImagesFromDatabase,
	type ProductImageRecord,
} from "@/lib/mongodb/product-images"

type ProductImageRole = "hero" | "gallery"

function getOptionalString(formData: FormData, key: string): string | undefined {
	const value = formData.get(key)
	if (typeof value !== "string") return undefined
	const trimmed = value.trim()
	return trimmed || undefined
}

function getRequiredString(formData: FormData, key: string): string {
	const value = getOptionalString(formData, key)
	if (!value) throw new Error(`${key} is required.`)
	return value
}

function getImageRole(formData: FormData): ProductImageRole {
	const role = getRequiredString(formData, "role")
	if (role !== "hero" && role !== "gallery") throw new Error("Invalid image role.")
	return role
}

function getOptionalNumber(formData: FormData, key: string): number | undefined {
	const value = getOptionalString(formData, key)
	if (!value) return undefined
	const parsed = Number(value)
	if (!Number.isFinite(parsed)) throw new Error(`${key} must be a valid number.`)
	return parsed
}

function getRequiredFile(formData: FormData): File {
	const file = formData.get("file")
	if (!(file instanceof File) || file.size === 0) throw new Error("Select an image file to upload.")
	return file
}

function getRequiredUploadFiles(formData: FormData): File[] {
	const files = formData
		.getAll("files")
		.filter((file): file is File => file instanceof File && file.size > 0)
	if (files.length > 0) return files
	return [getRequiredFile(formData)]
}

function getFriendlyImageError(error: unknown): string {
	if (error && typeof error === "object") {
		const message = "message" in error ? String(error.message ?? "") : ""
		if (
			message.includes("Missing BLOB_READ_WRITE_TOKEN") ||
			message.includes("Missing MONGODB_URI") ||
			message.includes("Unsupported image type") ||
			message.includes("Image is too large") ||
			message.includes("Only one hero image") ||
			message.includes("already has a hero") ||
			message.includes("Product image was not found") ||
			message.includes("Product was not found") ||
			message.includes("Invalid image role") ||
			message.includes("Invalid product image") ||
			message.includes("does not belong") ||
			message.includes("not deleted")
		) {
			return message
		}
	}

	return "Could not update product media. Check the server logs and try again."
}

function getSafeReturnTo(value: unknown, fallback = "/admin/catalog/media"): string {
	if (typeof value !== "string") return fallback
	const trimmed = value.trim()
	if (!trimmed.startsWith("/admin/")) return fallback
	if (trimmed.includes("://") || trimmed.startsWith("//")) return fallback
	return trimmed
}

function getReturnTo(formData: FormData): string {
	return getSafeReturnTo(formData.get("returnTo"))
}

function redirectWithError(path: string, error: unknown): never {
	const separator = path.includes("?") ? "&" : "?"
	redirect(`${path}${separator}error=${encodeURIComponent(getFriendlyImageError(error))}`)
}

function revalidateImagePaths(categorySlug?: string, productSlug?: string) {
	resetCatalogCache()
	revalidatePath("/admin/catalog/media")
	revalidatePath("/admin/catalog/products")
	if (categorySlug && productSlug) {
		revalidatePath(`/admin/catalog/products/${categorySlug}/${productSlug}`)
		revalidatePath(`/products/${categorySlug}/${productSlug}`)
		revalidatePath(`/products/${categorySlug}`)
	}
}

async function getImageIdentity(imageId: string) {
	const image = await getProductImageByIdFromDatabase(imageId)
	return image ? { categorySlug: image.categorySlug, productSlug: image.productSlug } : {}
}

export async function uploadProductImageAction(formData: FormData): Promise<void> {
	const actor = await requireAdminUser()

	let categorySlug = ""
	let productSlug = ""
	const returnTo = getReturnTo(formData)
	const uploadedImages: ProductImageRecord[] = []
	try {
		categorySlug = getRequiredString(formData, "categorySlug")
		productSlug = getRequiredString(formData, "productSlug")
		const role = getImageRole(formData)
		const files = getRequiredUploadFiles(formData)
		if (role === "hero" && files.length > 1) throw new Error("Only one hero image can be uploaded at a time.")

		for (const file of files) {
			const image = await uploadProductImage({
				categorySlug,
				productSlug,
				file,
				role,
				alt: getOptionalString(formData, "alt"),
			})
			uploadedImages.push(image)
			await writeAdminAuditLog({
				actor,
				action: "product_image.upload",
				status: "success",
				entityType: "product_image",
				entityId: image._id !== undefined ? String(image._id) : undefined,
				entityKey: image.productKey,
				summary: `Uploaded product image for "${image.productKey}"`,
				after: snapshotProductImage(image),
			})
		}
		const lastImage = uploadedImages.at(-1)
		revalidateImagePaths(lastImage?.categorySlug ?? categorySlug, lastImage?.productSlug ?? productSlug)
	} catch (error) {
		await writeAdminAuditLog({
			actor,
			action: "product_image.upload",
			status: "failure",
			entityType: "product_image",
			entityKey: categorySlug && productSlug ? `${categorySlug}/${productSlug}` : undefined,
			summary:
				categorySlug && productSlug
					? `Failed to upload product image for "${categorySlug}/${productSlug}"`
					: "Failed to upload product image",
			metadata: {
				categorySlug: categorySlug || undefined,
				productSlug: productSlug || undefined,
				role: getOptionalString(formData, "role"),
				alt: getOptionalString(formData, "alt"),
				uploadedCountBeforeFailure: uploadedImages.length,
			},
			error,
		})
		redirectWithError(returnTo, error)
	}

	redirect(returnTo)
}

export async function replaceProductImageAction(
	imageId: string,
	formData: FormData,
): Promise<void> {
	const actor = await requireAdminUser()

	const returnTo = getReturnTo(formData)
	let previous: ProductImageRecord | null = null
	try {
		previous = await getProductImageByIdFromDatabase(imageId)
		const image = await replaceProductImage({
			imageId,
			file: getRequiredFile(formData),
			alt: getOptionalString(formData, "alt"),
		})
		await writeAdminAuditLog({
			actor,
			action: "product_image.replace",
			status: "success",
			entityType: "product_image",
			entityId: imageId,
			entityKey: image.productKey,
			summary: `Replaced product image "${previous?.fileName ?? image.fileName}"`,
			before: snapshotProductImage(previous),
			after: snapshotProductImage(image),
		})
		revalidateImagePaths(image.categorySlug, image.productSlug)
	} catch (error) {
		await writeAdminAuditLog({
			actor,
			action: "product_image.replace",
			status: "failure",
			entityType: "product_image",
			entityId: imageId,
			entityKey: previous?.productKey,
			summary: previous
				? `Failed to replace product image "${previous.fileName}"`
				: "Failed to replace product image",
			before: snapshotProductImage(previous),
			error,
		})
		redirectWithError(returnTo, error)
	}

	redirect(returnTo)
}

export async function deleteProductImageAction(
	imageId: string,
	returnTo = "/admin/catalog/media",
): Promise<void> {
	const actor = await requireAdminUser()

	const safeReturnTo = getSafeReturnTo(returnTo)
	const previous = await getProductImageByIdFromDatabase(imageId)
	const identity = previous ? { categorySlug: previous.categorySlug, productSlug: previous.productSlug } : await getImageIdentity(imageId)
	try {
		await deleteProductImage({ imageId })
		await writeAdminAuditLog({
			actor,
			action: "product_image.delete",
			status: "success",
			entityType: "product_image",
			entityId: imageId,
			entityKey: previous?.productKey,
			summary: previous
				? `Deleted product image "${previous.fileName}"`
				: "Deleted product image",
			before: snapshotProductImage(previous),
		})
		revalidateImagePaths(identity.categorySlug, identity.productSlug)
	} catch (error) {
		await writeAdminAuditLog({
			actor,
			action: "product_image.delete",
			status: "failure",
			entityType: "product_image",
			entityId: imageId,
			entityKey: previous?.productKey,
			summary: previous
				? `Failed to delete product image "${previous.fileName}"`
				: "Failed to delete product image",
			before: snapshotProductImage(previous),
			error,
		})
		redirectWithError(safeReturnTo, error)
	}

	redirect(safeReturnTo)
}

export async function updateProductImageMetadataAction(
	imageId: string,
	formData: FormData,
): Promise<void> {
	const actor = await requireAdminUser()

	const returnTo = getReturnTo(formData)
	let previous: ProductImageRecord | null = null
	try {
		previous = await getProductImageByIdFromDatabase(imageId)
		const image = await updateProductImageMetadata({
			imageId,
			role: getOptionalString(formData, "role") as ProductImageRole | undefined,
			sortOrder: getOptionalNumber(formData, "sortOrder"),
			alt: getOptionalString(formData, "alt") ?? "",
		})
		await writeAdminAuditLog({
			actor,
			action: "product_image.metadata_update",
			status: "success",
			entityType: "product_image",
			entityId: imageId,
			entityKey: image.productKey,
			summary: `Updated product image metadata "${image.fileName}"`,
			before: snapshotProductImage(previous),
			after: snapshotProductImage(image),
		})
		revalidateImagePaths(image.categorySlug, image.productSlug)
	} catch (error) {
		await writeAdminAuditLog({
			actor,
			action: "product_image.metadata_update",
			status: "failure",
			entityType: "product_image",
			entityId: imageId,
			entityKey: previous?.productKey,
			summary: previous
				? `Failed to update product image metadata "${previous.fileName}"`
				: "Failed to update product image metadata",
			before: snapshotProductImage(previous),
			metadata: {
				role: getOptionalString(formData, "role"),
				sortOrder: getOptionalString(formData, "sortOrder"),
				alt: getOptionalString(formData, "alt"),
			},
			error,
		})
		redirectWithError(returnTo, error)
	}

	redirect(returnTo)
}

export async function reorderProductImagesAction(
	categorySlug: string,
	productSlug: string,
	orderedImageIds: string[],
	returnTo = "/admin/catalog/media",
): Promise<void> {
	const actor = await requireAdminUser()

	const safeReturnTo = getSafeReturnTo(returnTo)
	const productKey = `${categorySlug}/${productSlug}`
	let previousImages: ProductImageRecord[] = []
	try {
		previousImages = await listProductImagesFromDatabase(categorySlug, productSlug)
		await reorderProductImages({ categorySlug, productSlug, orderedImageIds })
		const updatedImages = await listProductImagesFromDatabase(categorySlug, productSlug)
		await writeAdminAuditLog({
			actor,
			action: "product_image.reorder",
			status: "success",
			entityType: "product_image",
			entityKey: productKey,
			summary: `Reordered product images for "${productKey}"`,
			before: previousImages.map(snapshotProductImage),
			after: updatedImages.map(snapshotProductImage),
			metadata: {
				orderedImageIds,
			},
		})
		revalidateImagePaths(categorySlug, productSlug)
	} catch (error) {
		await writeAdminAuditLog({
			actor,
			action: "product_image.reorder",
			status: "failure",
			entityType: "product_image",
			entityKey: productKey,
			summary: `Failed to reorder product images for "${productKey}"`,
			before: previousImages.map(snapshotProductImage),
			metadata: {
				orderedImageIds,
			},
			error,
		})
		redirectWithError(safeReturnTo, error)
	}

	redirect(safeReturnTo)
}
