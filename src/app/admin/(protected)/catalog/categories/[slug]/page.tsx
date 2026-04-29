import Link from "next/link"
import { notFound } from "next/navigation"

import { updateCategoryAction } from "@/actions/admin-category-actions"
import { getProductCategoryBySlugFromDatabase } from "@/lib/mongodb/product-categories"

type EditCategoryPageProps = {
	params: Promise<{ slug: string }>
	searchParams?: Promise<{
		error?: string | string[] | undefined
		renamed?: string | string[] | undefined
	}>
}

function firstQueryValue(value: string | string[] | undefined): string {
	return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : ""
}

export default async function EditAdminCategoryPage({ params, searchParams }: EditCategoryPageProps) {
	const { slug } = await params
	const resolvedSearchParams = await searchParams
	const error = firstQueryValue(resolvedSearchParams?.error)
	const renamed = firstQueryValue(resolvedSearchParams?.renamed)
	const category = await getProductCategoryBySlugFromDatabase(slug)

	if (!category) notFound()

	return (
		<div className="space-y-6">
			<div>
				<Link href="/admin/catalog/categories" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
					Back to categories
				</Link>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Edit Category</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Update safe category fields. Slug changes require a controlled rename workflow because they affect
					product URLs and Blob media paths.
				</p>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}

			{renamed ? (
				<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
					Category slug rename completed.
				</div>
			) : null}

			<form action={updateCategoryAction} className="space-y-5 rounded-lg border border-slate-200 p-5">
				<div className="grid gap-5 sm:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Name</span>
						<input
							name="name"
							required
							defaultValue={category.name}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Slug</span>
						<input
							name="slug"
							value={category.slug}
							readOnly
							className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700 shadow-sm"
						/>
					</label>
				</div>

				<p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					Slug changes are intentionally disabled in this PR. A rename workflow must update routes, products,
					product image records, Blob paths, redirects, and audit logs together.
				</p>

				<label className="block space-y-2">
					<span className="text-sm font-semibold text-slate-800">Intro</span>
					<textarea
						name="intro"
						rows={3}
						defaultValue={category.intro ?? ""}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>

				<label className="block space-y-2">
					<span className="text-sm font-semibold text-slate-800">SEO Copy</span>
					<textarea
						name="seoCopy"
						rows={5}
						defaultValue={category.seoCopy ?? ""}
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
							defaultValue={category.order ?? ""}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Status</span>
						<select
							name="status"
							defaultValue={category.status}
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
						Save Changes
					</button>
					<Link
						href="/admin/catalog/categories"
						className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						Cancel
					</Link>
				</div>
			</form>

			<section className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-5">
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-red-950">Danger Zone</h2>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-red-900">
						Changing a category slug updates product URLs and media paths. This operation copies Blob files,
						updates MongoDB records, and may require redirects.
					</p>
				</div>
				<Link
					href={`/admin/catalog/categories/${category.slug}/rename`}
					className="inline-flex min-h-10 items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
				>
					Rename slug
				</Link>
			</section>
		</div>
	)
}
