import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/cms/types"

interface FeaturedProductsSectionProps {
	products: Product[]
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
	if (!products.length) return null

	return (
		<section className="bg-white py-20 lg:py-28">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				{/* Section header */}
				<div className="mb-12 flex items-end justify-between gap-6 border-b border-slate-200 pb-6">
					<div>
						<p className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-600">
							<span className="block h-px w-6 bg-amber-500" />
							Catalog Highlights
						</p>
						<h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-slate-900 leading-tight">
							Featured Systems
						</h2>
					</div>
					<Link
						href="/products"
						className="hidden group items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-600 transition hover:text-amber-600 sm:flex"
					>
						Explore Full Range
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-amber-100">
							<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
								<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</span>
					</Link>
				</div>

				{/* Standard Responsive Grid */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{products.slice(0, 3).map((product) => (
						<article
							key={product.slug}
							className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-400"
						>
							<div className="relative aspect-[3/2] overflow-hidden bg-slate-100 p-5 flex flex-col justify-end sm:aspect-4/3 lg:p-6">
								<Image
									src={product.heroImages[0].src}
									alt={product.heroImages[0].alt}
									fill
									className="object-cover transition-transform duration-700 group-hover:scale-105"
									sizes="(max-width: 1024px) 80vw, 33vw"
								/>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" />
							</div>
							
							<div className="flex flex-1 flex-col p-5 lg:p-8">
								<h3 className="mb-2 text-base font-black text-slate-900 transition-colors group-hover:text-amber-600 lg:mb-3 lg:text-lg">
									<Link href={`/products/${product.categorySlug}/${product.slug}`} className="before:absolute before:inset-0">
										{product.name}
									</Link>
								</h3>
								<p className="mb-5 line-clamp-2 flex-1 text-xs text-slate-500 leading-relaxed lg:mb-6 lg:text-sm">{product.description}</p>
								
                                <div className="mt-auto flex justify-end">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-amber-500 group-hover:text-white lg:h-10 lg:w-10">
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                                            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
								</div>
							</div>
						</article>
					))}
				</div>
                
                <div className="mt-8 flex justify-center sm:hidden">
                    <Link
						href="/products"
						className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:border-amber-500 hover:text-amber-600"
					>
						Full Catalog
						<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
							<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</Link>
                </div>
			</div>
		</section>
	)
}
