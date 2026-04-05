import Image from "next/image"
import Link from "next/link"
import type { GalleryCategory } from "@/lib/cms/types"
import { HOMEPAGE_HERO_GALLERY_IMAGES } from "@/lib/content/homepage-gallery"

interface GalleryTeaserSectionProps {
	galleryCategories: GalleryCategory[]
}

export function GalleryTeaserSection({ galleryCategories }: GalleryTeaserSectionProps) {
	void galleryCategories

	const displayImages = HOMEPAGE_HERO_GALLERY_IMAGES.map((img) => ({
		src: img.src,
		alt: img.alt,
		categoryName: img.caption,
		categorySlug: "",
	}))

	return (
		<section className="border-t border-slate-200 bg-(--bg) py-16 lg:py-24">
			<div className="mx-auto max-w-6xl px-4 lg:px-6">
				<div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-800">
							Installations &amp; projects
						</p>
						<h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-tight text-slate-900">
							Field-proven equipment in real facilities
						</h2>
						<p className="mt-2 max-w-xl text-sm font-medium text-slate-600">
							See how our systems are deployed across industrial sites—then explore the full gallery for more context.
						</p>
					</div>
					<Link
						href="/gallery"
						className="hidden shrink-0 items-center gap-1.5 rounded-md border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition-colors hover:border-red-400 hover:text-red-800 sm:inline-flex"
					>
						View all projects
						<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
							<path
								d="M5 12h14M13 6l6 6-6 6"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(200px,1fr)] lg:grid-cols-4 lg:gap-5">
					{displayImages.map((image, idx) => (
						<Link
							key={`${image.src}-${idx}`}
							href="/gallery"
							className={`group relative flex flex-col overflow-hidden rounded-2xl border border-red-200/60 bg-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all hover:border-red-400 hover:shadow-[0_24px_54px_rgba(127,29,29,0.18)] ${
								idx === 0
									? "aspect-16/10 sm:col-span-2 sm:aspect-video lg:col-span-2 lg:row-span-2 lg:min-h-[430px]"
									: "aspect-4/3 lg:min-h-[210px]"
							}`}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
							/>
							<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/65 to-slate-950/10" />
							<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/95 via-slate-950/80 to-transparent p-5 lg:p-6">
								<p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-200">
									{image.categoryName}
								</p>
								<p className="max-w-[34ch] text-base font-semibold leading-snug text-white [text-shadow:0_2px_18px_rgba(2,6,23,0.7)] lg:text-lg">
									{image.alt}
								</p>
							</div>
						</Link>
					))}
				</div>

				<div className="mt-8 flex justify-center sm:hidden">
					<Link
						href="/gallery"
						className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition-colors hover:border-red-400 hover:bg-red-50"
					>
						Explore full gallery
					</Link>
				</div>
			</div>
		</section>
	)
}
