import { getMongoClient } from "@/lib/mongodb/client"
import { getMongoEnv } from "@/lib/mongodb/env"

export type ProductCategoryStatus = "draft" | "published" | "archived"

export interface ProductCategoryRecord {
	_id?: unknown
	slug: string
	name: string
	intro?: string
	seoCopy?: string
	order?: number
	status: ProductCategoryStatus
	createdAt: Date
	updatedAt: Date
}

type ProductCategoryDocument = Partial<ProductCategoryRecord>

const PRODUCT_CATEGORIES_COLLECTION = "product_categories"
const CATEGORY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const VALID_CATEGORY_STATUSES: ProductCategoryStatus[] = ["draft", "published", "archived"]

export function normalizeCategorySlug(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(/[_\s]+/g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
}

export function isValidCategorySlug(slug: string): boolean {
	return CATEGORY_SLUG_PATTERN.test(slug)
}

export function isProductCategoryStatus(value: unknown): value is ProductCategoryStatus {
	return typeof value === "string" && VALID_CATEGORY_STATUSES.includes(value as ProductCategoryStatus)
}

function normalizeString(value: unknown): string {
	return typeof value === "string" ? value.trim() : ""
}

function normalizeDate(value: unknown): Date {
	return value instanceof Date ? value : new Date(0)
}

function normalizeOptionalString(value: unknown): string | undefined {
	const normalized = normalizeString(value)
	return normalized || undefined
}

function normalizeOptionalNumber(value: unknown): number | undefined {
	return typeof value === "number" && Number.isFinite(value) ? value : undefined
}

function normalizeProductCategoryDocument(doc: ProductCategoryDocument): ProductCategoryRecord | null {
	const slug = normalizeCategorySlug(normalizeString(doc.slug))
	const name = normalizeString(doc.name)
	const status = isProductCategoryStatus(doc.status) ? doc.status : null

	if (!slug || !isValidCategorySlug(slug) || !name || !status) return null

	const category: ProductCategoryRecord = {
		slug,
		name,
		...(normalizeOptionalString(doc.intro) ? { intro: normalizeOptionalString(doc.intro) } : {}),
		...(normalizeOptionalString(doc.seoCopy) ? { seoCopy: normalizeOptionalString(doc.seoCopy) } : {}),
		...(normalizeOptionalNumber(doc.order) !== undefined ? { order: normalizeOptionalNumber(doc.order) } : {}),
		status,
		createdAt: normalizeDate(doc.createdAt),
		updatedAt: normalizeDate(doc.updatedAt),
	}

	if (doc._id !== undefined) category._id = doc._id

	return category
}

async function getProductCategoriesCollection() {
	const { dbName } = getMongoEnv()
	const client = await getMongoClient()
	return client.db(dbName).collection<ProductCategoryDocument>(PRODUCT_CATEGORIES_COLLECTION)
}

async function ensureProductCategoryIndexes() {
	const collection = await getProductCategoriesCollection()
	await collection.createIndex({ slug: 1 }, { unique: true, name: "product_categories_slug_unique" })
	await collection.createIndex(
		{ status: 1, order: 1, name: 1 },
		{ name: "product_categories_status_order_name" },
	)
	return collection
}

function assertWritableMongoConfigured() {
	if (!process.env.MONGODB_URI?.trim()) {
		throw new Error("Missing MONGODB_URI. Add it to .env.local or export it before managing categories.")
	}
}

function buildCategoryFilter(options?: { includeDrafts?: boolean; includeArchived?: boolean }) {
	const statuses: ProductCategoryStatus[] = ["published"]
	if (options?.includeDrafts) statuses.push("draft")
	if (options?.includeArchived) statuses.push("archived")
	return { status: { $in: statuses } }
}

function sortProductCategoryRecords(categories: ProductCategoryRecord[]): ProductCategoryRecord[] {
	return [...categories].sort((a, b) => {
		const aOrder = a.order ?? Number.POSITIVE_INFINITY
		const bOrder = b.order ?? Number.POSITIVE_INFINITY
		if (aOrder !== bOrder) return aOrder - bOrder
		return a.name.localeCompare(b.name)
	})
}

export async function listProductCategoriesFromDatabase(options?: {
	includeDrafts?: boolean
	includeArchived?: boolean
}): Promise<ProductCategoryRecord[]> {
	if (!process.env.MONGODB_URI?.trim()) return []

	try {
		const collection = await getProductCategoriesCollection()
		const docs = await collection
			.find(buildCategoryFilter(options), {
				projection: {
					_id: 1,
					slug: 1,
					name: 1,
					intro: 1,
					seoCopy: 1,
					order: 1,
					status: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			})
			.sort({ order: 1, name: 1 })
			.toArray()

		return sortProductCategoryRecords(
			docs
				.map(normalizeProductCategoryDocument)
				.filter((category): category is ProductCategoryRecord => Boolean(category)),
		)
	} catch {
		return []
	}
}

export async function getProductCategoryBySlugFromDatabase(slug: string): Promise<ProductCategoryRecord | null> {
	if (!process.env.MONGODB_URI?.trim()) return null

	const normalizedSlug = normalizeCategorySlug(slug)
	if (!normalizedSlug || !isValidCategorySlug(normalizedSlug)) return null

	try {
		const collection = await getProductCategoriesCollection()
		const doc = await collection.findOne(
			{ slug: normalizedSlug },
			{
				projection: {
					_id: 1,
					slug: 1,
					name: 1,
					intro: 1,
					seoCopy: 1,
					order: 1,
					status: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		)
		return doc ? normalizeProductCategoryDocument(doc) : null
	} catch {
		return null
	}
}

export async function createProductCategoryInDatabase(input: {
	slug: string
	name: string
	intro?: string
	seoCopy?: string
	order?: number
	status?: ProductCategoryStatus
}): Promise<ProductCategoryRecord> {
	assertWritableMongoConfigured()

	const slug = normalizeCategorySlug(input.slug)
	const name = input.name.trim()
	const status = input.status ?? "draft"

	if (!slug || !isValidCategorySlug(slug)) throw new Error("Invalid category slug.")
	if (!name) throw new Error("Category name is required.")
	if (!isProductCategoryStatus(status)) throw new Error("Invalid category status.")

	const now = new Date()
	const category: ProductCategoryRecord = {
		slug,
		name,
		...(input.intro?.trim() ? { intro: input.intro.trim() } : {}),
		...(input.seoCopy?.trim() ? { seoCopy: input.seoCopy.trim() } : {}),
		...(typeof input.order === "number" && Number.isFinite(input.order) ? { order: input.order } : {}),
		status,
		createdAt: now,
		updatedAt: now,
	}

	const collection = await ensureProductCategoryIndexes()
	await collection.insertOne({
		slug: category.slug,
		name: category.name,
		...(category.intro ? { intro: category.intro } : {}),
		...(category.seoCopy ? { seoCopy: category.seoCopy } : {}),
		...(category.order !== undefined ? { order: category.order } : {}),
		status: category.status,
		createdAt: category.createdAt,
		updatedAt: category.updatedAt,
	})

	return category
}

export async function updateProductCategoryInDatabase(
	slug: string,
	patch: {
		name?: string
		intro?: string
		seoCopy?: string
		order?: number
		status?: ProductCategoryStatus
	},
): Promise<ProductCategoryRecord | null> {
	assertWritableMongoConfigured()

	const normalizedSlug = normalizeCategorySlug(slug)
	if (!normalizedSlug || !isValidCategorySlug(normalizedSlug)) throw new Error("Invalid category slug.")

	const set: ProductCategoryDocument = { updatedAt: new Date() }
	const unset: Record<string, ""> = {}

	if (patch.name !== undefined) {
		const name = patch.name.trim()
		if (!name) throw new Error("Category name is required.")
		set.name = name
	}
	if (patch.intro !== undefined) {
		const intro = patch.intro.trim()
		if (intro) set.intro = intro
		else unset.intro = ""
	}
	if (patch.seoCopy !== undefined) {
		const seoCopy = patch.seoCopy.trim()
		if (seoCopy) set.seoCopy = seoCopy
		else unset.seoCopy = ""
	}
	if (patch.order !== undefined) {
		if (!Number.isFinite(patch.order)) throw new Error("Category order must be a valid number.")
		set.order = patch.order
	}
	if (patch.status !== undefined) {
		if (!isProductCategoryStatus(patch.status)) throw new Error("Invalid category status.")
		set.status = patch.status
	}

	const collection = await ensureProductCategoryIndexes()
	const update = Object.keys(unset).length > 0 ? { $set: set, $unset: unset } : { $set: set }
	const result = await collection.findOneAndUpdate(
		{ slug: normalizedSlug },
		update,
		{
			returnDocument: "after",
			projection: {
				_id: 1,
				slug: 1,
				name: 1,
				intro: 1,
				seoCopy: 1,
				order: 1,
				status: 1,
				createdAt: 1,
				updatedAt: 1,
			},
		},
	)

	return result ? normalizeProductCategoryDocument(result) : null
}
