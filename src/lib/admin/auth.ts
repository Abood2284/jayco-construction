import "server-only"

import { createHash, randomBytes } from "node:crypto"

import bcrypt from "bcryptjs"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import {
	getAdminLoginAttemptsCollection,
	getAdminSessionsCollection,
	getAdminUsersCollection,
	type AdminRole,
	type AdminUserDocument,
} from "@/lib/admin/mongo"

const ADMIN_SESSION_COOKIE = "jayco_admin_session"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000
const GENERIC_LOGIN_ERROR = "Invalid username/email or password."

export interface AdminUser {
	id: string
	email: string
	username: string
	name?: string
	role: AdminRole
}

function hashSessionToken(token: string): string {
	return createHash("sha256").update(token).digest("hex")
}

function createSessionToken(): string {
	return randomBytes(32).toString("base64url")
}

function normalizeIdentifier(value: string): string {
	return value.trim().toLowerCase()
}

async function getRequestMeta() {
	const headerStore = await headers()
	return {
		userAgent: headerStore.get("user-agent") ?? undefined,
		ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || undefined,
	}
}

async function recordLoginAttempt(identifier: string, success: boolean) {
	try {
		const { ipAddress } = await getRequestMeta()
		const attempts = await getAdminLoginAttemptsCollection()
		await attempts.insertOne({
			identifier,
			...(ipAddress ? { ipAddress } : {}),
			success,
			createdAt: new Date(),
		})
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("Admin login attempt write failed.", error)
		}
	}
}

function toSafeAdminUser(user: AdminUserDocument): AdminUser {
	if (!user._id) {
		throw new Error("Admin user document is missing _id")
	}

	return {
		id: user._id.toString(),
		email: user.email,
		username: user.username,
		...(user.name ? { name: user.name } : {}),
		role: user.role,
	}
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
	const cookieStore = await cookies()
	const rawToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
	if (!rawToken) return null

	const tokenHash = hashSessionToken(rawToken)
	const now = new Date()
	const sessions = await getAdminSessionsCollection()
	const session = await sessions.findOne({
		tokenHash,
		revokedAt: { $exists: false },
		expiresAt: { $gt: now },
	})

	if (!session) return null
	if (!session._id) return null

	const users = await getAdminUsersCollection()
	const user = await users.findOne({ _id: session.adminUserId, status: "ACTIVE" })
	if (!user) return null

	await sessions.updateOne({ _id: session._id }, { $set: { lastSeenAt: now } })

	return toSafeAdminUser(user)
}

export async function requireAdminUser(): Promise<AdminUser> {
	const adminUser = await getCurrentAdminUser()
	if (!adminUser) redirect("/admin/login")

	return adminUser
}

export async function signInAdmin(input: {
	identifier: string
	password: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
	const identifier = normalizeIdentifier(input.identifier)
	if (!identifier || !input.password) {
		await recordLoginAttempt(identifier || "unknown", false)
		return { ok: false, error: GENERIC_LOGIN_ERROR }
	}

	const users = await getAdminUsersCollection()
	const user = await users.findOne({
		status: "ACTIVE",
		$or: [{ email: identifier }, { username: identifier }],
	})

	if (!user) {
		await recordLoginAttempt(identifier, false)
		return { ok: false, error: GENERIC_LOGIN_ERROR }
	}
	if (!user._id) {
		await recordLoginAttempt(identifier, false)
		return { ok: false, error: GENERIC_LOGIN_ERROR }
	}

	const passwordMatches = await bcrypt.compare(input.password, user.passwordHash)
	if (!passwordMatches) {
		await recordLoginAttempt(identifier, false)
		return { ok: false, error: GENERIC_LOGIN_ERROR }
	}

	const rawToken = createSessionToken()
	const tokenHash = hashSessionToken(rawToken)
	const now = new Date()
	const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS)
	const { userAgent, ipAddress } = await getRequestMeta()

	const sessions = await getAdminSessionsCollection()
	await sessions.insertOne({
		adminUserId: user._id,
		tokenHash,
		expiresAt,
		createdAt: now,
		lastSeenAt: now,
		...(userAgent ? { userAgent } : {}),
		...(ipAddress ? { ipAddress } : {}),
	})

	await users.updateOne({ _id: user._id }, { $set: { lastLoginAt: now, updatedAt: now } })
	await recordLoginAttempt(identifier, true)

	const cookieStore = await cookies()
	cookieStore.set(ADMIN_SESSION_COOKIE, rawToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/admin",
		expires: expiresAt,
	})

	return { ok: true }
}

export async function signOutAdmin(): Promise<void> {
	const cookieStore = await cookies()
	const rawToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
	if (rawToken) {
		const sessions = await getAdminSessionsCollection()
		await sessions.updateOne({ tokenHash: hashSessionToken(rawToken) }, { $set: { revokedAt: new Date() } })
	}

	cookieStore.set(ADMIN_SESSION_COOKIE, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/admin",
		maxAge: 0,
	})

	redirect("/admin/login")
}
