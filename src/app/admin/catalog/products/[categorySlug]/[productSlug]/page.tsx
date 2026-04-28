import Link from "next/link"
import { notFound } from "next/navigation"

import { updateProductAction } from "@/actions/admin-product-actions"
import { ProductImagesSection } from "@/components/admin/product-images/product-images-section"
import type { ProductSpec } from "@/lib/cms/types"
import { loadCategories } from "@/lib/content/catalog"
import { listProductImagesFromDatabase } from "@/lib/mongodb/product-images"
import {
	listProductCategoriesFromDatabase,
	type ProductCategoryStatus,
} from "@/lib/mongodb/product-categories"
import { getProductByKeyFromDatabase } from "@/lib/mongodb/products"

type EditProductPageProps = {
	params: Promise<{ categorySlug: string; productSlug: string }>
	searchParams?: Promise<{
		error?: string | string[] | undefined
		renamed?: string | string[] | undefined
		moved?: string | string[] | undefined
	}>
}

function firstQueryValue(value: string | string[] | undefined): string {
	return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : ""
}

function linesToText(lines?: string[]): string {
	return lines?.join("\n") ?? ""
}

function specsToText(specs?: ProductSpec[]): string {
	return specs?.map((spec) => `${spec.label}: ${spec.value}`).join("\n") ?? ""
}

interface CategoryMoveOption {
	slug: string
	name: string
	status?: ProductCategoryStatus
}

function mergeCategoryMoveOptions(input: {
	dbCategories: CategoryMoveOption[]
	fallbackCategories: Array<{ slug: string; name: string }>
	currentCategorySlug: string
}): CategoryMoveOption[] {
	const categoriesBySlug = new Map<string, CategoryMoveOption>()
	for (const category of input.fallbackCategories) {
		if (category.slug === input.currentCategorySlug) continue
		categoriesBySlug.set(category.slug, {
			slug: category.slug,
			name: category.name,
			status: "published",
		})
	}

	for (const category of input.dbCategories) {
		if (category.slug === input.currentCategorySlug) continue
		categoriesBySlug.set(category.slug, category)
	}

	return [...categoriesBySlug.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export default async function EditAdminProductPage({ params, searchParams }: EditProductPageProps) {
	const { categorySlug, productSlug } = await params
	const resolvedSearchParams = await searchParams
	const error = firstQueryValue(resolvedSearchParams?.error)
	const renamed = firstQueryValue(resolvedSearchParams?.renamed)
	const moved = firstQueryValue(resolvedSearchParams?.moved)
	const [product, categories, dbCategories, images] = await Promise.all([
		getProductByKeyFromDatabase(categorySlug, productSlug),
		loadCategories(),
		listProductCategoriesFromDatabase({ includeDrafts: true }),
		listProductImagesFromDatabase(categorySlug, productSlug),
	])

	if (!product) notFound()

	const categoryName =
		dbCategories.find((category) => category.slug === product.categorySlug)?.name ??
		categories.find((category) => category.slug === product.categorySlug)?.name ??
		product.categorySlug
	const categoryMoveOptions = mergeCategoryMoveOptions({
		dbCategories,
		fallbackCategories: categories,
		currentCategorySlug: product.categorySlug,
	})
	const updateProductWithIdentity = updateProductAction.bind(null, product.categorySlug, product.productSlug)

	return (
		<div className="space-y-6">
			<div>
				<Link href="/admin/catalog/products" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
					Back to products
				</Link>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Edit Product</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Update safe product fields. Category and slug changes require a controlled move/rename workflow.
				</p>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}

			{renamed ? (
				<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
					Product slug rename completed.
				</div>
			) : null}

			{moved ? (
				<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
					Product category move completed.
				</div>
			) : null}

			<form action={updateProductWithIdentity} className="space-y-5 rounded-lg border border-slate-200 p-5">
				<div className="grid gap-5 sm:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Category</span>
						<input
							value={categoryName}
							readOnly
							className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 shadow-sm"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Product slug</span>
						<input
							value={product.productSlug}
							readOnly
							className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700 shadow-sm"
						/>
					</label>
				</div>

				<p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					Changing category or slug is intentionally disabled in this PR because it affects product URLs, Blob
					media paths, product image records, redirects, and SEO.
				</p>

				<div className="grid gap-5 sm:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Title</span>
						<input
							name="title"
							required
							defaultValue={product.title}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Short title</span>
						<input
							name="shortTitle"
							defaultValue={product.shortTitle ?? ""}
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
						defaultValue={product.description}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>

				<label className="block space-y-2">
					<span className="text-sm font-semibold text-slate-800">Excerpt</span>
					<textarea
						name="excerpt"
						rows={3}
						defaultValue={product.excerpt ?? ""}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>

				<div className="grid gap-5 lg:grid-cols-2">
					<TextareaField name="applications" label="Applications" help="One item per line." defaultValue={linesToText(product.applications)} />
					<TextareaField name="features" label="Features" help="One item per line." defaultValue={linesToText(product.features)} />
					<TextareaField name="specs" label="Specs" help="Use Label: Value, one row per line." defaultValue={specsToText(product.specs)} />
					<TextareaField name="additionalInfo" label="Additional info" help="Use Label: Value, one row per line." defaultValue={specsToText(product.additionalInfo)} />
					<TextareaField name="complianceNotes" label="Compliance notes" help="One item per line." defaultValue={linesToText(product.complianceNotes)} />
					<TextareaField name="seoDescription" label="SEO description" help="Optional search description." defaultValue={product.seo?.description ?? ""} />
				</div>

				<div className="grid gap-5 sm:grid-cols-3">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">CTA label</span>
						<input
							name="ctaLabel"
							defaultValue={product.ctaLabel ?? ""}
							placeholder="Request Quote"
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">SEO title</span>
						<input
							name="seoTitle"
							defaultValue={product.seo?.title ?? ""}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
						/>
					</label>
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Status</span>
						<select
							name="status"
							defaultValue={product.status}
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
						href="/admin/catalog/products"
						className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						Cancel
					</Link>
				</div>
			</form>

			<section className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-5">
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-amber-950">Change Category</h2>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-amber-900">
						Changing category moves this product to a new public URL and updates its Blob image paths. You
						will review the impact before anything is changed.
					</p>
				</div>
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-amber-950">Current category</span>
						<input
							value={`${categoryName} (${product.categorySlug})`}
							readOnly
							className="w-full rounded-md border border-amber-200 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm"
						/>
					</label>
					{categoryMoveOptions.length > 0 ? (
						<form
							action={`/admin/catalog/products/${product.categorySlug}/${product.productSlug}/move`}
							method="get"
							className="contents"
						>
							<label className="space-y-2">
								<span className="text-sm font-semibold text-amber-950">Target category</span>
								<select
									name="targetCategorySlug"
									required
									className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm"
								>
									<option value="">Select category</option>
									{categoryMoveOptions.map((category) => (
										<option key={category.slug} value={category.slug}>
											{category.name} ({category.slug}){category.status === "draft" ? " - draft" : ""}
										</option>
									))}
								</select>
							</label>
							<button
								type="submit"
								className="inline-flex min-h-10 items-center justify-center rounded-md bg-amber-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
							>
								Preview Category Move
							</button>
						</form>
					) : (
						<p className="rounded-md border border-amber-200 bg-white/70 px-4 py-3 text-sm text-amber-900 lg:col-span-2">
							No other categories available.
						</p>
					)}
				</div>
			</section>

			<ProductImagesSection
				categorySlug={product.categorySlug}
				productSlug={product.productSlug}
				images={images}
			/>

			<section className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-5">
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-red-950">Danger Zone</h2>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-red-900">
						Changing a product category or slug updates the public product URL and media paths. These
						operations copy Blob files, update MongoDB records, and may require redirects.
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Link
						href={`/admin/catalog/products/${product.categorySlug}/${product.productSlug}/move`}
						className="inline-flex min-h-10 items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
					>
						Move product to another category
					</Link>
					<Link
						href={`/admin/catalog/products/${product.categorySlug}/${product.productSlug}/rename`}
						className="inline-flex min-h-10 items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
					>
						Rename product slug
					</Link>
				</div>
			</section>
		</div>
	)
}

function TextareaField({
	name,
	label,
	help,
	defaultValue,
}: {
	name: string
	label: string
	help: string
	defaultValue: string
}) {
	return (
		<label className="block space-y-2">
			<span className="text-sm font-semibold text-slate-800">{label}</span>
			<textarea
				name={name}
				rows={5}
				defaultValue={defaultValue}
				className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
			/>
			<span className="text-xs text-slate-500">{help}</span>
		</label>
	)
}
