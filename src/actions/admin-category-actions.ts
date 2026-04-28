"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireAdminUser } from "@/lib/admin/auth"
import {
	snapshotCategory,
	writeAdminAuditLog,
} from "@/lib/admin/audit"
import {
	executeCategorySlugRename,
	previewCategorySlugRename,
	type CategoryRenameImpact,
} from "@/lib/admin/category-rename-service"
import { resetCatalogCache } from "@/lib/content/catalog"
import {
	createProductCategoryInDatabase,
	getProductCategoryBySlugFromDatabase,
	isProductCategoryStatus,
	isValidCategorySlug,
	normalizeCategorySlug,
	updateProductCategoryInDatabase,
	type ProductCategoryRecord,
	type ProductCategoryStatus,
} from "@/lib/mongodb/product-categories"

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

function getOptionalNumber(formData: FormData, key: string): number | undefined {
	const value = getOptionalString(formData, key)
	if (!value) return undefined

	const parsed = Number(value)
	if (!Number.isFinite(parsed)) throw new Error("Order must be a valid number.")
	return parsed
}

function getStatus(formData: FormData): ProductCategoryStatus {
	const status = getOptionalString(formData, "status") ?? "draft"
	if (!isProductCategoryStatus(status)) throw new Error("Invalid category status.")
	return status
}

function getFriendlyCategoryError(error: unknown): string {
	if (error && typeof error === "object") {
		const code = "code" in error ? String(error.code ?? "") : ""
		if (code === "11000") return "A category with this slug already exists."

		const message = "message" in error ? String(error.message ?? "") : ""
		if (message.includes("Missing MONGODB_URI")) return message
		if (message.includes("Invalid category slug")) return "Enter a valid slug using lowercase letters, numbers, and hyphens."
		if (message.includes("Category name is required") || message.includes("name is required")) return "Category name is required."
		if (message.includes("Order must be")) return message
		if (message.includes("Invalid category status")) return message
		if (message.includes("New category slug")) return message
		if (message.includes("new slug")) return message
		if (message.includes("not available")) return message
		if (message.includes("not found")) return message
		if (message.includes("Missing BLOB_READ_WRITE_TOKEN")) return message
		if (message.includes("Blob")) return message
	}

	return "Could not save the category. Check the server logs and try again."
}

function redirectWithError(path: string, error: unknown): never {
	const separator = path.includes("?") ? "&" : "?"
	redirect(`${path}${separator}error=${encodeURIComponent(getFriendlyCategoryError(error))}`)
}

function revalidateCategoryPaths(slug?: string) {
	resetCatalogCache()
	revalidatePath("/admin/catalog/categories")
	revalidatePath("/admin/catalog")
	revalidatePath("/products")
	if (slug) revalidatePath(`/products/${slug}`)
}

function revalidateCategoryRenamePaths(oldSlug: string, newSlug: string) {
	resetCatalogCache()
	revalidatePath("/admin/catalog/categories")
	revalidatePath(`/admin/catalog/categories/${oldSlug}`)
	revalidatePath(`/admin/catalog/categories/${newSlug}`)
	revalidatePath("/admin/catalog/products")
	revalidatePath("/admin/catalog/media")
	revalidatePath("/products")
	revalidatePath(`/products/${oldSlug}`)
	revalidatePath(`/products/${newSlug}`)
}

export async function createCategoryAction(formData: FormData) {
	const actor = await requireAdminUser()

	try {
		const name = getRequiredString(formData, "name")
		const slug = normalizeCategorySlug(getOptionalString(formData, "slug") ?? name)
		if (!slug || !isValidCategorySlug(slug)) {
			throw new Error("Invalid category slug.")
		}

		const created = await createProductCategoryInDatabase({
			name,
			slug,
			intro: getOptionalString(formData, "intro"),
			seoCopy: getOptionalString(formData, "seoCopy"),
			order: getOptionalNumber(formData, "order"),
			status: getStatus(formData),
		})

		await writeAdminAuditLog({
			actor,
			action: "category.create",
			status: "success",
			entityType: "category",
			entityKey: created.slug,
			summary: `Created category "${created.name}"`,
			after: snapshotCategory(created),
		})
		revalidateCategoryPaths(slug)
	} catch (error) {
		const name = getOptionalString(formData, "name")
		const slug = normalizeCategorySlug(getOptionalString(formData, "slug") ?? name ?? "")
		await writeAdminAuditLog({
			actor,
			action: "category.create",
			status: "failure",
			entityType: "category",
			entityKey: slug || undefined,
			summary: name ? `Failed to create category "${name}"` : "Failed to create category",
			metadata: {
				slug: slug || undefined,
				name,
			},
			error,
		})
		redirectWithError("/admin/catalog/categories/new", error)
	}

	redirect("/admin/catalog/categories")
}

export async function updateCategoryAction(formData: FormData) {
	const actor = await requireAdminUser()

	let slug = ""
	let previous: ProductCategoryRecord | null = null
	try {
		slug = normalizeCategorySlug(getRequiredString(formData, "slug"))
		if (!slug || !isValidCategorySlug(slug)) {
			throw new Error("Invalid category slug.")
		}

		previous = await getProductCategoryBySlugFromDatabase(slug)
		const updated = await updateProductCategoryInDatabase(slug, {
			name: getRequiredString(formData, "name"),
			intro: getOptionalString(formData, "intro"),
			seoCopy: getOptionalString(formData, "seoCopy"),
			order: getOptionalNumber(formData, "order"),
			status: getStatus(formData),
		})

		if (!updated) {
			throw new Error("Category was not found.")
		}

		await writeAdminAuditLog({
			actor,
			action: "category.update",
			status: "success",
			entityType: "category",
			entityKey: slug,
			summary: `Updated category "${updated.name}"`,
			before: snapshotCategory(previous),
			after: snapshotCategory(updated),
		})
		revalidateCategoryPaths(slug)
	} catch (error) {
		const fallbackSlug = normalizeCategorySlug(String(formData.get("slug") ?? ""))
		await writeAdminAuditLog({
			actor,
			action: "category.update",
			status: "failure",
			entityType: "category",
			entityKey: slug || fallbackSlug || undefined,
			summary: fallbackSlug ? `Failed to update category "${fallbackSlug}"` : "Failed to update category",
			before: snapshotCategory(previous),
			metadata: {
				slug: slug || fallbackSlug || undefined,
			},
			error,
		})
		redirectWithError(fallbackSlug ? `/admin/catalog/categories/${fallbackSlug}` : "/admin/catalog/categories", error)
	}
	redirect("/admin/catalog/categories")
}

export async function previewCategorySlugRenameAction(
	formData: FormData,
): Promise<CategoryRenameImpact> {
	await requireAdminUser()

	return previewCategorySlugRename({
		oldSlug: getRequiredString(formData, "oldSlug"),
		newSlug: getRequiredString(formData, "newSlug"),
	})
}

export async function executeCategorySlugRenameAction(formData: FormData): Promise<void> {
	const actor = await requireAdminUser()
	const oldSlug = normalizeCategorySlug(getRequiredString(formData, "oldSlug"))
	const newSlug = normalizeCategorySlug(getRequiredString(formData, "newSlug"))
	const confirmOldSlug = normalizeCategorySlug(getRequiredString(formData, "confirmOldSlug"))

	try {
		if (confirmOldSlug !== oldSlug) {
			throw new Error(`To confirm this rename, type "${oldSlug}" exactly.`)
		}

		await executeCategorySlugRename({
			oldSlug,
			newSlug,
			actor,
		})
		revalidateCategoryRenamePaths(oldSlug, newSlug)
	} catch (error) {
		redirectWithError(`/admin/catalog/categories/${oldSlug}/rename?newSlug=${encodeURIComponent(newSlug)}`, error)
	}

	redirect(`/admin/catalog/categories/${newSlug}?renamed=1`)
}
