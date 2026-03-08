import Image from "next/image"
import Link from "next/link"
import type { GalleryCategory } from "@/lib/cms/types"

interface GalleryTeaserSectionProps {
	galleryCategories: GalleryCategory[]
}

export function GalleryTeaserSection({ galleryCategories }: GalleryTeaserSectionProps) {
	const allImages = galleryCategories.flatMap((cat) =>
		cat.images.map((img) => ({ ...img, categoryName: cat.name, categorySlug: cat.slug })),
	)

	const displayImages = allImages.slice(0, 4)

	if (!displayImages.length) return null

	return (
		<section className="bg-slate-50 py-20">
			<div className="mx-auto max-w-6xl px-4 lg:px-6">
				{/* Section header */}
				<div className="mb-10 flex items-baseline justify-between gap-4">
					<div>
						<p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-600">
							Real Work
						</p>
						<h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-slate-900">
							Project Gallery
						</h2>
					</div>
					<Link
						href="/gallery"
						className="hidden items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:text-amber-600 sm:inline-flex"
					>
						View all
						<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
							<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</Link>
				</div>

				{/* Responsive Grid */}
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 lg:auto-rows-[200px] lg:gap-5">
					{displayImages.map((image, idx) => (
						<Link
							key={`${image.categorySlug}-${idx}`}
							href={`/gallery/${image.categorySlug}`}
							className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl ${
								idx === 0 ? "col-span-2 aspect-[16/9] sm:aspect-square lg:col-span-2 lg:row-span-2 lg:aspect-auto" : "col-span-1 aspect-square lg:aspect-auto"
							}`}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 1024px) 70vw, 25vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
							<div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:p-6">
								<p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-amber-500 drop-shadow-md">
									{image.categoryName}
								</p>
								<p className="text-sm font-medium text-white drop-shadow-md lg:text-base">{image.alt}</p>
							</div>
						</Link>
					))}
				</div>

				{/* CTA */}
				<div className="mt-6 flex justify-center">
					<Link
						href="/gallery"
						className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm transition hover:border-amber-400 hover:text-amber-600"
					>
						Explore the full gallery
						<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
							<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</Link>
				</div>
			</div>
		</section>
	)
}
