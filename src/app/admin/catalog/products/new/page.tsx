import Link from "next/link"

import { createProductAction } from "@/actions/admin-product-actions"
import { loadCategories } from "@/lib/content/catalog"
import { listProductCategoriesFromDatabase } from "@/lib/mongodb/product-categories"

type NewProductPageProps = {
	searchParams?: Promise<{
		error?: string | string[] | undefined
	}>
}

function firstQueryValue(value: string | string[] | undefined): string {
	return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : ""
}

export default async function NewAdminProductPage({ searchParams }: NewProductPageProps) {
	const resolvedSearchParams = await searchParams
	const error = firstQueryValue(resolvedSearchParams?.error)
	const [publicCategories, dbCategories] = await Promise.all([
		loadCategories(),
		listProductCategoriesFromDatabase({ includeDrafts: true, includeArchived: true }),
	])
	const categoriesBySlug = new Map(publicCategories.map((category) => [category.slug, category.name]))
	for (const category of dbCategories) categoriesBySlug.set(category.slug, category.name)
	const categories = [...categoriesBySlug.entries()].sort((a, b) => a[1].localeCompare(b[1]))

	return (
		<div className="space-y-6">
			<div>
				<Link href="/admin/catalog/products" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
					Back to products
				</Link>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Create Product</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Create a database-backed product record. Category and slug are locked after creation.
				</p>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}

			<form action={createProductAction} className="space-y-5 rounded-lg border border-slate-200 p-5">
				<div className="grid gap-5 sm:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Category</span>
						<select
							name="categorySlug"
							required
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						>
							<option value="">Select category</option>
							{categories.map(([slug, name]) => (
								<option key={slug} value={slug}>
									{name}
								</option>
							))}
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Product slug</span>
						<input
							name="productSlug"
							placeholder="derived-from-title-if-empty"
							className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-950 shadow-sm"
						/>
					</label>
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Title</span>
						<input
							name="title"
							required
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Short title</span>
						<input
							name="shortTitle"
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>
				</div>

				<label className="block space-y-2">
					<span className="text-sm font-semibold text-slate-800">Description</span>
					<textarea
						name="description"
						required
						rows={4}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>

				<label className="block space-y-2">
					<span className="text-sm font-semibold text-slate-800">Excerpt</span>
					<textarea
						name="excerpt"
						rows={3}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>

				<div className="grid gap-5 lg:grid-cols-2">
					<TextareaField name="applications" label="Applications" help="One item per line." />
					<TextareaField name="features" label="Features" help="One item per line." />
					<TextareaField name="specs" label="Specs" help="Use Label: Value, one row per line." />
					<TextareaField name="additionalInfo" label="Additional info" help="Use Label: Value, one row per line." />
					<TextareaField name="complianceNotes" label="Compliance notes" help="One item per line." />
					<TextareaField name="seoDescription" label="SEO description" help="Optional search description." />
				</div>

				<div className="grid gap-5 sm:grid-cols-3">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">CTA label</span>
						<input
							name="ctaLabel"
							placeholder="Request Quote"
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">SEO title</span>
						<input
							name="seoTitle"
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Status</span>
						<select
							name="status"
							defaultValue="draft"
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="archived">Archived</option>
						</select>
					</label>
				</div>

				<div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
					<button
						type="submit"
						className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
					>
						Create Product
					</button>
					<Link
						href="/admin/catalog/products"
						className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						Cancel
					</Link>
				</div>
			</form>
		</div>
	)
}

function TextareaField({ name, label, help }: { name: string; label: string; help: string }) {
	return (
		<label className="block space-y-2">
			<span className="text-sm font-semibold text-slate-800">{label}</span>
			<textarea
				name={name}
				rows={5}
				className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
			/>
			<span className="text-xs text-slate-500">{help}</span>
		</label>
	)
}
