import Link from "next/link"

import {
	listAllProductImagesFromDatabase,
	type ProductImageRecord,
} from "@/lib/mongodb/product-images"
import {
	listProductsFromDatabase,
	type ProductRecord,
} from "@/lib/mongodb/products"

/* eslint-disable @next/next/no-img-element */

type MediaPageProps = {
	searchParams?: Promise<{
		error?: string | string[] | undefined
		q?: string | string[] | undefined
		productKey?: string | string[] | undefined
	}>
}

interface ProductMediaGroup {
	productKey: string
	categorySlug: string
	productSlug: string
	title: string
	status?: ProductRecord["status"]
	updatedAt?: Date
	images: ProductImageRecord[]
	firstImage?: ProductImageRecord
}

function firstQueryValue(value: string | string[] | undefined): string {
	return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : ""
}

function formatDate(value: Date): string {
	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(value)
}

function formatSize(sizeBytes?: number): string {
	if (!sizeBytes) return "-"
	if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`
	return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`
}

function titleFromSlug(slug: string): string {
	return slug
		.split("-")
		.map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : ""))
		.join(" ")
}

function sortImages(images: ProductImageRecord[]): ProductImageRecord[] {
	return [...images].sort((a, b) => {
		if (a.role !== b.role) return a.role === "hero" ? -1 : 1
		if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
		return a.fileName.localeCompare(b.fileName)
	})
}

function createProductGroups(products: ProductRecord[], images: ProductImageRecord[]): ProductMediaGroup[] {
	const imagesByProductKey = new Map<string, ProductImageRecord[]>()
	for (const image of images) {
		const existing = imagesByProductKey.get(image.productKey) ?? []
		existing.push(image)
		imagesByProductKey.set(image.productKey, existing)
	}

	const groupsByProductKey = new Map<string, ProductMediaGroup>()
	for (const product of products) {
		const productImages = sortImages(imagesByProductKey.get(product.productKey) ?? [])
		groupsByProductKey.set(product.productKey, {
			productKey: product.productKey,
			categorySlug: product.categorySlug,
			productSlug: product.productSlug,
			title: product.title,
			status: product.status,
			updatedAt: product.updatedAt,
			images: productImages,
			firstImage: productImages[0],
		})
	}

	for (const [productKey, productImages] of imagesByProductKey) {
		if (groupsByProductKey.has(productKey)) continue
		const firstImage = sortImages(productImages)[0]
		if (!firstImage) continue
		groupsByProductKey.set(productKey, {
			productKey,
			categorySlug: firstImage.categorySlug,
			productSlug: firstImage.productSlug,
			title: titleFromSlug(firstImage.productSlug),
			images: sortImages(productImages),
			firstImage,
		})
	}

	return [...groupsByProductKey.values()].sort((a, b) => a.title.localeCompare(b.title))
}

function groupMatchesQuery(group: ProductMediaGroup, query: string): boolean {
	if (!query) return true
	const haystack = [
		group.title,
		group.productKey,
		group.categorySlug,
		group.productSlug,
		group.status ?? "",
		...group.images.map((image) => image.fileName),
	].join(" ").toLowerCase()
	return haystack.includes(query.toLowerCase())
}

function mediaHref(input: { productKey?: string; query?: string }) {
	const params = new URLSearchParams()
	if (input.query) params.set("q", input.query)
	if (input.productKey) params.set("productKey", input.productKey)
	const queryString = params.toString()
	return queryString ? `/admin/catalog/media?${queryString}` : "/admin/catalog/media"
}

export default async function AdminCatalogMediaPage({ searchParams }: MediaPageProps) {
	const resolvedSearchParams = await searchParams
	const error = firstQueryValue(resolvedSearchParams?.error)
	const query = firstQueryValue(resolvedSearchParams?.q)
	const selectedProductKey = firstQueryValue(resolvedSearchParams?.productKey)
	const [products, images] = await Promise.all([
		listProductsFromDatabase({ includeDrafts: true, includeArchived: true }),
		listAllProductImagesFromDatabase(),
	])
	const groups = createProductGroups(products, images)
	const filteredGroups = groups.filter((group) => groupMatchesQuery(group, query))
	const selectedGroup =
		filteredGroups.find((group) => group.productKey === selectedProductKey) ?? filteredGroups[0] ?? null

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight text-slate-950">Product Media</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Review product media by product. Select a product to inspect all image records and jump to the
					product editor for upload, replace, delete, and reorder controls.
				</p>
			</div>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
			) : null}

			<form className="grid gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]" method="get">
				<label className="space-y-2">
					<span className="text-sm font-semibold text-slate-800">Search products</span>
					<input
						name="q"
						defaultValue={query}
						placeholder="Search by title, product key, slug, status, or file name"
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
					/>
				</label>
				<button
					type="submit"
					className="inline-flex min-h-10 items-center justify-center self-end rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
				>
					Search
				</button>
				<Link
					href="/admin/catalog/media"
					className="inline-flex min-h-10 items-center justify-center self-end rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
				>
					Clear
				</Link>
			</form>

			{groups.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
					<h2 className="text-base font-semibold text-slate-950">No product images found.</h2>
					<p className="mt-2 text-sm text-slate-600">
						Product media will appear here after product or image records exist in MongoDB.
					</p>
				</div>
			) : filteredGroups.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
					<h2 className="text-base font-semibold text-slate-950">No products match this search.</h2>
					<p className="mt-2 text-sm text-slate-600">Try a product title, slug, category, or image file name.</p>
				</div>
			) : (
				<div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
					<section className="space-y-3">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold tracking-tight text-slate-950">Products</h2>
							<p className="text-sm text-slate-500">{filteredGroups.length} shown</p>
						</div>
						<div className="space-y-3">
							{filteredGroups.map((group) => (
								<Link
									key={group.productKey}
									href={mediaHref({ productKey: group.productKey, query })}
									className={`flex gap-3 rounded-lg border p-3 transition-colors ${
										selectedGroup?.productKey === group.productKey
											? "border-slate-950 bg-slate-50"
											: "border-slate-200 bg-white hover:bg-slate-50"
									}`}
								>
									{group.firstImage ? (
										<img
											src={group.firstImage.blobUrl}
											alt={group.firstImage.alt ?? group.firstImage.fileName}
											className="h-20 w-28 shrink-0 rounded-md border border-slate-200 object-cover"
										/>
									) : (
										<div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold text-slate-400">
											No image
										</div>
									)}
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-slate-950">{group.title}</p>
										<p className="mt-1 break-all font-mono text-xs text-slate-600">{group.productKey}</p>
										<p className="mt-2 text-xs font-medium text-slate-500">
											{group.images.length} image{group.images.length === 1 ? "" : "s"}
										</p>
									</div>
								</Link>
							))}
						</div>
					</section>

					{selectedGroup ? <ProductMediaDetail group={selectedGroup} /> : null}
				</div>
			)}
		</div>
	)
}

function ProductMediaDetail({ group }: { group: ProductMediaGroup }) {
	return (
		<section className="space-y-4 rounded-lg border border-slate-200 p-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-slate-950">{group.title}</h2>
					<p className="mt-1 break-all font-mono text-xs text-slate-600">{group.productKey}</p>
					<p className="mt-2 text-sm text-slate-600">
						{group.images.length} image{group.images.length === 1 ? "" : "s"}
						{group.updatedAt ? ` · Product updated ${formatDate(group.updatedAt)}` : ""}
					</p>
				</div>
				<Link
					href={`/admin/catalog/products/${group.categorySlug}/${group.productSlug}`}
					className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
				>
					Open Product
				</Link>
			</div>

			{group.images.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
					<h3 className="text-base font-semibold text-slate-950">No images for this product.</h3>
					<p className="mt-2 text-sm text-slate-600">Open the product editor to upload media.</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{group.images.map((image) => (
						<article key={String(image._id ?? image.blobPathname)} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
							<img
								src={image.blobUrl}
								alt={image.alt ?? image.fileName}
								className="h-44 w-full object-cover"
							/>
							<div className="space-y-2 p-4">
								<div className="flex items-center justify-between gap-3">
									<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
										{image.role}
									</span>
									<span className="text-xs font-medium text-slate-500">Order {image.sortOrder}</span>
								</div>
								<p className="break-all font-mono text-xs font-semibold text-slate-800">{image.fileName}</p>
								<dl className="grid grid-cols-2 gap-2 text-xs text-slate-600">
									<div>
										<dt className="font-semibold text-slate-500">Size</dt>
										<dd>{formatSize(image.sizeBytes)}</dd>
									</div>
									<div>
										<dt className="font-semibold text-slate-500">Updated</dt>
										<dd>{formatDate(image.updatedAt)}</dd>
									</div>
								</dl>
								<p className="break-all font-mono text-[11px] text-slate-500">{image.blobPathname}</p>
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	)
}
