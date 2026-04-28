import "server-only"

import { notFound } from "next/navigation"

export interface AdminUser {
	email: string
	name?: string
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
	if (process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_ACCESS === "1") {
		return {
			email: process.env.ADMIN_DEV_EMAIL?.trim() || "local-admin@jayco.local",
			name: "Local Admin",
		}
	}

	return null
}

export async function requireAdminUser(): Promise<AdminUser> {
	const adminUser = await getCurrentAdminUser()
	if (!adminUser) notFound()

	return adminUser
}
