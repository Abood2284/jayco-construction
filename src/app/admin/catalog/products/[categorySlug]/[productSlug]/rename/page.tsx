import Link from "next/link"
import { notFound } from "next/navigation"

import { executeProductSlugRenameAction } from "@/actions/admin-product-actions"
import { requireAdminUser } from "@/lib/admin/auth"
import { previewProductSlugRename } from "@/lib/admin/product-rename-service"
import { normalizeCategorySlug } from "@/lib/mongodb/product-categories"
import { getProductByKeyFromDatabase, normalizeProductSlug } from "@/lib/mongodb/products"

type RenameProductPageProps = {
	params: Promise<{ categorySlug: string; productSlug: string }>
	searchParams?: Promise<{
		newSlug?: string | string[] | undefined
		error?: string | string[] | undefined
	}>
}

function firstQueryValue(value: string | string[] | undefined): string {
	return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : ""
}

export default async function RenameProductSlugPage({ params, searchParams }: RenameProductPageProps) {
	await requireAdminUser()
	const { categorySlug: categorySlugParam, productSlug: productSlugParam } = await params
	const resolvedSearchParams = await searchParams
	const error = firstQueryValue(resolvedSearchParams?.error)
	const newSlugInput = firstQueryValue(resolvedSearchParams?.newSlug)
	const categorySlug = normalizeCategorySlug(categorySlugParam)
	const oldProductSlug = normalizeProductSlug(productSlugParam)
	const product = await getProductByKeyFromDatabase(categorySlug, oldProductSlug)

	if (!product) notFound()

	let preview = null
	let previewError = ""
	if (newSlugInput) {
		try {
			preview = await previewProductSlugRename({
				categorySlug,
				oldProductSlug,
				newProductSlug: newSlugInput,
			})
		} catch (previewFailure) {
			previewError = previewFailure instanceof Error ? previewFailure.message : "Could not preview product rename."
		}
	}

	const canExecute = Boolean(preview?.productExists && preview.targetSlugAvailable)

	return (
		<div className="space-y-6">
			<div>
				<Link
					href={`/admin/catalog/products/${product.categorySlug}/${product.productSlug}`}
					className="text-sm font-semibold text-slate-600 hover:text-slate-950"
				>
					Back to product
				</Link>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Rename Product Slug</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Preview the impact first. Execution copies Blob files, updates MongoDB records, and records the
					required redirect for follow-up.
				</p>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}
			{previewError ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
					{previewError}
				</div>
			) : null}

			<section className="space-y-4 rounded-lg border border-slate-200 p-5">
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-slate-950">Preview Rename</h2>
					<p className="mt-2 text-sm text-slate-600">Enter the target slug to calculate affected records.</p>
				</div>
				<form className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" method="get">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">Old product slug</span>
						<input
							value={product.productSlug}
							readOnly
							className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700 shadow-sm"
						/>
					</label>
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-800">New product slug</span>
						<input
							name="newSlug"
							defaultValue={newSlugInput}
							required
							className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-950 shadow-sm"
						/>
					</label>
					<button
						type="submit"
						className="inline-flex min-h-10 items-center justify-center self-end rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
					>
						Preview rename
					</button>
				</form>
			</section>

			{preview ? (
				<>
					<PreviewSummary preview={preview} />
					<PreviewTables preview={preview} />
					{canExecute ? (
						<section className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-5">
							<div>
								<h2 className="text-xl font-semibold tracking-tight text-red-950">Execute Rename</h2>
								<p className="mt-2 max-w-2xl text-sm leading-6 text-red-900">
									This changes the public product URL and moves product media paths.
								</p>
								<p className="mt-2 max-w-2xl text-sm leading-6 text-red-900">
									Blob objects are copied before MongoDB is updated. Old Blob objects are deleted only
									after the database update succeeds.
								</p>
							</div>
							<form action={executeProductSlugRenameAction} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
								<input type="hidden" name="categorySlug" value={preview.categorySlug} />
								<input type="hidden" name="oldProductSlug" value={preview.oldProductSlug} />
								<input type="hidden" name="newProductSlug" value={preview.newProductSlug} />
								<label className="space-y-2">
									<span className="text-sm font-semibold text-red-950">
										To confirm, type: <span className="font-mono">{preview.oldProductSlug}</span>
									</span>
									<input
										name="confirmOldProductSlug"
										required
										className="w-full rounded-md border border-red-300 px-3 py-2 font-mono text-sm text-slate-950 shadow-sm"
									/>
								</label>
								<button
									type="submit"
									className="inline-flex min-h-10 items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
								>
									Rename product slug
								</button>
							</form>
						</section>
					) : (
						<p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
							This rename cannot execute until the old product exists and the target slug is available.
						</p>
					)}
				</>
			) : null}
		</div>
	)
}

function PreviewSummary({
	preview,
}: {
	preview: Awaited<ReturnType<typeof previewProductSlugRename>>
}) {
	const blobMoveCount = preview.affectedImages.filter((image) => image.oldBlobPathname && image.newBlobPathname).length

	return (
		<section className="space-y-4 rounded-lg border border-slate-200 p-5">
			<div>
				<h2 className="text-xl font-semibold tracking-tight text-slate-950">Impact Preview</h2>
				<p className="mt-2 text-sm text-slate-600">Review the affected records before execution.</p>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<Metric label="Category slug" value={preview.categorySlug} />
				<Metric label="Old product slug" value={preview.oldProductSlug} />
				<Metric label="New product slug" value={preview.newProductSlug} />
				<Metric label="Old product key" value={preview.oldProductKey} />
				<Metric label="New product key" value={preview.newProductKey} />
				<Metric label="Affected images" value={String(preview.affectedImages.length)} />
				<Metric label="Blob objects to move" value={String(blobMoveCount)} />
				<Metric label="Redirects needed" value={String(preview.affectedRedirects.length)} />
				<Metric label="Product exists" value={preview.productExists ? "Yes" : "No"} />
				<Metric label="Target available" value={preview.targetSlugAvailable ? "Yes" : "No"} />
			</div>
			{preview.warnings.length > 0 ? (
				<div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					<p className="font-semibold">Warnings</p>
					<ul className="mt-2 list-disc space-y-1 pl-5">
						{preview.warnings.map((warning) => (
							<li key={warning}>{warning}</li>
						))}
					</ul>
				</div>
			) : null}
		</section>
	)
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
			<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
			<p className="mt-1 break-all font-mono text-sm font-semibold text-slate-950">{value}</p>
		</div>
	)
}

function PreviewTables({
	preview,
}: {
	preview: Awaited<ReturnType<typeof previewProductSlugRename>>
}) {
	return (
		<div className="space-y-6">
			<SimpleTable
				title="Images"
				headers={["File", "Old Blob path", "New Blob path"]}
				rows={preview.affectedImages.map((image) => [
					image.fileName,
					image.oldBlobPathname ?? "-",
					image.newBlobPathname ?? "-",
				])}
				emptyText="No product image records are affected."
			/>
			<SimpleTable
				title="Redirects"
				headers={["Source", "Destination"]}
				rows={preview.affectedRedirects.map((redirect) => [redirect.source, redirect.destination])}
				emptyText="No product redirects were generated."
			/>
		</div>
	)
}

function SimpleTable({
	title,
	headers,
	rows,
	emptyText,
}: {
	title: string
	headers: string[]
	rows: string[][]
	emptyText: string
}) {
	return (
		<section className="space-y-3 rounded-lg border border-slate-200 p-5">
			<h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
			{rows.length === 0 ? (
				<p className="text-sm text-slate-600">{emptyText}</p>
			) : (
				<div className="overflow-x-auto rounded-lg border border-slate-200">
					<table className="min-w-full divide-y divide-slate-200 text-sm">
						<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
							<tr>
								{headers.map((header) => (
									<th key={header} className="px-4 py-3">
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 bg-white">
							{rows.map((row) => (
								<tr key={row.join("|")}>
									{row.map((cell, index) => (
										<td key={`${cell}-${index}`} className="break-all px-4 py-3 font-mono text-xs text-slate-700">
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	)
}
