import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import type { Product, ProductCategory, SiteSettings } from "@/lib/cms/types"
import { buildHeroSpotlights } from "@/lib/content/hero-spotlights"
import { HOMEPAGE_HERO_GALLERY_SLIDES } from "@/lib/content/homepage-gallery"
import { buildHomepageHeroContent } from "@/lib/content/homepage"
import { HeroGalleryCarousel } from "@/components/sections/hero-gallery-carousel"
import { HeroProductSpotlights } from "@/components/sections/hero-product-spotlights"

interface HeroSectionProps {
	settings: SiteSettings
	products: Product[]
	categories: ProductCategory[]
}

export function HeroSection({ settings, products, categories }: HeroSectionProps) {
	const content = buildHomepageHeroContent(settings, products)
	const spotlights = buildHeroSpotlights(products, categories)

	return (
		<section className="relative w-full max-w-full min-w-0 touch-pan-y overflow-x-clip bg-slate-950 pb-3 sm:pb-5">
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)",
					backgroundSize: "72px 72px",
					maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.18))",
				}}
			/>
			<div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-rose-600/14 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 -bottom-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

			<HeroGalleryCarousel slides={HOMEPAGE_HERO_GALLERY_SLIDES} />

			<div className="relative mx-auto min-w-0 max-w-7xl px-4 lg:px-6">
				<div className="mb-5 flex flex-col gap-5 sm:mb-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
					<div className="min-w-0 max-w-3xl">
						<p className="font-heading mb-3 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-rose-300 sm:tracking-[0.22em]">
							<span className="block h-px w-8 bg-rose-400/80" aria-hidden />
							{content.eyebrow}
						</p>
						<h1 className="text-[clamp(1.65rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white text-balance">
							{content.title}
						</h1>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
						<div className="font-body inline-flex w-fit items-center gap-1.5 rounded-full border border-white/12 bg-white/4 px-2 py-1 text-[0.625rem] font-medium leading-tight text-slate-200 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
							<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-400/15 text-rose-300 sm:h-6 sm:w-6">
								<CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
							</span>
							<span>{settings.yearsInBusiness} years in business</span>
						</div>
						<Link
							href="/products"
							className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-rose-300 underline-offset-4 transition-colors hover:text-rose-200 hover:underline"
						>
							Full catalog
						</Link>
					</div>
				</div>

				<HeroProductSpotlights spotlights={spotlights} />
			</div>
		</section>
	)
}
