import {
	deleteProductImageAction,
	replaceProductImageAction,
	reorderProductImagesAction,
	updateProductImageMetadataAction,
	uploadProductImageAction,
} from "@/actions/admin-product-image-actions"
import type { ProductImageRecord } from "@/lib/mongodb/product-images"

/* eslint-disable @next/next/no-img-element */

type ProductImagesSectionProps = {
	categorySlug: string
	productSlug: string
	images: ProductImageRecord[]
}

const FIELD_CLASS =
	"w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 shadow-sm"
const BUTTON_CLASS =
	"inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
const SECONDARY_BUTTON_CLASS =
	"inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
const DANGER_BUTTON_CLASS =
	"inline-flex min-h-10 items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"

function getImageId(image: ProductImageRecord): string {
	return String(image._id ?? "")
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
	if (sizeBytes < 1024 * 1024) return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`
	return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`
}

function swapAtIndex(values: string[], index: number, direction: -1 | 1): string[] {
	const next = [...values]
	const targetIndex = index + direction
	const current = next[index]
	next[index] = next[targetIndex] ?? ""
	next[targetIndex] = current ?? ""
	return next.filter(Boolean)
}

export function ProductImagesSection({
	categorySlug,
	productSlug,
	images,
}: ProductImagesSectionProps) {
	const returnTo = `/admin/catalog/products/${categorySlug}/${productSlug}`
	const heroImage = images.find((image) => image.role === "hero")
	const galleryImages = images.filter((image) => image.role === "gallery")
	const galleryImageIds = galleryImages.map(getImageId).filter(Boolean)

	return (
		<section className="space-y-6 rounded-lg border border-slate-200 p-5">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight text-slate-950">Product Images</h2>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Manage hero and gallery images for this product.
				</p>
			</div>

			<p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
				Images are stored under the current category and product slug. Slug/category changes require a
				separate controlled move workflow.
			</p>

			<div className="space-y-4">
				<div>
					<h3 className="text-base font-semibold text-slate-950">Hero Image</h3>
					<p className="mt-1 text-sm text-slate-600">The main product visual shown first on public pages.</p>
				</div>
				{heroImage ? (
					<ProductImageCard
						image={heroImage}
						returnTo={returnTo}
					/>
				) : (
					<div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
						<p className="font-semibold text-slate-950">No hero image yet.</p>
						<p className="mt-1">Upload one hero image for the main product visual.</p>
					</div>
				)}
			</div>

			<div className="space-y-4">
				<div>
					<h3 className="text-base font-semibold text-slate-950">Gallery Images</h3>
					<p className="mt-1 text-sm text-slate-600">Alternate views and product detail images.</p>
				</div>
				{galleryImages.length === 0 ? (
					<div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
						<p className="font-semibold text-slate-950">No gallery images yet.</p>
						<p className="mt-1">Add gallery images to show product details and alternate views.</p>
					</div>
				) : (
					<div className="grid gap-5">
						{galleryImages.map((image, index) => {
							const imageId = getImageId(image)
							const moveUpAction =
								index > 0
									? reorderProductImagesAction.bind(
											null,
											categorySlug,
											productSlug,
											swapAtIndex(galleryImageIds, index, -1),
											returnTo,
										)
									: null
							const moveDownAction =
								index < galleryImages.length - 1
									? reorderProductImagesAction.bind(
											null,
											categorySlug,
											productSlug,
											swapAtIndex(galleryImageIds, index, 1),
											returnTo,
										)
									: null

							return (
								<ProductImageCard
									key={imageId || image.blobPathname}
									image={image}
									returnTo={returnTo}
									moveUpAction={moveUpAction}
									moveDownAction={moveDownAction}
								/>
							)
						})}
					</div>
				)}
			</div>

			<ProductImageUploadForm
				categorySlug={categorySlug}
				productSlug={productSlug}
				returnTo={returnTo}
			/>
		</section>
	)
}

function ProductImageCard({
	image,
	returnTo,
	moveUpAction,
	moveDownAction,
}: {
	image: ProductImageRecord
	returnTo: string
	moveUpAction?: (() => Promise<void>) | null
	moveDownAction?: (() => Promise<void>) | null
}) {
	const imageId = getImageId(image)
	const updateAction = updateProductImageMetadataAction.bind(null, imageId)
	const replaceAction = replaceProductImageAction.bind(null, imageId)
	const deleteAction = deleteProductImageAction.bind(null, imageId, returnTo)

	return (
		<article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
			<div className="grid gap-5 p-5 lg:grid-cols-[260px_minmax(0,1fr)]">
				<div>
					<img
						src={image.blobUrl}
						alt={image.alt || image.fileName}
						className="aspect-video w-full rounded-lg border border-slate-200 object-cover"
					/>
					<div className="mt-3 flex flex-wrap gap-2">
						<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
							{image.role}
						</span>
						<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
							Order {image.sortOrder}
						</span>
					</div>
				</div>

				<div className="min-w-0 space-y-5">
					<div>
						<p className="break-all font-mono text-sm font-semibold text-slate-950">{image.fileName}</p>
						<dl className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
							<div>
								<dt className="font-semibold text-slate-800">Alt</dt>
								<dd className="mt-0.5">{image.alt || "-"}</dd>
							</div>
							<div>
								<dt className="font-semibold text-slate-800">Size</dt>
								<dd className="mt-0.5">{formatSize(image.sizeBytes)}</dd>
							</div>
							<div>
								<dt className="font-semibold text-slate-800">Updated</dt>
								<dd className="mt-0.5">{formatDate(image.updatedAt)}</dd>
							</div>
							<div>
								<dt className="font-semibold text-slate-800">Path</dt>
								<dd className="mt-0.5 break-all">{image.blobPathname}</dd>
							</div>
						</dl>
					</div>

					<form action={updateAction} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
						<input type="hidden" name="returnTo" value={returnTo} />
						<div>
							<h4 className="text-sm font-semibold text-slate-950">Edit Metadata</h4>
							<p className="mt-1 text-xs text-slate-600">Save alt text, hero/gallery role, and gallery order.</p>
						</div>
						<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_140px]">
							<label className="space-y-2">
								<span className="text-sm font-semibold text-slate-700">Alt text</span>
								<input name="alt" defaultValue={image.alt ?? ""} className={FIELD_CLASS} />
							</label>
							<label className="space-y-2">
								<span className="text-sm font-semibold text-slate-700">Role</span>
								<select name="role" defaultValue={image.role} className={FIELD_CLASS}>
									<option value="hero">Hero</option>
									<option value="gallery">Gallery</option>
								</select>
							</label>
							<label className="space-y-2">
								<span className="text-sm font-semibold text-slate-700">Sort order</span>
								<input
									name="sortOrder"
									type="number"
									min={0}
									defaultValue={image.sortOrder}
									className={FIELD_CLASS}
								/>
							</label>
						</div>
						<div className="flex justify-end">
							<button type="submit" className={BUTTON_CLASS}>
								Save
							</button>
						</div>
					</form>

					<form action={replaceAction} className="space-y-4 rounded-lg border border-slate-200 p-4">
						<input type="hidden" name="returnTo" value={returnTo} />
						<div>
							<h4 className="text-sm font-semibold text-slate-950">Replace Image File</h4>
							<p className="mt-1 text-xs text-slate-600">Keeps the current role and sort order.</p>
						</div>
						<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
							<label className="space-y-2">
								<span className="text-sm font-semibold text-slate-700">Replace file</span>
								<input
									name="file"
									type="file"
									accept="image/jpeg,image/png,image/webp,image/avif"
									required
									className={FIELD_CLASS}
								/>
							</label>
							<label className="space-y-2">
								<span className="text-sm font-semibold text-slate-700">Alt override</span>
								<input name="alt" defaultValue={image.alt ?? ""} className={FIELD_CLASS} />
							</label>
						</div>
						<div className="flex justify-end">
							<button type="submit" className={SECONDARY_BUTTON_CLASS}>
								Replace
							</button>
						</div>
					</form>

					<div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-end sm:justify-between">
						{image.role === "gallery" ? (
							<div className="flex flex-wrap gap-2">
								{moveUpAction ? (
									<form action={moveUpAction}>
										<button type="submit" className={SECONDARY_BUTTON_CLASS}>
											Move Up
										</button>
									</form>
								) : null}
								{moveDownAction ? (
									<form action={moveDownAction}>
										<button type="submit" className={SECONDARY_BUTTON_CLASS}>
											Move Down
										</button>
									</form>
								) : null}
							</div>
						) : (
							<p className="text-xs text-slate-500">Hero image stays first and cannot be reordered.</p>
						)}
						<form action={deleteAction} className="flex flex-col items-start gap-2 sm:items-end">
							<p className="max-w-xs text-sm text-slate-500">
								Deletes this image from Blob storage and the database.
							</p>
							<button type="submit" className={DANGER_BUTTON_CLASS}>
								Delete
							</button>
						</form>
					</div>
				</div>
			</div>
		</article>
	)
}

function ProductImageUploadForm({
	categorySlug,
	productSlug,
	returnTo,
}: {
	categorySlug: string
	productSlug: string
	returnTo: string
}) {
	return (
		<form
			action={uploadProductImageAction}
			className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
		>
			<div>
				<h3 className="text-base font-semibold text-slate-950">Upload New Images</h3>
				<p className="mt-1 text-sm text-slate-600">
					Select one or more JPG, PNG, WebP, or AVIF images. Max size: 8 MB per image.
				</p>
			</div>

			<input type="hidden" name="categorySlug" value={categorySlug} />
			<input type="hidden" name="productSlug" value={productSlug} />
			<input type="hidden" name="returnTo" value={returnTo} />

			<div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_160px_minmax(0,1fr)_auto] lg:items-end">
				<label className="space-y-2">
					<span className="text-sm font-semibold text-slate-800">Files</span>
					<input
						name="files"
						type="file"
						accept="image/jpeg,image/png,image/webp,image/avif"
						multiple
						required
						className={FIELD_CLASS}
					/>
				</label>
				<label className="space-y-2">
					<span className="text-sm font-semibold text-slate-800">Role</span>
					<select name="role" defaultValue="gallery" className={FIELD_CLASS}>
						<option value="gallery">Gallery</option>
						<option value="hero">Hero (single file only)</option>
					</select>
				</label>
				<label className="space-y-2">
					<span className="text-sm font-semibold text-slate-800">Alt text</span>
					<input name="alt" className={FIELD_CLASS} />
				</label>
				<button type="submit" className={BUTTON_CLASS}>
					Upload
				</button>
			</div>
		</form>
	)
}
