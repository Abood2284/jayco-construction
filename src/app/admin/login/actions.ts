"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { signInAdmin } from "@/lib/admin/auth"

export interface LoginActionState {
	error?: string
}

const loginSchema = z.object({
	identifier: z.string().trim().min(1),
	password: z.string().min(1),
})

export async function loginAction(_previousState: LoginActionState, formData: FormData): Promise<LoginActionState> {
	const parsed = loginSchema.safeParse({
		identifier: formData.get("identifier"),
		password: formData.get("password"),
	})

	if (!parsed.success) {
		return { error: "Invalid username/email or password." }
	}

	const result = await signInAdmin(parsed.data)
	if (!result.ok) {
		return { error: result.error }
	}

	redirect("/admin")
}
