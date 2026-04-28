"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireAdminUser } from "@/lib/admin/auth"
import {
	snapshotProduct,
	writeAdminAuditLog,
} from "@/lib/admin/audit"
import {
	executeProductCategoryMove,
	previewProductCategoryMove,
	type ProductCategoryMoveImpact,
} from "@/lib/admin/product-category-move-service"
import {
	executeProductSlugRename,
	previewProductSlugRename,
	type ProductSlugRenameImpact,
} from "@/lib/admin/product-rename-service"
import type { ProductSpec } from "@/lib/cms/types"
import { loadCategories, resetCatalogCache } from "@/lib/content/catalog"
import {
	getProductCategoryBySlugFromDatabase,
	normalizeCategorySlug,
} from "@/lib/mongodb/product-categories"
import {
	createProductInDatabase,
	getProductByKeyFromDatabase,
	isProductStatus,
	isValidProductSlug,
	normalizeProductSlug,
	updateProductInDatabase,
	type ProductRecord,
	type ProductStatus,
} from "@/lib/mongodb/products"

function parseLines(value: FormDataEntryValue | null): string[] {
	return String(value ?? "")
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
}

function parseSpecRows(value: FormDataEntryValue | null): ProductSpec[] {
	return String(value ?? "")
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [label, ...rest] = line.split(":")
			return {
				label: label?.trim() ?? "",
				value: rest.join(":").trim(),
			}
		})
		.filter((row) => row.label && row.value)
}

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

function getStatus(formData: FormData): ProductStatus {
	const status = getOptionalString(formData, "status") ?? "draft"
	if (!isProductStatus(status)) throw new Error("Invalid product status.")
	return status
}

async function assertCategoryExists(categorySlug: string) {
	const normalizedCategorySlug = normalizeCategorySlug(categorySlug)
	const [dbCategory, fallbackCategories] = await Promise.all([
		getProductCategoryBySlugFromDatabase(normalizedCategorySlug),
		loadCategories(),
	])

	if (dbCategory || fallbackCategories.some((category) => category.slug === normalizedCategorySlug)) return

	throw new Error("Select an existing category.")
}

function getFriendlyProductError(error: unknown): string {
	if (error && typeof error === "object") {
		const code = "code" in error ? String(error.code ?? "") : ""
		if (code === "11000") return "A product with this category and slug already exists."

		const message = "message" in error ? String(error.message ?? "") : ""
		if (message.includes("Missing MONGODB_URI")) return message
		if (message.includes("Invalid category slug")) return "Select an existing category."
		if (message.includes("Invalid product slug")) return "Enter a valid slug using lowercase letters, numbers, and hyphens."
		if (message.includes("Product title is required") || message.includes("title is required")) return "Product title is required."
		if (message.includes("Product description is required") || message.includes("description is required")) {
			return "Product description is required."
		}
		if (message.includes("Invalid product status")) return message
		if (message.includes("Select an existing category")) return message
		if (message.includes("Product was not found")) return message
		if (message.includes("Target category")) return message
		if (message.includes("New product slug")) return message
		if (message.includes("new product slug")) return message
		if (message.includes("not available")) return message
		if (message.includes("Missing BLOB_READ_WRITE_TOKEN")) return message
		if (message.includes("Blob")) return message
	}

	return "Could not save the product. Check the server logs and try again."
}

function redirectWithError(path: string, error: unknown): never {
	const separator = path.includes("?") ? "&" : "?"
	redirect(`${path}${separator}error=${encodeURIComponent(getFriendlyProductError(error))}`)
}

function revalidateProductPaths(categorySlug: string, productSlug: string) {
	resetCatalogCache()
	revalidatePath("/admin/catalog/products")
	revalidatePath("/admin/catalog")
	revalidatePath("/products")
	revalidatePath(`/products/${categorySlug}`)
	revalidatePath(`/products/${categorySlug}/${productSlug}`)
}

function revalidateProductRenamePaths(categorySlug: string, oldProductSlug: string, newProductSlug: string) {
	resetCatalogCache()
	revalidatePath("/admin/catalog/products")
	revalidatePath(`/admin/catalog/products/${categorySlug}/${oldProductSlug}`)
	revalidatePath(`/admin/catalog/products/${categorySlug}/${newProductSlug}`)
	revalidatePath("/admin/catalog/media")
	revalidatePath("/products")
	revalidatePath(`/products/${categorySlug}`)
	revalidatePath(`/products/${categorySlug}/${oldProductSlug}`)
	revalidatePath(`/products/${categorySlug}/${newProductSlug}`)
}

function revalidateProductCategoryMovePaths(oldCategorySlug: string, productSlug: string, newCategorySlug: string) {
	resetCatalogCache()
	revalidatePath("/admin/catalog/products")
	revalidatePath(`/admin/catalog/products/${oldCategorySlug}/${productSlug}`)
	revalidatePath(`/admin/catalog/products/${newCategorySlug}/${productSlug}`)
	revalidatePath(`/admin/catalog/categories/${oldCategorySlug}`)
	revalidatePath(`/admin/catalog/categories/${newCategorySlug}`)
	revalidatePath("/admin/catalog/media")
	revalidatePath("/products")
	revalidatePath(`/products/${oldCategorySlug}`)
	revalidatePath(`/products/${newCategorySlug}`)
	revalidatePath(`/products/${oldCategorySlug}/${productSlug}`)
	revalidatePath(`/products/${newCategorySlug}/${productSlug}`)
}

function getProductFormPatch(formData: FormData) {
	const seoTitle = getOptionalString(formData, "seoTitle")
	const seoDescription = getOptionalString(formData, "seoDescription")

	return {
		title: getRequiredString(formData, "title"),
		shortTitle: getOptionalString(formData, "shortTitle"),
		description: getRequiredString(formData, "description"),
		excerpt: getOptionalString(formData, "excerpt"),
		applications: parseLines(formData.get("applications")),
		features: parseLines(formData.get("features")),
		specs: parseSpecRows(formData.get("specs")),
		additionalInfo: parseSpecRows(formData.get("additionalInfo")),
		complianceNotes: parseLines(formData.get("complianceNotes")),
		ctaLabel: getOptionalString(formData, "ctaLabel"),
		seo: {
			...(seoTitle ? { title: seoTitle } : {}),
			...(seoDescription ? { description: seoDescription } : {}),
		},
		status: getStatus(formData),
	}
}

export async function createProductAction(formData: FormData): Promise<void> {
	const actor = await requireAdminUser()

	try {
		const title = getRequiredString(formData, "title")
		const categorySlug = normalizeCategorySlug(getRequiredString(formData, "categorySlug"))
		const productSlug = normalizeProductSlug(getOptionalString(formData, "productSlug") ?? title)
		if (!productSlug || !isValidProductSlug(productSlug)) throw new Error("Invalid product slug.")

		await assertCategoryExists(categorySlug)
		const patch = getProductFormPatch(formData)

		const created = await createProductInDatabase({
			categorySlug,
			productSlug,
			...patch,
		})

		await writeAdminAuditLog({
			actor,
			action: "product.create",
			status: "success",
			entityType: "product",
			entityKey: created.productKey,
			summary: `Created product "${created.title}"`,
			after: snapshotProduct(created),
		})
		revalidateProductPaths(categorySlug, productSlug)
	} catch (error) {
		const title = getOptionalString(formData, "title")
		const categorySlug = normalizeCategorySlug(String(formData.get("categorySlug") ?? ""))
		const productSlug = normalizeProductSlug(getOptionalString(formData, "productSlug") ?? title ?? "")
		await writeAdminAuditLog({
			actor,
			action: "product.create",
			status: "failure",
			entityType: "product",
			entityKey: categorySlug && productSlug ? `${categorySlug}/${productSlug}` : undefined,
			summary: title ? `Failed to create product "${title}"` : "Failed to create product",
			metadata: {
				categorySlug: categorySlug || undefined,
				productSlug: productSlug || undefined,
				title,
			},
			error,
		})
		redirectWithError("/admin/catalog/products/new", error)
	}

	redirect("/admin/catalog/products")
}

export async function updateProductAction(
	categorySlug: string,
	productSlug: string,
	formData: FormData,
): Promise<void> {
	const actor = await requireAdminUser()

	const normalizedCategorySlug = normalizeCategorySlug(categorySlug)
	const normalizedProductSlug = normalizeProductSlug(productSlug)
	let previous: ProductRecord | null = null

	try {
		previous = await getProductByKeyFromDatabase(normalizedCategorySlug, normalizedProductSlug)
		const updated = await updateProductInDatabase(normalizedCategorySlug, normalizedProductSlug, getProductFormPatch(formData))
		if (!updated) throw new Error("Product was not found.")

		await writeAdminAuditLog({
			actor,
			action: "product.update",
			status: "success",
			entityType: "product",
			entityKey: updated.productKey,
			summary: `Updated product "${updated.title}"`,
			before: snapshotProduct(previous),
			after: snapshotProduct(updated),
		})
		revalidateProductPaths(normalizedCategorySlug, normalizedProductSlug)
	} catch (error) {
		await writeAdminAuditLog({
			actor,
			action: "product.update",
			status: "failure",
			entityType: "product",
			entityKey: `${normalizedCategorySlug}/${normalizedProductSlug}`,
			summary: `Failed to update product "${normalizedCategorySlug}/${normalizedProductSlug}"`,
			before: snapshotProduct(previous),
			error,
		})
		redirectWithError(`/admin/catalog/products/${normalizedCategorySlug}/${normalizedProductSlug}`, error)
	}

	redirect("/admin/catalog/products")
}

export async function previewProductSlugRenameAction(
	formData: FormData,
): Promise<ProductSlugRenameImpact> {
	await requireAdminUser()

	return previewProductSlugRename({
		categorySlug: getRequiredString(formData, "categorySlug"),
		oldProductSlug: getRequiredString(formData, "oldProductSlug"),
		newProductSlug: getRequiredString(formData, "newProductSlug"),
	})
}

export async function executeProductSlugRenameAction(formData: FormData): Promise<void> {
	const actor = await requireAdminUser()
	const categorySlug = normalizeCategorySlug(getRequiredString(formData, "categorySlug"))
	const oldProductSlug = normalizeProductSlug(getRequiredString(formData, "oldProductSlug"))
	const newProductSlug = normalizeProductSlug(getRequiredString(formData, "newProductSlug"))
	const confirmOldProductSlug = getRequiredString(formData, "confirmOldProductSlug")

	try {
		if (confirmOldProductSlug !== oldProductSlug) {
			throw new Error(`To confirm this rename, type "${oldProductSlug}" exactly.`)
		}

		await executeProductSlugRename({
			categorySlug,
			oldProductSlug,
			newProductSlug,
			actor,
		})
		revalidateProductRenamePaths(categorySlug, oldProductSlug, newProductSlug)
	} catch (error) {
		redirectWithError(
			`/admin/catalog/products/${categorySlug}/${oldProductSlug}/rename?newSlug=${encodeURIComponent(newProductSlug)}`,
			error,
		)
	}

	redirect(`/admin/catalog/products/${categorySlug}/${newProductSlug}?renamed=1`)
}

export async function previewProductCategoryMoveAction(
	formData: FormData,
): Promise<ProductCategoryMoveImpact> {
	await requireAdminUser()

	return previewProductCategoryMove({
		oldCategorySlug: getRequiredString(formData, "oldCategorySlug"),
		productSlug: getRequiredString(formData, "productSlug"),
		newCategorySlug: getRequiredString(formData, "newCategorySlug"),
	})
}

export async function executeProductCategoryMoveAction(formData: FormData): Promise<void> {
	const actor = await requireAdminUser()
	const oldCategorySlug = normalizeCategorySlug(getRequiredString(formData, "oldCategorySlug"))
	const newCategorySlug = normalizeCategorySlug(getRequiredString(formData, "newCategorySlug"))
	const productSlug = normalizeProductSlug(getRequiredString(formData, "productSlug"))
	const confirmProductKey = getRequiredString(formData, "confirmProductKey")
	const oldProductKey = `${oldCategorySlug}/${productSlug}`

	try {
		if (confirmProductKey !== oldProductKey) {
			throw new Error(`To confirm this move, type "${oldProductKey}" exactly.`)
		}

		await executeProductCategoryMove({
			oldCategorySlug,
			productSlug,
			newCategorySlug,
			actor,
		})
		revalidateProductCategoryMovePaths(oldCategorySlug, productSlug, newCategorySlug)
	} catch (error) {
		redirectWithError(
			`/admin/catalog/products/${oldCategorySlug}/${productSlug}/move?newCategorySlug=${encodeURIComponent(newCategorySlug)}`,
			error,
		)
	}

	redirect(`/admin/catalog/products/${newCategorySlug}/${productSlug}?moved=1`)
}
