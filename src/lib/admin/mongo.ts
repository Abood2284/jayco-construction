import type { Collection, ObjectId } from "mongodb"

import { getMongoClient } from "@/lib/mongodb/client"
import { getMongoEnv } from "@/lib/mongodb/env"

export type AdminRole = "SUPER_ADMIN" | "ADMIN"
export type AdminStatus = "ACTIVE" | "DISABLED"
export type ContactSubmissionStatus = "NEW" | "REVIEWED" | "ARCHIVED" | "SPAM"

export interface AdminUserDocument {
	_id?: ObjectId
	email: string
	username: string
	name?: string
	passwordHash: string
	role: AdminRole
	status: AdminStatus
	createdAt: Date
	updatedAt: Date
	lastLoginAt?: Date
}

export interface AdminSessionDocument {
	_id?: ObjectId
	adminUserId: ObjectId
	tokenHash: string
	expiresAt: Date
	createdAt: Date
	lastSeenAt?: Date
	revokedAt?: Date
	userAgent?: string
	ipAddress?: string
}

export interface AdminLoginAttemptDocument {
	_id?: ObjectId
	identifier: string
	ipAddress?: string
	success: boolean
	createdAt: Date
}

export interface ContactSubmissionDocument {
	_id?: ObjectId
	name: string
	email: string
	phone: string
	company?: string
	intent?: string
	intentLabel?: string
	product?: string
	capacityDetails?: string
	location?: string
	equipment?: string
	serviceRequirement?: string
	issueDescription?: string
	message?: string
	status: ContactSubmissionStatus
	sourcePath?: string
	userAgent?: string
	ipAddress?: string
	metadata?: Record<string, unknown>
	createdAt: Date
	updatedAt: Date
}

async function getCollection<T extends { _id?: ObjectId }>(name: string): Promise<Collection<T>> {
	const { dbName } = getMongoEnv()
	const client = await getMongoClient()
	return client.db(dbName).collection<T>(name)
}

export function getAdminUsersCollection() {
	return getCollection<AdminUserDocument>("admin_users")
}

export function getAdminSessionsCollection() {
	return getCollection<AdminSessionDocument>("admin_sessions")
}

export function getAdminLoginAttemptsCollection() {
	return getCollection<AdminLoginAttemptDocument>("admin_login_attempts")
}

export function getContactSubmissionsCollection() {
	return getCollection<ContactSubmissionDocument>("contact_submissions")
}

export async function ensureAdminMongoIndexes(): Promise<void> {
	const [adminUsers, adminSessions, adminLoginAttempts, contactSubmissions] = await Promise.all([
		getAdminUsersCollection(),
		getAdminSessionsCollection(),
		getAdminLoginAttemptsCollection(),
		getContactSubmissionsCollection(),
	])

	await Promise.all([
		adminUsers.createIndex({ email: 1 }, { unique: true, name: "admin_users_email_unique" }),
		adminUsers.createIndex({ username: 1 }, { unique: true, name: "admin_users_username_unique" }),
		adminUsers.createIndex({ status: 1 }, { name: "admin_users_status" }),
		adminSessions.createIndex({ tokenHash: 1 }, { unique: true, name: "admin_sessions_tokenHash_unique" }),
		adminSessions.createIndex({ adminUserId: 1 }, { name: "admin_sessions_adminUserId" }),
		adminSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "admin_sessions_expiresAt_ttl" }),
		adminLoginAttempts.createIndex({ createdAt: -1 }, { name: "admin_login_attempts_createdAt" }),
		contactSubmissions.createIndex({ createdAt: -1 }, { name: "contact_submissions_createdAt" }),
		contactSubmissions.createIndex(
			{ status: 1, createdAt: -1 },
			{ name: "contact_submissions_status_createdAt" },
		),
		contactSubmissions.createIndex({ email: 1 }, { name: "contact_submissions_email" }),
	])
}
