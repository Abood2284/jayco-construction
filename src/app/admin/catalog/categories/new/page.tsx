import Link from "next/link"

import { createCategoryAction } from "@/actions/admin-category-actions"

type NewCategoryPageProps = {
	searchParams?: Promise<{
		error?: string | string[] | undefined
		name?: string | string[] | undefined
		slug?: string | string[] | undefined
		order?: string | string[] | undefined
	}>
}

function firstQueryValue(value: string | string[] | undefined): string {
	return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : ""
}

export default async function NewAdminCategoryPage({ searchParams }: NewCategoryPageProps) {
	const resolvedSearchParams = await searchParams
	const error = firstQueryValue(resolvedSearchParams?.error)
	const defaultName = firstQueryValue(resolvedSearchParams?.name)
	const defaultSlug = firstQueryValue(resolvedSearchParams?.slug)
	const defaultOrder = firstQueryValue(resolvedSearchParams?.order)

	return (
		<div className="space-y-6">
			<div>
				<Link href="/admin/catalog/categories" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
					Back to categories
				</Link>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Create Category</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Create a database-backed category record. The slug is locked after creation.
				</p>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}

			<form action={createCategoryAction} className="space-y-5 rounded-lg border border-slate-200 p-5">
				<div className="grid gap-5 sm:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Name</span>
						<input
							name="name"
							required
							defaultValue={defaultName}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Slug</span>
						<input
							name="slug"
							defaultValue={defaultSlug}
							placeholder="derived-from-name-if-empty"
							className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-950 shadow-sm"
						/>
					</label>
				</div>

				<label className="block space-y-2">
					<span className="text-sm font-semibold text-slate-800">Intro</span>
					<textarea
						name="intro"
						rows={3}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>

				<label className="block space-y-2">
					<span className="text-sm font-semibold text-slate-800">SEO Copy</span>
					<textarea
						name="seoCopy"
						rows={5}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>

				<div className="grid gap-5 sm:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Order</span>
						<input
							name="order"
							type="number"
							step="1"
							defaultValue={defaultOrder}
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
						Create Category
					</button>
					<Link
						href="/admin/catalog/categories"
						className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						Cancel
					</Link>
				</div>
			</form>
		</div>
	)
}
