import "server-only"

import { snapshotProduct, writeAdminAuditLog } from "@/lib/admin/audit"
import { deletePublicBlobObjectBestEffort, movePublicBlobObject } from "@/lib/blob/blob-move"
import { resetCatalogCache } from "@/lib/content/catalog"
import { listProductImagesFromDatabase } from "@/lib/mongodb/product-images"
import { renameProductImagesProductSlugInDatabase } from "@/lib/mongodb/product-images"
import {
	getProductByKeyFromDatabase,
	isValidProductSlug,
	normalizeProductSlug,
	renameProductSlugInDatabase,
	type ProductRecord,
} from "@/lib/mongodb/products"
import {
	isValidCategorySlug,
	normalizeCategorySlug,
} from "@/lib/mongodb/product-categories"

export interface ProductSlugRenameImpact {
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
	productExists: boolean
	targetSlugAvailable: boolean
	oldProductKey: string
	newProductKey: string
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

type MovedBlob = Awaited<ReturnType<typeof movePublicBlobObject>> & {
	imageId: string
	oldBlobUrl?: string
}

function assertMongoConfigured() {
	if (!process.env.MONGODB_URI?.trim()) {
		throw new Error("Missing MONGODB_URI. Add it to .env.local or export it before renaming product slugs.")
	}
}

function productKeyFor(categorySlug: string, productSlug: string): string {
	return `${categorySlug}/${productSlug}`
}

function normalizeRenameSlugs(input: {
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
}) {
	const categorySlug = normalizeCategorySlug(input.categorySlug)
	const oldProductSlug = normalizeProductSlug(input.oldProductSlug)
	const newProductSlug = normalizeProductSlug(input.newProductSlug)

	if (!categorySlug || !isValidCategorySlug(categorySlug)) throw new Error("Invalid category slug.")
	if (!oldProductSlug || !isValidProductSlug(oldProductSlug)) throw new Error("Invalid current product slug.")
	if (!newProductSlug || !isValidProductSlug(newProductSlug)) {
		throw new Error("Enter a valid new product slug using lowercase letters, numbers, and hyphens.")
	}
	if (oldProductSlug === newProductSlug) throw new Error("New product slug must be different from the current slug.")

	return { categorySlug, oldProductSlug, newProductSlug }
}

function newBlobPathnameFor(input: {
	oldPathname?: string
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
}): string | undefined {
	const normalizedPathname = input.oldPathname?.trim().replace(/^\/+/, "")
	if (!normalizedPathname) return undefined
	const oldPrefix = `products/${input.categorySlug}/${input.oldProductSlug}/`
	if (!normalizedPathname.startsWith(oldPrefix)) return undefined
	return `products/${input.categorySlug}/${input.newProductSlug}/${normalizedPathname.slice(oldPrefix.length)}`
}

function buildWarnings(input: {
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
	imagesWithUnmappedBlobPaths: number
}): string[] {
	const warnings = [
		"Runtime redirect creation is not available yet. Add the listed redirect manually or implement DB-backed redirects in a later PR.",
	]

	if (input.imagesWithUnmappedBlobPaths > 0) {
		warnings.push(`${input.imagesWithUnmappedBlobPaths} image record(s) do not use the expected Blob path prefix and will not have Blob objects moved.`)
	}

	return warnings
}

function snapshotImpact(impact: ProductSlugRenameImpact) {
	return {
		categorySlug: impact.categorySlug,
		oldProductSlug: impact.oldProductSlug,
		newProductSlug: impact.newProductSlug,
		productExists: impact.productExists,
		targetSlugAvailable: impact.targetSlugAvailable,
		oldProductKey: impact.oldProductKey,
		newProductKey: impact.newProductKey,
		affectedImageCount: impact.affectedImages.length,
		blobObjectsToMoveCount: impact.affectedImages.filter((image) => image.oldBlobPathname && image.newBlobPathname).length,
		redirects: impact.affectedRedirects,
		warnings: impact.warnings,
	}
}

function productSnapshot(input: {
	categorySlug: string
	productSlug: string
	productKey: string
}) {
	return {
		categorySlug: input.categorySlug,
		productSlug: input.productSlug,
		productKey: input.productKey,
	}
}

export async function previewProductSlugRename(input: {
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
}): Promise<ProductSlugRenameImpact> {
	assertMongoConfigured()

	const { categorySlug, oldProductSlug, newProductSlug } = normalizeRenameSlugs(input)
	const oldProductKey = productKeyFor(categorySlug, oldProductSlug)
	const newProductKey = productKeyFor(categorySlug, newProductSlug)
	const [product, targetProduct, images] = await Promise.all([
		getProductByKeyFromDatabase(categorySlug, oldProductSlug),
		getProductByKeyFromDatabase(categorySlug, newProductSlug),
		listProductImagesFromDatabase(categorySlug, oldProductSlug),
	])

	const affectedImages = images.map((image) => ({
		id: String(image._id ?? ""),
		fileName: image.fileName,
		oldProductKey,
		newProductKey,
		oldBlobPathname: image.blobPathname,
		newBlobPathname: newBlobPathnameFor({
			oldPathname: image.blobPathname,
			categorySlug,
			oldProductSlug,
			newProductSlug,
		}),
		oldBlobUrl: image.blobUrl,
	}))
	const affectedRedirects = [
		{
			source: `/products/${categorySlug}/${oldProductSlug}`,
			destination: `/products/${categorySlug}/${newProductSlug}`,
		},
	]
	const imagesWithUnmappedBlobPaths = affectedImages.filter((image) => image.oldBlobPathname && !image.newBlobPathname).length

	return {
		categorySlug,
		oldProductSlug,
		newProductSlug,
		productExists: Boolean(product),
		targetSlugAvailable: !targetProduct,
		oldProductKey,
		newProductKey,
		affectedImages,
		affectedRedirects,
		warnings: buildWarnings({
			categorySlug,
			oldProductSlug,
			newProductSlug,
			imagesWithUnmappedBlobPaths,
		}),
	}
}

export async function executeProductSlugRename(input: {
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
	actor?: Actor | null
}): Promise<ProductSlugRenameImpact> {
	let impact: ProductSlugRenameImpact | null = null
	let previous: ProductRecord | null = null
	const movedBlobs: MovedBlob[] = []
	const cleanupWarnings: string[] = []
	let didUpdateDatabase = false

	try {
		impact = await previewProductSlugRename(input)
		if (!impact.productExists) throw new Error(`Product "${impact.oldProductKey}" was not found.`)
		if (!impact.targetSlugAvailable) throw new Error(`Product slug "${impact.newProductSlug}" is not available.`)

		previous = await getProductByKeyFromDatabase(impact.categorySlug, impact.oldProductSlug)
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

		await renameProductSlugInDatabase({
			categorySlug: renameImpact.categorySlug,
			oldProductSlug: renameImpact.oldProductSlug,
			newProductSlug: renameImpact.newProductSlug,
		})
		await renameProductImagesProductSlugInDatabase({
			categorySlug: renameImpact.categorySlug,
			oldProductSlug: renameImpact.oldProductSlug,
			newProductSlug: renameImpact.newProductSlug,
			imagePathUpdates: renameImpact.affectedImages.map((image) => {
				const movedBlob = movedBlobs.find((blob) => blob.imageId === image.id)
				return {
					id: image.id,
					blobUrl: movedBlob?.newUrl ?? image.oldBlobUrl ?? "",
					blobPathname: movedBlob?.newPathname ?? image.oldBlobPathname ?? "",
				}
			}),
		})
		didUpdateDatabase = true

		for (const movedBlob of movedBlobs) {
			const deleted = await deletePublicBlobObjectBestEffort(movedBlob.oldBlobUrl || movedBlob.oldPathname)
			if (!deleted) cleanupWarnings.push(`Old Blob cleanup failed or was skipped for ${movedBlob.oldPathname}.`)
		}

		resetCatalogCache()
		const finalImpact: ProductSlugRenameImpact = {
			...renameImpact,
			warnings: [...renameImpact.warnings, ...cleanupWarnings],
		}
		await writeAdminAuditLog({
			actor: input.actor,
			action: "product.slug_rename",
			status: "success",
			entityType: "product",
			entityKey: finalImpact.newProductKey,
			summary: `Renamed product slug "${finalImpact.oldProductKey}" to "${finalImpact.newProductKey}"`,
			before: productSnapshot({
				categorySlug: finalImpact.categorySlug,
				productSlug: finalImpact.oldProductSlug,
				productKey: finalImpact.oldProductKey,
			}),
			after: productSnapshot({
				categorySlug: finalImpact.categorySlug,
				productSlug: finalImpact.newProductSlug,
				productKey: finalImpact.newProductKey,
			}),
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

		const categorySlug = impact?.categorySlug ?? normalizeCategorySlug(input.categorySlug)
		const oldProductSlug = impact?.oldProductSlug ?? normalizeProductSlug(input.oldProductSlug)
		const newProductSlug = impact?.newProductSlug ?? normalizeProductSlug(input.newProductSlug)
		const oldProductKey = categorySlug && oldProductSlug ? productKeyFor(categorySlug, oldProductSlug) : undefined
		const newProductKey = categorySlug && newProductSlug ? productKeyFor(categorySlug, newProductSlug) : undefined

		await writeAdminAuditLog({
			actor: input.actor,
			action: "product.slug_rename",
			status: "failure",
			entityType: "product",
			entityKey: oldProductKey,
			summary: `Failed to rename product slug "${oldProductKey ?? input.oldProductSlug}" to "${newProductKey ?? input.newProductSlug}"`,
			before: previous ? snapshotProduct(previous) : oldProductKey ? productSnapshot({ categorySlug, productSlug: oldProductSlug, productKey: oldProductKey }) : undefined,
			after: newProductKey ? { categorySlug, productSlug: newProductSlug, productKey: newProductKey } : undefined,
			metadata: impact ? snapshotImpact(impact) : undefined,
			error,
		})
		throw error
	}
}
