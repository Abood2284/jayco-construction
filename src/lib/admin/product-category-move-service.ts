import "server-only"

import { snapshotProduct, writeAdminAuditLog } from "@/lib/admin/audit"
import { deletePublicBlobObjectBestEffort, movePublicBlobObject } from "@/lib/blob/blob-move"
import { resetCatalogCache } from "@/lib/content/catalog"
import {
	listProductImagesFromDatabase,
	moveProductImagesToCategoryInDatabase,
} from "@/lib/mongodb/product-images"
import {
	getProductCategoryBySlugFromDatabase,
	isValidCategorySlug,
	normalizeCategorySlug,
} from "@/lib/mongodb/product-categories"
import {
	getProductByKeyFromDatabase,
	isValidProductSlug,
	moveProductToCategoryInDatabase,
	normalizeProductSlug,
	type ProductRecord,
} from "@/lib/mongodb/products"

export interface ProductCategoryMoveImpact {
	oldCategorySlug: string
	newCategorySlug: string
	productSlug: string
	sourceProductExists: boolean
	targetCategoryExists: boolean
	targetProductKeyAvailable: boolean
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
		throw new Error("Missing MONGODB_URI. Add it to .env.local or export it before moving products.")
	}
}

function productKeyFor(categorySlug: string, productSlug: string): string {
	return `${categorySlug}/${productSlug}`
}

function normalizeMoveInput(input: {
	oldCategorySlug: string
	productSlug: string
	newCategorySlug: string
}) {
	const oldCategorySlug = normalizeCategorySlug(input.oldCategorySlug)
	const newCategorySlug = normalizeCategorySlug(input.newCategorySlug)
	const productSlug = normalizeProductSlug(input.productSlug)

	if (!oldCategorySlug || !isValidCategorySlug(oldCategorySlug)) throw new Error("Invalid current category slug.")
	if (!newCategorySlug || !isValidCategorySlug(newCategorySlug)) throw new Error("Invalid target category slug.")
	if (!productSlug || !isValidProductSlug(productSlug)) throw new Error("Invalid product slug.")
	if (oldCategorySlug === newCategorySlug) throw new Error("Target category must be different from the current category.")

	return { oldCategorySlug, newCategorySlug, productSlug }
}

function newBlobPathnameFor(input: {
	oldPathname?: string
	oldCategorySlug: string
	newCategorySlug: string
	productSlug: string
}): string | undefined {
	const normalizedPathname = input.oldPathname?.trim().replace(/^\/+/, "")
	if (!normalizedPathname) return undefined
	const oldPrefix = `products/${input.oldCategorySlug}/${input.productSlug}/`
	if (!normalizedPathname.startsWith(oldPrefix)) return undefined
	return `products/${input.newCategorySlug}/${input.productSlug}/${normalizedPathname.slice(oldPrefix.length)}`
}

function buildWarnings(input: {
	oldCategorySlug: string
	newCategorySlug: string
	productSlug: string
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

function snapshotImpact(impact: ProductCategoryMoveImpact) {
	return {
		oldCategorySlug: impact.oldCategorySlug,
		newCategorySlug: impact.newCategorySlug,
		productSlug: impact.productSlug,
		sourceProductExists: impact.sourceProductExists,
		targetCategoryExists: impact.targetCategoryExists,
		targetProductKeyAvailable: impact.targetProductKeyAvailable,
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

export async function previewProductCategoryMove(input: {
	oldCategorySlug: string
	productSlug: string
	newCategorySlug: string
}): Promise<ProductCategoryMoveImpact> {
	assertMongoConfigured()

	const { oldCategorySlug, newCategorySlug, productSlug } = normalizeMoveInput(input)
	const oldProductKey = productKeyFor(oldCategorySlug, productSlug)
	const newProductKey = productKeyFor(newCategorySlug, productSlug)
	const [sourceProduct, targetCategory, targetProduct, images] = await Promise.all([
		getProductByKeyFromDatabase(oldCategorySlug, productSlug),
		getProductCategoryBySlugFromDatabase(newCategorySlug),
		getProductByKeyFromDatabase(newCategorySlug, productSlug),
		listProductImagesFromDatabase(oldCategorySlug, productSlug),
	])
	const affectedImages = images.map((image) => ({
		id: String(image._id ?? ""),
		fileName: image.fileName,
		oldProductKey,
		newProductKey,
		oldBlobPathname: image.blobPathname,
		newBlobPathname: newBlobPathnameFor({
			oldPathname: image.blobPathname,
			oldCategorySlug,
			newCategorySlug,
			productSlug,
		}),
		oldBlobUrl: image.blobUrl,
	}))
	const affectedRedirects = [
		{
			source: `/products/${oldCategorySlug}/${productSlug}`,
			destination: `/products/${newCategorySlug}/${productSlug}`,
		},
	]
	const imagesWithUnmappedBlobPaths = affectedImages.filter((image) => image.oldBlobPathname && !image.newBlobPathname).length

	return {
		oldCategorySlug,
		newCategorySlug,
		productSlug,
		sourceProductExists: Boolean(sourceProduct),
		targetCategoryExists: Boolean(targetCategory),
		targetProductKeyAvailable: !targetProduct,
		oldProductKey,
		newProductKey,
		affectedImages,
		affectedRedirects,
		warnings: buildWarnings({
			oldCategorySlug,
			newCategorySlug,
			productSlug,
			imagesWithUnmappedBlobPaths,
		}),
	}
}

export async function executeProductCategoryMove(input: {
	oldCategorySlug: string
	productSlug: string
	newCategorySlug: string
	actor?: Actor | null
}): Promise<ProductCategoryMoveImpact> {
	let impact: ProductCategoryMoveImpact | null = null
	let previous: ProductRecord | null = null
	const movedBlobs: MovedBlob[] = []
	const cleanupWarnings: string[] = []
	let didUpdateDatabase = false

	try {
		impact = await previewProductCategoryMove(input)
		if (!impact.sourceProductExists) throw new Error(`Product "${impact.oldProductKey}" was not found.`)
		if (!impact.targetCategoryExists) throw new Error(`Category "${impact.newCategorySlug}" was not found.`)
		if (!impact.targetProductKeyAvailable) throw new Error(`Product key "${impact.newProductKey}" is not available.`)

		previous = await getProductByKeyFromDatabase(impact.oldCategorySlug, impact.productSlug)
		const moveImpact = impact

		for (const image of moveImpact.affectedImages) {
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

		await moveProductToCategoryInDatabase({
			oldCategorySlug: moveImpact.oldCategorySlug,
			productSlug: moveImpact.productSlug,
			newCategorySlug: moveImpact.newCategorySlug,
		})
		await moveProductImagesToCategoryInDatabase({
			oldCategorySlug: moveImpact.oldCategorySlug,
			productSlug: moveImpact.productSlug,
			newCategorySlug: moveImpact.newCategorySlug,
			imagePathUpdates: moveImpact.affectedImages.map((image) => {
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
		const finalImpact: ProductCategoryMoveImpact = {
			...moveImpact,
			warnings: [...moveImpact.warnings, ...cleanupWarnings],
		}
		await writeAdminAuditLog({
			actor: input.actor,
			action: "product.category_move",
			status: "success",
			entityType: "product",
			entityKey: finalImpact.newProductKey,
			summary: `Moved product "${finalImpact.oldProductKey}" to "${finalImpact.newProductKey}"`,
			before: productSnapshot({
				categorySlug: finalImpact.oldCategorySlug,
				productSlug: finalImpact.productSlug,
				productKey: finalImpact.oldProductKey,
			}),
			after: productSnapshot({
				categorySlug: finalImpact.newCategorySlug,
				productSlug: finalImpact.productSlug,
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

		const oldCategorySlug = impact?.oldCategorySlug ?? normalizeCategorySlug(input.oldCategorySlug)
		const newCategorySlug = impact?.newCategorySlug ?? normalizeCategorySlug(input.newCategorySlug)
		const productSlug = impact?.productSlug ?? normalizeProductSlug(input.productSlug)
		const oldProductKey = oldCategorySlug && productSlug ? productKeyFor(oldCategorySlug, productSlug) : undefined
		const newProductKey = newCategorySlug && productSlug ? productKeyFor(newCategorySlug, productSlug) : undefined

		await writeAdminAuditLog({
			actor: input.actor,
			action: "product.category_move",
			status: "failure",
			entityType: "product",
			entityKey: oldProductKey,
			summary: `Failed to move product "${oldProductKey ?? input.productSlug}" to category "${newCategorySlug || input.newCategorySlug}"`,
			before: previous ? snapshotProduct(previous) : oldProductKey ? productSnapshot({ categorySlug: oldCategorySlug, productSlug, productKey: oldProductKey }) : undefined,
			after: newProductKey ? { categorySlug: newCategorySlug, productSlug, productKey: newProductKey } : undefined,
			metadata: impact ? snapshotImpact(impact) : undefined,
			error,
		})
		throw error
	}
}
