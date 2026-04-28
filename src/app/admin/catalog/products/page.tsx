import Link from "next/link"

import { listProductCategoriesFromDatabase } from "@/lib/mongodb/product-categories"
import { listProductsFromDatabase } from "@/lib/mongodb/products"

type ProductsPageProps = {
	searchParams?: Promise<{
		error?: string | string[] | undefined
	}>
}

function formatDate(value: Date): string {
	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(value)
}

export default async function AdminCatalogProductsPage({ searchParams }: ProductsPageProps) {
	const resolvedSearchParams = await searchParams
	const errorRaw = resolvedSearchParams?.error
	const error = typeof errorRaw === "string" ? errorRaw : Array.isArray(errorRaw) ? errorRaw[0] : undefined

	const [products, categories] = await Promise.all([
		listProductsFromDatabase({ includeDrafts: true, includeArchived: true }),
		listProductCategoriesFromDatabase({ includeDrafts: true, includeArchived: true }),
	])
	const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]))

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight text-slate-950">Products</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
						Manage database-backed product records and publishing status.
					</p>
				</div>
				<Link
					href="/admin/catalog/products/new"
					className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
				>
					Create Product
				</Link>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}

			{products.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
					<h2 className="text-base font-semibold text-slate-950">No products found.</h2>
					<p className="mt-2 text-sm text-slate-600">
						Create a product or run the product migration script.
					</p>
				</div>
			) : (
				<div className="overflow-x-auto rounded-lg border border-slate-200">
					<table className="min-w-full divide-y divide-slate-200 text-sm">
						<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
							<tr>
								<th className="px-4 py-3">Title</th>
								<th className="px-4 py-3">Category</th>
								<th className="px-4 py-3">Slug</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3">Images</th>
								<th className="px-4 py-3">Updated</th>
								<th className="px-4 py-3">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 bg-white">
							{products.map((product) => (
								<tr key={product.productKey}>
									<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-950">{product.title}</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-700">
										{categoryNameBySlug.get(product.categorySlug) ?? product.categorySlug}
									</td>
									<td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">{product.productSlug}</td>
									<td className="whitespace-nowrap px-4 py-3">
										<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
											{product.status}
										</span>
									</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-700">-</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(product.updatedAt)}</td>
									<td className="whitespace-nowrap px-4 py-3">
										<Link
											href={`/admin/catalog/products/${product.categorySlug}/${product.productSlug}`}
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
