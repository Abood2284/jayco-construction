import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ProductCategory } from "@/lib/cms/types"
import { CategoriesCarousel } from "@/components/sections/categories-carousel"

interface CategoriesSectionProps {
	categories: ProductCategory[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
	if (!categories.length) return null

	return (
		<section className="bg-(--bg) py-18 sm:py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="mb-10 max-w-3xl">
					<p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-rose-700">
						JAYCO Core Capability
					</p>
					<h2 className="text-[clamp(1.85rem,3vw,2.9rem)] font-semibold leading-tight tracking-[-0.03em] text-slate-950">
						Comprehensive Material Handling{" "}
						<br className="hidden sm:block" />
						&amp; Lifting Solutions
					</h2>
					<p className="mt-4 max-w-[62ch] text-sm leading-7 text-slate-600 sm:text-base">
						From safe loading and unloading to shifting heavy materials across multiple floors, our custom-built equipment is manufactured using high-quality raw materials for maximum corrosion resistance and longevity.
					</p>
				</div>

				<CategoriesCarousel>
					{categories.map((category) => (
						<article
							key={category.slug}
							data-carousel-card
							className="group flex shrink-0 snap-start flex-col transition-transform duration-300 hover:-translate-y-1 flex-[0_0_min(18rem,calc(100vw-2.5rem))] sm:flex-[0_0_calc((100%-1.25rem)/2)] lg:flex-[0_0_calc((100%-2.5rem)/3)] xl:flex-[0_0_calc((100%-3.75rem)/4)]"
						>
							{/* Same bg as section: invisible frame that holds image + CTA with consistent spacing */}
							<div className="flex w-full min-w-0 flex-col gap-4 rounded-[1.75rem] bg-(--bg) p-2 sm:p-2.5">
								<Link
									href={`/products/${category.slug}`}
									className="relative block aspect-square w-full shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-[box-shadow,transform] duration-300 group-hover:shadow-[0_24px_50px_rgba(15,23,42,0.1)]"
								>
									<Image
										src={category.heroImage.src}
										alt={category.heroImage.alt}
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
										sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
									/>
									<div
										className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-t from-slate-950/54 via-slate-950/8 to-transparent"
										aria-hidden
									/>
								</Link>

								<Link
									href={`/products/${category.slug}`}
									className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-rose-700 px-3 py-2.5 text-center text-[0.72rem] font-semibold leading-tight text-white shadow-md transition-colors hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
								>
									<span className="line-clamp-2 min-w-0 flex-1 text-balance">{category.name}</span>
									<ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
								</Link>
							</div>
						</article>
					))}
				</CategoriesCarousel>

				<div className="mt-10 flex justify-center sm:mt-12">
					<Link
						href="/products"
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-8 text-sm font-semibold text-rose-800 shadow-sm transition-colors hover:border-rose-300 hover:bg-rose-50"
					>
						View full product catalog
						<ArrowRight className="h-4 w-4" aria-hidden />
					</Link>
				</div>
			</div>
		</section>
	)
}
