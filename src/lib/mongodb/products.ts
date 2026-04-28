import type { ProductSpec } from "@/lib/cms/types"
import { getMongoClient } from "@/lib/mongodb/client"
import { getMongoEnv } from "@/lib/mongodb/env"
import {
	isValidCategorySlug,
	normalizeCategorySlug,
} from "@/lib/mongodb/product-categories"

export type ProductStatus = "draft" | "published" | "archived"

export interface ProductRecord {
	_id?: unknown
	categorySlug: string
	productSlug: string
	productKey: string
	title: string
	shortTitle?: string
	description: string
	excerpt?: string
	specs?: ProductSpec[]
	applications?: string[]
	features?: string[]
	additionalInfo?: ProductSpec[]
	complianceNotes?: string[]
	ctaLabel?: string
	seo?: {
		title?: string
		description?: string
	}
	status: ProductStatus
	createdAt: Date
	updatedAt: Date
}

type ProductTombstoneReason =
	| "product_slug_rename"
	| "product_category_move"
	| "category_slug_rename"
	| "category_delete"
type ProductDocument = Partial<ProductRecord> & {
	tombstoneFor?: string
	tombstoneReason?: ProductTombstoneReason
	tombstonedAt?: Date
	tombstonedBy?: string
}

const PRODUCTS_COLLECTION = "products"
const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const VALID_PRODUCT_STATUSES: ProductStatus[] = ["draft", "published", "archived"]

export function normalizeProductSlug(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(/[_\s]+/g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
}

export function isValidProductSlug(slug: string): boolean {
	return PRODUCT_SLUG_PATTERN.test(slug)
}

export function isProductStatus(value: unknown): value is ProductStatus {
	return typeof value === "string" && VALID_PRODUCT_STATUSES.includes(value as ProductStatus)
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

function normalizeSpecRows(value: unknown): ProductSpec[] | undefined {
	if (!Array.isArray(value)) return undefined
	const rows: ProductSpec[] = []

	for (const row of value) {
		if (!row || typeof row !== "object") continue
		const label = normalizeString((row as { label?: unknown }).label)
		const specValue = normalizeString((row as { value?: unknown }).value)
		if (label && specValue) rows.push({ label, value: specValue })
	}

	return rows.length > 0 ? rows : undefined
}

function normalizeLines(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined
	const lines = value.map((line) => normalizeString(line)).filter(Boolean)
	return lines.length > 0 ? lines : undefined
}

function normalizeSeo(value: unknown): ProductRecord["seo"] | undefined {
	if (!value || typeof value !== "object") return undefined
	const title = normalizeOptionalString((value as { title?: unknown }).title)
	const description = normalizeOptionalString((value as { description?: unknown }).description)
	if (!title && !description) return undefined
	return {
		...(title ? { title } : {}),
		...(description ? { description } : {}),
	}
}

function normalizeProductDocument(doc: ProductDocument): ProductRecord | null {
	const categorySlug = normalizeCategorySlug(normalizeString(doc.categorySlug))
	const productSlug = normalizeProductSlug(normalizeString(doc.productSlug))
	const productKey = normalizeString(doc.productKey)
	const expectedProductKey = `${categorySlug}/${productSlug}`
	const title = normalizeString(doc.title)
	const description = normalizeString(doc.description)
	const status = isProductStatus(doc.status) ? doc.status : null

	if (!categorySlug || !isValidCategorySlug(categorySlug)) return null
	if (!productSlug || !isValidProductSlug(productSlug)) return null
	if (!productKey || productKey !== expectedProductKey) return null
	if (!title || !description || !status) return null

	const product: ProductRecord = {
		categorySlug,
		productSlug,
		productKey,
		title,
		...(normalizeOptionalString(doc.shortTitle) ? { shortTitle: normalizeOptionalString(doc.shortTitle) } : {}),
		description,
		...(normalizeOptionalString(doc.excerpt) ? { excerpt: normalizeOptionalString(doc.excerpt) } : {}),
		...(normalizeSpecRows(doc.specs) ? { specs: normalizeSpecRows(doc.specs) } : {}),
		...(normalizeLines(doc.applications) ? { applications: normalizeLines(doc.applications) } : {}),
		...(normalizeLines(doc.features) ? { features: normalizeLines(doc.features) } : {}),
		...(normalizeSpecRows(doc.additionalInfo) ? { additionalInfo: normalizeSpecRows(doc.additionalInfo) } : {}),
		...(normalizeLines(doc.complianceNotes) ? { complianceNotes: normalizeLines(doc.complianceNotes) } : {}),
		...(normalizeOptionalString(doc.ctaLabel) ? { ctaLabel: normalizeOptionalString(doc.ctaLabel) } : {}),
		...(normalizeSeo(doc.seo) ? { seo: normalizeSeo(doc.seo) } : {}),
		status,
		createdAt: normalizeDate(doc.createdAt),
		updatedAt: normalizeDate(doc.updatedAt),
	}

	if (doc._id !== undefined) product._id = doc._id

	return product
}

async function getProductsCollection() {
	const { dbName } = getMongoEnv()
	const client = await getMongoClient()
	return client.db(dbName).collection<ProductDocument>(PRODUCTS_COLLECTION)
}

async function ensureProductIndexes() {
	const collection = await getProductsCollection()
	await collection.createIndex({ productKey: 1 }, { unique: true, name: "products_productKey_unique" })
	await collection.createIndex(
		{ categorySlug: 1, productSlug: 1 },
		{ name: "products_categorySlug_productSlug_lookup" },
	)
	await collection.createIndex(
		{ status: 1, categorySlug: 1, title: 1 },
		{ name: "products_status_category_title" },
	)
	return collection
}

function assertWritableMongoConfigured() {
	if (!process.env.MONGODB_URI?.trim()) {
		throw new Error("Missing MONGODB_URI. Add it to .env.local or export it before managing products.")
	}
}

function buildProductFilter(options?: { includeDrafts?: boolean; includeArchived?: boolean }) {
	const statuses: ProductStatus[] = ["published"]
	if (options?.includeDrafts) statuses.push("draft")
	if (options?.includeArchived) statuses.push("archived")
	return { status: { $in: statuses } }
}

function productProjection() {
	return {
		_id: 1,
		categorySlug: 1,
		productSlug: 1,
		productKey: 1,
		title: 1,
		shortTitle: 1,
		description: 1,
		excerpt: 1,
		specs: 1,
		applications: 1,
		features: 1,
		additionalInfo: 1,
		complianceNotes: 1,
		ctaLabel: 1,
		seo: 1,
		status: 1,
		createdAt: 1,
		updatedAt: 1,
	}
}

function sortProductRecords(products: ProductRecord[]): ProductRecord[] {
	return [...products].sort((a, b) => {
		if (a.categorySlug !== b.categorySlug) return a.categorySlug.localeCompare(b.categorySlug)
		return a.title.localeCompare(b.title)
	})
}

function normalizeProductInput(input: {
	categorySlug: string
	productSlug: string
	title: string
	description: string
	status?: ProductStatus
}) {
	const categorySlug = normalizeCategorySlug(input.categorySlug)
	const productSlug = normalizeProductSlug(input.productSlug)
	const productKey = `${categorySlug}/${productSlug}`
	const title = input.title.trim()
	const description = input.description.trim()
	const status = input.status ?? "draft"

	if (!categorySlug || !isValidCategorySlug(categorySlug)) throw new Error("Invalid category slug.")
	if (!productSlug || !isValidProductSlug(productSlug)) throw new Error("Invalid product slug.")
	if (!title) throw new Error("Product title is required.")
	if (!description) throw new Error("Product description is required.")
	if (!isProductStatus(status)) throw new Error("Invalid product status.")

	return { categorySlug, productSlug, productKey, title, description, status }
}

function buildOptionalSet(input: {
	shortTitle?: string
	excerpt?: string
	specs?: ProductSpec[]
	applications?: string[]
	features?: string[]
	additionalInfo?: ProductSpec[]
	complianceNotes?: string[]
	ctaLabel?: string
	seo?: ProductRecord["seo"]
}) {
	const set: ProductDocument = {}
	const unset: Record<string, ""> = {}
	const has = (key: keyof typeof input) => Object.prototype.hasOwnProperty.call(input, key)

	for (const [key, value] of [
		["shortTitle", input.shortTitle],
		["excerpt", input.excerpt],
		["ctaLabel", input.ctaLabel],
	] as const) {
		if (!has(key)) continue
		const trimmed = value?.trim()
		if (trimmed) set[key] = trimmed
		else unset[key] = ""
	}

	if (has("specs")) {
		if (input.specs?.length) set.specs = input.specs
		else unset.specs = ""
	}

	if (has("applications")) {
		if (input.applications?.length) set.applications = input.applications
		else unset.applications = ""
	}

	if (has("features")) {
		if (input.features?.length) set.features = input.features
		else unset.features = ""
	}

	if (has("additionalInfo")) {
		if (input.additionalInfo?.length) set.additionalInfo = input.additionalInfo
		else unset.additionalInfo = ""
	}

	if (has("complianceNotes")) {
		if (input.complianceNotes?.length) set.complianceNotes = input.complianceNotes
		else unset.complianceNotes = ""
	}

	if (has("seo")) {
		if (input.seo?.title?.trim() || input.seo?.description?.trim()) {
			set.seo = {
				...(input.seo.title?.trim() ? { title: input.seo.title.trim() } : {}),
				...(input.seo.description?.trim() ? { description: input.seo.description.trim() } : {}),
			}
		} else {
			unset.seo = ""
		}
	}

	return { set, unset }
}

export async function listProductsFromDatabase(options?: {
	includeDrafts?: boolean
	includeArchived?: boolean
}): Promise<ProductRecord[]> {
	if (!process.env.MONGODB_URI?.trim()) return []

	try {
		const collection = await getProductsCollection()
		const docs = await collection
			.find(buildProductFilter(options), { projection: productProjection() })
			.sort({ categorySlug: 1, title: 1 })
			.toArray()

		return sortProductRecords(
			docs
				.map(normalizeProductDocument)
				.filter((product): product is ProductRecord => Boolean(product)),
		)
	} catch {
		return []
	}
}

export async function getProductByKeyFromDatabase(
	categorySlug: string,
	productSlug: string,
): Promise<ProductRecord | null> {
	if (!process.env.MONGODB_URI?.trim()) return null

	const normalizedCategorySlug = normalizeCategorySlug(categorySlug)
	const normalizedProductSlug = normalizeProductSlug(productSlug)
	if (!normalizedCategorySlug || !normalizedProductSlug) return null

	try {
		const collection = await getProductsCollection()
		const doc = await collection.findOne(
			{
				categorySlug: normalizedCategorySlug,
				productSlug: normalizedProductSlug,
				productKey: `${normalizedCategorySlug}/${normalizedProductSlug}`,
			},
			{ projection: productProjection() },
		)
		return doc ? normalizeProductDocument(doc) : null
	} catch {
		return null
	}
}

export async function createProductInDatabase(input: {
	categorySlug: string
	productSlug: string
	title: string
	shortTitle?: string
	description: string
	excerpt?: string
	specs?: ProductSpec[]
	applications?: string[]
	features?: string[]
	additionalInfo?: ProductSpec[]
	complianceNotes?: string[]
	ctaLabel?: string
	seo?: {
		title?: string
		description?: string
	}
	status?: ProductStatus
}): Promise<ProductRecord> {
	assertWritableMongoConfigured()

	const normalized = normalizeProductInput(input)
	const now = new Date()
	const { set } = buildOptionalSet(input)
	const product: ProductRecord = {
		categorySlug: normalized.categorySlug,
		productSlug: normalized.productSlug,
		productKey: normalized.productKey,
		title: normalized.title,
		description: normalized.description,
		...set,
		status: normalized.status,
		createdAt: now,
		updatedAt: now,
	}

	const collection = await ensureProductIndexes()
	await collection.insertOne({
		categorySlug: product.categorySlug,
		productSlug: product.productSlug,
		productKey: product.productKey,
		title: product.title,
		description: product.description,
		...(product.shortTitle ? { shortTitle: product.shortTitle } : {}),
		...(product.excerpt ? { excerpt: product.excerpt } : {}),
		...(product.specs?.length ? { specs: product.specs } : {}),
		...(product.applications?.length ? { applications: product.applications } : {}),
		...(product.features?.length ? { features: product.features } : {}),
		...(product.additionalInfo?.length ? { additionalInfo: product.additionalInfo } : {}),
		...(product.complianceNotes?.length ? { complianceNotes: product.complianceNotes } : {}),
		...(product.ctaLabel ? { ctaLabel: product.ctaLabel } : {}),
		...(product.seo ? { seo: product.seo } : {}),
		status: product.status,
		createdAt: product.createdAt,
		updatedAt: product.updatedAt,
	})

	return product
}

export async function updateProductInDatabase(
	categorySlug: string,
	productSlug: string,
	patch: {
		title?: string
		shortTitle?: string
		description?: string
		excerpt?: string
		specs?: ProductSpec[]
		applications?: string[]
		features?: string[]
		additionalInfo?: ProductSpec[]
		complianceNotes?: string[]
		ctaLabel?: string
		seo?: {
			title?: string
			description?: string
		}
		status?: ProductStatus
	},
): Promise<ProductRecord | null> {
	assertWritableMongoConfigured()

	const normalizedCategorySlug = normalizeCategorySlug(categorySlug)
	const normalizedProductSlug = normalizeProductSlug(productSlug)
	if (!normalizedCategorySlug || !isValidCategorySlug(normalizedCategorySlug)) throw new Error("Invalid category slug.")
	if (!normalizedProductSlug || !isValidProductSlug(normalizedProductSlug)) throw new Error("Invalid product slug.")

	const set: ProductDocument = { updatedAt: new Date() }
	if (patch.title !== undefined) {
		const title = patch.title.trim()
		if (!title) throw new Error("Product title is required.")
		set.title = title
	}
	if (patch.description !== undefined) {
		const description = patch.description.trim()
		if (!description) throw new Error("Product description is required.")
		set.description = description
	}
	if (patch.status !== undefined) {
		if (!isProductStatus(patch.status)) throw new Error("Invalid product status.")
		set.status = patch.status
	}

	const optional = buildOptionalSet(patch)
	Object.assign(set, optional.set)

	const collection = await ensureProductIndexes()
	const update = Object.keys(optional.unset).length > 0 ? { $set: set, $unset: optional.unset } : { $set: set }
	const result = await collection.findOneAndUpdate(
		{
			categorySlug: normalizedCategorySlug,
			productSlug: normalizedProductSlug,
			productKey: `${normalizedCategorySlug}/${normalizedProductSlug}`,
		},
		update,
		{
			returnDocument: "after",
			projection: productProjection(),
		},
	)

	return result ? normalizeProductDocument(result) : null
}

export async function renameProductSlugInDatabase(input: {
	categorySlug: string
	oldProductSlug: string
	newProductSlug: string
}): Promise<void> {
	assertWritableMongoConfigured()

	const categorySlug = normalizeCategorySlug(input.categorySlug)
	const oldProductSlug = normalizeProductSlug(input.oldProductSlug)
	const newProductSlug = normalizeProductSlug(input.newProductSlug)
	if (!categorySlug || !isValidCategorySlug(categorySlug)) throw new Error("Invalid category slug.")
	if (!oldProductSlug || !isValidProductSlug(oldProductSlug)) throw new Error("Invalid product slug.")
	if (!newProductSlug || !isValidProductSlug(newProductSlug)) throw new Error("Invalid new product slug.")
	if (oldProductSlug === newProductSlug) throw new Error("New product slug must be different from the current slug.")

	const oldProductKey = `${categorySlug}/${oldProductSlug}`
	const newProductKey = `${categorySlug}/${newProductSlug}`
	const collection = await ensureProductIndexes()
	const [existingProduct, targetProduct] = await Promise.all([
		collection.findOne({ categorySlug, productSlug: oldProductSlug, productKey: oldProductKey }, { projection: { _id: 1 } }),
		collection.findOne({ productKey: newProductKey }, { projection: { _id: 1 } }),
	])

	if (!existingProduct) throw new Error("Product was not found.")
	if (targetProduct) throw new Error(`Product slug "${newProductSlug}" is not available.`)

	const result = await collection.updateOne(
		{ categorySlug, productSlug: oldProductSlug, productKey: oldProductKey },
		{
			$set: {
				productSlug: newProductSlug,
				productKey: newProductKey,
				updatedAt: new Date(),
			},
		},
	)

	if (result.matchedCount !== 1) throw new Error("Product was not found.")
}

export async function moveProductToCategoryInDatabase(input: {
	oldCategorySlug: string
	productSlug: string
	newCategorySlug: string
}): Promise<void> {
	assertWritableMongoConfigured()

	const oldCategorySlug = normalizeCategorySlug(input.oldCategorySlug)
	const newCategorySlug = normalizeCategorySlug(input.newCategorySlug)
	const productSlug = normalizeProductSlug(input.productSlug)
	if (!oldCategorySlug || !isValidCategorySlug(oldCategorySlug)) throw new Error("Invalid current category slug.")
	if (!newCategorySlug || !isValidCategorySlug(newCategorySlug)) throw new Error("Invalid target category slug.")
	if (!productSlug || !isValidProductSlug(productSlug)) throw new Error("Invalid product slug.")
	if (oldCategorySlug === newCategorySlug) throw new Error("Target category must be different from the current category.")

	const oldProductKey = `${oldCategorySlug}/${productSlug}`
	const newProductKey = `${newCategorySlug}/${productSlug}`
	const collection = await ensureProductIndexes()
	const [existingProduct, targetProduct] = await Promise.all([
		collection.findOne({ categorySlug: oldCategorySlug, productSlug, productKey: oldProductKey }, { projection: { _id: 1 } }),
		collection.findOne({ productKey: newProductKey }, { projection: { _id: 1 } }),
	])

	if (!existingProduct) throw new Error("Product was not found.")
	if (targetProduct) throw new Error(`Product key "${newProductKey}" is not available.`)

	const result = await collection.updateOne(
		{ categorySlug: oldCategorySlug, productSlug, productKey: oldProductKey },
		{
			$set: {
				categorySlug: newCategorySlug,
				productKey: newProductKey,
				updatedAt: new Date(),
			},
		},
	)

	if (result.matchedCount !== 1) throw new Error("Product was not found.")
}

export async function upsertArchivedProductTombstone(input: {
	categorySlug: string
	productSlug: string
	redirectedToProductKey?: string
	reason: ProductTombstoneReason
	actorEmail?: string
}): Promise<void> {
	assertWritableMongoConfigured()

	const categorySlug = normalizeCategorySlug(input.categorySlug)
	const productSlug = normalizeProductSlug(input.productSlug)
	if (!categorySlug || !isValidCategorySlug(categorySlug)) throw new Error("Invalid category slug.")
	if (!productSlug || !isValidProductSlug(productSlug)) throw new Error("Invalid product slug.")

	const productKey = `${categorySlug}/${productSlug}`
	const now = new Date()
	const collection = await ensureProductIndexes()
	await collection.updateOne(
		{ productKey },
		{
			$set: {
				categorySlug,
				productSlug,
				productKey,
				status: "archived",
				updatedAt: now,
				...(input.redirectedToProductKey?.trim() ? { tombstoneFor: input.redirectedToProductKey.trim() } : {}),
				tombstoneReason: input.reason,
				tombstonedAt: now,
				...(input.actorEmail?.trim() ? { tombstonedBy: input.actorEmail.trim() } : {}),
			},
			$setOnInsert: {
				title: `Archived product ${productKey}`,
				description: `Archived tombstone for ${productKey}.`,
				createdAt: now,
			},
		},
		{ upsert: true },
	)
}
