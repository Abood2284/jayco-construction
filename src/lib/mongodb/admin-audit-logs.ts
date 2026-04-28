import { getMongoClient } from "@/lib/mongodb/client"
import { getMongoEnv } from "@/lib/mongodb/env"

export type AdminAuditEntityType =
	| "category"
	| "product"
	| "product_image"
	| "blob_object"

export type AdminAuditAction =
	| "category.create"
	| "category.update"
	| "category.slug_rename"
	| "product.create"
	| "product.update"
	| "product.slug_rename"
	| "product.category_move"
	| "product_image.upload"
	| "product_image.replace"
	| "product_image.delete"
	| "product_image.metadata_update"
	| "product_image.reorder"

export type AdminAuditStatus = "success" | "failure"

export interface AdminAuditLogRecord {
	_id?: unknown
	action: AdminAuditAction
	status: AdminAuditStatus
	entityType: AdminAuditEntityType
	entityId?: string
	entityKey?: string
	actorEmail?: string
	actorName?: string
	summary: string
	before?: unknown
	after?: unknown
	metadata?: Record<string, unknown>
	errorCode?: string
	errorMessage?: string
	createdAt: Date
}

type AdminAuditLogDocument = Partial<AdminAuditLogRecord>

const ADMIN_AUDIT_LOGS_COLLECTION = "admin_audit_logs"
const AUDIT_LOG_PROJECTION = {
	_id: 1,
	action: 1,
	status: 1,
	entityType: 1,
	entityId: 1,
	entityKey: 1,
	actorEmail: 1,
	actorName: 1,
	summary: 1,
	before: 1,
	after: 1,
	metadata: 1,
	errorCode: 1,
	errorMessage: 1,
	createdAt: 1,
}

function normalizeString(value: unknown): string {
	return typeof value === "string" ? value.trim() : ""
}

function normalizeDate(value: unknown): Date {
	return value instanceof Date ? value : new Date(0)
}

function normalizeAuditLogDocument(doc: AdminAuditLogDocument): AdminAuditLogRecord | null {
	const action = normalizeString(doc.action) as AdminAuditAction
	const status = doc.status === "success" || doc.status === "failure" ? doc.status : null
	const entityType = normalizeString(doc.entityType) as AdminAuditEntityType
	const summary = normalizeString(doc.summary)

	if (!action || !status || !entityType || !summary) return null

	const record: AdminAuditLogRecord = {
		action,
		status,
		entityType,
		...(normalizeString(doc.entityId) ? { entityId: normalizeString(doc.entityId) } : {}),
		...(normalizeString(doc.entityKey) ? { entityKey: normalizeString(doc.entityKey) } : {}),
		...(normalizeString(doc.actorEmail) ? { actorEmail: normalizeString(doc.actorEmail) } : {}),
		...(normalizeString(doc.actorName) ? { actorName: normalizeString(doc.actorName) } : {}),
		summary,
		...(doc.before !== undefined ? { before: doc.before } : {}),
		...(doc.after !== undefined ? { after: doc.after } : {}),
		...(doc.metadata && typeof doc.metadata === "object" ? { metadata: doc.metadata as Record<string, unknown> } : {}),
		...(normalizeString(doc.errorCode) ? { errorCode: normalizeString(doc.errorCode) } : {}),
		...(normalizeString(doc.errorMessage) ? { errorMessage: normalizeString(doc.errorMessage) } : {}),
		createdAt: normalizeDate(doc.createdAt),
	}

	if (doc._id !== undefined) record._id = doc._id

	return record
}

async function getAdminAuditLogsCollection() {
	const { dbName } = getMongoEnv()
	const client = await getMongoClient()
	return client.db(dbName).collection<AdminAuditLogDocument>(ADMIN_AUDIT_LOGS_COLLECTION)
}

async function ensureAdminAuditLogIndexes() {
	const collection = await getAdminAuditLogsCollection()
	await collection.createIndex({ createdAt: -1 }, { name: "admin_audit_logs_createdAt" })
	await collection.createIndex(
		{ entityType: 1, entityKey: 1, createdAt: -1 },
		{ name: "admin_audit_logs_entity_createdAt" },
	)
	await collection.createIndex({ action: 1, createdAt: -1 }, { name: "admin_audit_logs_action_createdAt" })
	await collection.createIndex({ status: 1, createdAt: -1 }, { name: "admin_audit_logs_status_createdAt" })
	return collection
}

export async function createAdminAuditLog(
	input: Omit<AdminAuditLogRecord, "_id" | "createdAt">,
): Promise<void> {
	if (!process.env.MONGODB_URI?.trim()) return

	const collection = await ensureAdminAuditLogIndexes()
	await collection.insertOne({
		action: input.action,
		status: input.status,
		entityType: input.entityType,
		...(input.entityId?.trim() ? { entityId: input.entityId.trim() } : {}),
		...(input.entityKey?.trim() ? { entityKey: input.entityKey.trim() } : {}),
		...(input.actorEmail?.trim() ? { actorEmail: input.actorEmail.trim() } : {}),
		...(input.actorName?.trim() ? { actorName: input.actorName.trim() } : {}),
		summary: input.summary,
		...(input.before !== undefined ? { before: input.before } : {}),
		...(input.after !== undefined ? { after: input.after } : {}),
		...(input.metadata ? { metadata: input.metadata } : {}),
		...(input.errorCode?.trim() ? { errorCode: input.errorCode.trim() } : {}),
		...(input.errorMessage?.trim() ? { errorMessage: input.errorMessage.trim() } : {}),
		createdAt: new Date(),
	})
}

export async function listRecentAdminAuditLogs(options?: {
	limit?: number
	entityType?: AdminAuditEntityType
	entityKey?: string
	status?: AdminAuditStatus
}): Promise<AdminAuditLogRecord[]> {
	if (!process.env.MONGODB_URI?.trim()) return []

	try {
		const collection = await ensureAdminAuditLogIndexes()
		const query: Record<string, unknown> = {}
		if (options?.entityType) query.entityType = options.entityType
		if (options?.entityKey?.trim()) query.entityKey = options.entityKey.trim()
		if (options?.status) query.status = options.status

		const docs = await collection
			.find(query, { projection: AUDIT_LOG_PROJECTION })
			.sort({ createdAt: -1 })
			.limit(Math.max(1, Math.min(options?.limit ?? 100, 200)))
			.toArray()

		return docs
			.map(normalizeAuditLogDocument)
			.filter((record): record is AdminAuditLogRecord => Boolean(record))
	} catch {
		return []
	}
}
