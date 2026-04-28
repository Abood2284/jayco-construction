import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"

import { requireAdminUser } from "@/lib/admin/auth"

export const metadata: Metadata = {
	title: "Admin | Jayco Construction",
}

export const dynamic = "force-dynamic"

const adminNavItems = [
	{ label: "Overview", href: "/admin" },
	{ label: "Catalog", href: "/admin/catalog" },
	{ label: "Categories", href: "/admin/catalog/categories" },
	{ label: "Products", href: "/admin/catalog/products" },
	{ label: "Media", href: "/admin/catalog/media" },
	{ label: "Audit Logs", href: "/admin/audit" },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const adminUser = await requireAdminUser()

	return (
		<section className="min-h-[calc(100vh-var(--site-header-offset,0px))] bg-slate-100 text-slate-950">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
				<aside className="rounded-lg border border-slate-200 bg-white">
					<div className="border-b border-slate-200 p-4">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jayco Admin</p>
						<p className="mt-1 truncate text-sm font-medium text-slate-900">{adminUser.email}</p>
					</div>
					<nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible" aria-label="Admin navigation">
						{adminNavItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
							>
								{item.label}
							</Link>
						))}
					</nav>
				</aside>

				<div className="min-w-0 rounded-lg border border-slate-200 bg-white">
					<header className="border-b border-slate-200 px-5 py-4 sm:px-6">
						<p className="text-sm font-medium text-slate-500">Protected administration area</p>
					</header>
					<main className="px-5 py-6 sm:px-6">{children}</main>
				</div>
			</div>
		</section>
	)
}
