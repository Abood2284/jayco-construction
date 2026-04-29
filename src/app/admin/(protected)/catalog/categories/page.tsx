import Link from "next/link"

import {
	listProductCategoriesFromDatabase,
	type ProductCategoryRecord,
} from "@/lib/mongodb/product-categories"
import { listProductsFromDatabase } from "@/lib/mongodb/products"

interface CategoryTableRow {
	slug: string
	name: string
	status: ProductCategoryRecord["status"]
	order?: number
	productsCount: number
	updatedAt: Date
}

type CategoriesPageProps = {
	searchParams?: Promise<{
		error?: string | string[] | undefined
	}>
}

function formatDate(value: Date | null): string {
	if (!value) return "Not in DB"
	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(value)
}

export default async function AdminCatalogCategoriesPage({ searchParams }: CategoriesPageProps) {
	const resolvedSearchParams = await searchParams
	const errorRaw = resolvedSearchParams?.error
	const error = typeof errorRaw === "string" ? errorRaw : Array.isArray(errorRaw) ? errorRaw[0] : undefined

	const [dbCategories, products] = await Promise.all([
		listProductCategoriesFromDatabase({ includeDrafts: true, includeArchived: true }),
		listProductsFromDatabase({ includeDrafts: true, includeArchived: false }),
	])

	const productCountByCategory = new Map<string, number>()
	for (const product of products) {
		productCountByCategory.set(product.categorySlug, (productCountByCategory.get(product.categorySlug) ?? 0) + 1)
	}

	const rows = dbCategories.map((category): CategoryTableRow => ({
		slug: category.slug,
		name: category.name,
		status: category.status,
		order: category.order,
		productsCount: productCountByCategory.get(category.slug) ?? 0,
		updatedAt: category.updatedAt,
	})).sort((a, b) => {
		const aOrder = a.order ?? Number.POSITIVE_INFINITY
		const bOrder = b.order ?? Number.POSITIVE_INFINITY
		if (aOrder !== bOrder) return aOrder - bOrder
		return a.name.localeCompare(b.name)
	})

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight text-slate-950">Categories</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
						Manage product category display names, ordering, and publishing status.
					</p>
				</div>
				<Link
					href="/admin/catalog/categories/new"
					className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
				>
					Create Category
				</Link>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}

			{rows.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
					<h2 className="text-base font-semibold text-slate-950">No categories yet.</h2>
					<p className="mt-2 text-sm text-slate-600">Create your first category to start organizing products.</p>
				</div>
			) : (
				<div className="overflow-x-auto rounded-lg border border-slate-200">
					<table className="min-w-full divide-y divide-slate-200 text-sm">
						<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
							<tr>
								<th className="px-4 py-3">Name</th>
								<th className="px-4 py-3">Slug</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3">Order</th>
								<th className="px-4 py-3">Products Count</th>
								<th className="px-4 py-3">Updated</th>
								<th className="px-4 py-3">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 bg-white">
							{rows.map((row) => (
								<tr key={row.slug}>
									<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-950">{row.name}</td>
									<td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">{row.slug}</td>
									<td className="whitespace-nowrap px-4 py-3">
										<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
											{row.status}
										</span>
									</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-700">{row.order ?? "Unordered"}</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-700">{row.productsCount}</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(row.updatedAt)}</td>
									<td className="whitespace-nowrap px-4 py-3">
										<Link
											href={`/admin/catalog/categories/${row.slug}`}
											className="font-semibold text-slate-950 underline-offset-4 hover:underline"
										>
											Edit
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
