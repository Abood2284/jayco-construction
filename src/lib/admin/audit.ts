import "server-only"

import {
	createAdminAuditLog,
	type AdminAuditAction,
	type AdminAuditEntityType,
} from "@/lib/mongodb/admin-audit-logs"
import type { ProductCategoryRecord } from "@/lib/mongodb/product-categories"
import type { ProductImageRecord } from "@/lib/mongodb/product-images"
import type { ProductRecord } from "@/lib/mongodb/products"

export type { AdminAuditAction, AdminAuditEntityType }

function getErrorCode(error: unknown): string | undefined {
	if (!error || typeof error !== "object") return undefined
	const code = "code" in error ? String(error.code ?? "").trim() : ""
	if (code) return code
	const name = "name" in error ? String(error.name ?? "").trim() : ""
	return name || undefined
}

function getErrorMessage(error: unknown): string | undefined {
	if (!error) return undefined
	if (typeof error === "string") return error
	if (error && typeof error === "object" && "message" in error) {
		const message = String(error.message ?? "").trim()
		return message || undefined
	}
	return "Unknown error"
}

function warnAuditFailure(error: unknown) {
	if (process.env.NODE_ENV !== "production") {
		console.warn("Admin audit log write failed.", error)
	}
}

export async function writeAdminAuditLog(input: {
	actor?: {
		email?: string
		name?: string
	} | null
	action: AdminAuditAction
	status: "success" | "failure"
	entityType: AdminAuditEntityType
	entityId?: string
	entityKey?: string
	summary: string
	before?: unknown
	after?: unknown
	metadata?: Record<string, unknown>
	error?: unknown
}): Promise<void> {
	try {
		await createAdminAuditLog({
			action: input.action,
			status: input.status,
			entityType: input.entityType,
			entityId: input.entityId,
			entityKey: input.entityKey,
			actorEmail: input.actor?.email,
			actorName: input.actor?.name,
			summary: input.summary,
			before: input.before,
			after: input.after,
			metadata: input.metadata,
			errorCode: input.error ? getErrorCode(input.error) : undefined,
			errorMessage: input.error ? getErrorMessage(input.error) : undefined,
		})
	} catch (error) {
		warnAuditFailure(error)
	}
}

export function snapshotCategory(category: ProductCategoryRecord | null | undefined) {
	if (!category) return null
	return {
		slug: category.slug,
		name: category.name,
		intro: category.intro,
		seoCopy: category.seoCopy,
		order: category.order,
		status: category.status,
		updatedAt: category.updatedAt,
	}
}

export function snapshotProduct(product: ProductRecord | null | undefined) {
	if (!product) return null
	return {
		categorySlug: product.categorySlug,
		productSlug: product.productSlug,
		productKey: product.productKey,
		title: product.title,
		shortTitle: product.shortTitle,
		description: product.description,
		excerpt: product.excerpt,
		status: product.status,
		ctaLabel: product.ctaLabel,
		seo: product.seo,
		updatedAt: product.updatedAt,
	}
}

export function snapshotProductImage(image: ProductImageRecord | null | undefined) {
	if (!image) return null
	return {
		id: image._id !== undefined ? String(image._id) : undefined,
		productKey: image.productKey,
		categorySlug: image.categorySlug,
		productSlug: image.productSlug,
		blobUrl: image.blobUrl,
		blobPathname: image.blobPathname,
		fileName: image.fileName,
		role: image.role,
		sortOrder: image.sortOrder,
		alt: image.alt,
		mimeType: image.mimeType,
		sizeBytes: image.sizeBytes,
		updatedAt: image.updatedAt,
	}
}
