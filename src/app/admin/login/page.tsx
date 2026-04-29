import { redirect } from "next/navigation"

import { getCurrentAdminUser } from "@/lib/admin/auth"

import { AdminLoginForm } from "./login-form"

export default async function AdminLoginPage() {
	const adminUser = await getCurrentAdminUser()
	if (adminUser) redirect("/admin")

	return (
		<section className="flex min-h-[calc(100vh-var(--site-header-offset,0px))] items-center justify-center bg-slate-100 px-4 py-12 text-slate-950">
			<div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<div className="mb-7">
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jayco Construction</p>
					<h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Jayco Admin</h1>
					<p className="mt-2 text-sm leading-6 text-slate-600">
						Sign in with your admin username or email to manage the site.
					</p>
				</div>
				<AdminLoginForm />
			</div>
		</section>
	)
}
