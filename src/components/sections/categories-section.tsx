import Image from "next/image"
import Link from "next/link"
import type { ProductCategory } from "@/lib/cms/types"

interface CategoriesSectionProps {
	categories: ProductCategory[]
}

function ArrowRight() {
	return (
		<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
			<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
	const featured = categories[0]

	if (!featured) return null

	return (
		<section className="bg-slate-50 py-20 lg:py-28">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				{/* Section header */}
				<div className="mb-14 flex w-full flex-col items-start text-left">
					<p className="mb-4 inline-flex items-center gap-2 self-start text-[0.65rem] font-bold uppercase tracking-[0.22em] text-amber-700">
						<span className="block h-px w-6 shrink-0 bg-amber-700" />
						JAYCO Core Capability
					</p>
					<h2 className="mb-6 w-full text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight text-slate-900">
						Comprehensive Material Handling <br className="hidden sm:block" />
						&amp; Lifting Solutions
					</h2>
					<p className="w-full max-w-none text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
						From safe loading and unloading to shifting heavy materials across multiple floors, our custom-built equipment is manufactured using high-quality raw materials for maximum corrosion resistance and longevity.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{categories.map((category, idx) => {
						const mobileHiddenClass = idx > 2 ? "hidden md:flex" : "flex";

						return (
							<Link
								key={category.slug}
								href={`/products/${category.slug}`}
								className={`group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-900 shadow-md transition-shadow hover:shadow-lg ${mobileHiddenClass}`}
							>
								<div className="absolute inset-0 z-0 bg-slate-100">
									<Image
										src={category.heroImage.src}
										alt={category.heroImage.alt}
										fill
										className="max-w-full object-cover transition-transform duration-700 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>
									<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(60%,220px)] bg-linear-to-t from-slate-950/90 to-transparent" aria-hidden />
									<div className="pointer-events-none absolute inset-0 z-10 transition-colors group-hover:bg-amber-500/10" />
								</div>
								
								<div className="absolute inset-0 z-20 flex flex-col justify-end p-5 lg:p-6">
									<h3 className="mb-2 text-sm font-semibold leading-tight tracking-tight text-white sm:text-base lg:text-lg">
										{category.name}
									</h3>

									<p className="mb-4 line-clamp-3 text-[0.65rem] font-medium leading-relaxed text-slate-300 sm:text-xs lg:text-sm">
										{category.intro}
									</p>

									<div className="mt-auto flex items-center justify-between">
										<span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-amber-400 transition-all group-hover:gap-2 group-hover:text-amber-300">
											View category <ArrowRight />
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
				
				<div className="mt-16 flex justify-center">
					<Link
						href="/products"
						className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-8 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50"
					>
						View full product catalog
						<ArrowRight />
					</Link>
				</div>
			</div>
		</section>
	)
}
