import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/cms/types"
import { ArrowRight } from "lucide-react"

interface FeaturedProductsSectionProps {
	products: Product[]
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
	if (!products.length) return null

	// We only take the top 3, but for the mobile infinite scroll to look seamless
	// we duplicate them into a track.
	const displayProducts = products.slice(0, 3)
	const carouselTrack = [...displayProducts, ...displayProducts]

	return (
		<section className="bg-[var(--bg)] py-20 lg:py-28 overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				{/* Section header */}
				<div className="mb-14 flex flex-col items-start gap-4 border-l-4 border-amber-600 pl-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:border-l-0 sm:pl-0 sm:border-b-4 sm:border-slate-900 sm:pb-6">
					<div className="max-w-2xl">
						<p className="mb-3 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-700">
							<span className="hidden sm:block h-px w-6 bg-amber-700" />
							Engineered For Reliability
						</p>
						<h2 className="mb-4 text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-slate-900 leading-tight">
							Flagship Industrial Equipment
						</h2>
						<p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
							Our most trusted systems, from robust electric hoists to heavy-duty hydraulic lifts, are designed and rigorously tested to withstand the harshest industrial environments and deliver continuous performance.
						</p>
					</div>
					<Link
						href="/products"
						className="hidden sm:inline-flex h-12 items-center justify-center gap-2 bg-slate-900 px-6 text-xs font-bold uppercase tracking-wider !text-white shadow-[4px_4px_0_0_rgba(245,158,11,1)] transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-[6px_6px_0_0_rgba(245,158,11,1)] shrink-0"
					>
						Explore Full Range
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				{/* Desktop view: Standard 3-col Grid */}
				<div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayProducts.map((product) => (
						<ProductCard key={product.slug} product={product} />
					))}
				</div>

				{/* Mobile view: Auto-scrolling infinite carousel */}
				<div className="sm:hidden -mx-4 overflow-hidden relative">
					{/* Gradient Masks for smooth fade on edges */}
					<div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
					<div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />
					
					<div className="flex w-max" style={{ animation: "scrollCarousel 30s linear infinite" }}>
						{carouselTrack.map((product, idx) => (
							<div key={`${product.slug}-${idx}`} className="w-[85vw] shrink-0 pl-4 pb-2">
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>
                
                <div className="mt-10 flex border-t-2 border-slate-900 pt-6 sm:hidden">
                    <Link
						href="/products"
						className="inline-flex h-12 w-full items-center justify-center gap-2 bg-slate-900 px-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] !text-white shadow-[4px_4px_0_0_rgba(245,158,11,1)] transition-all active:translate-y-1 active:shadow-none"
					>
						View Full Catalog
						<ArrowRight className="h-4 w-4" />
					</Link>
                </div>
			</div>

			<style>{`
				@keyframes scrollCarousel {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
			`}</style>
		</section>
	)
}

function ProductCard({ product }: { product: Product }) {
	return (
		<article
			className="group relative flex h-full flex-col overflow-hidden border-2 border-slate-900 bg-white shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)]"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-slate-100 p-5 flex flex-col justify-end lg:p-6 border-b-2 border-slate-900">
				<Image
					src={product.heroImages[0].src}
					alt={product.heroImages[0].alt}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-105"
					sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-slate-950/0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-80" />
			</div>
			
			<div className="flex flex-1 flex-col p-5 bg-white lg:p-6">
				<h3 className="mb-2 text-base font-black uppercase text-slate-900 transition-colors group-hover:text-amber-600 lg:mb-3 lg:text-lg">
					<Link href={`/products/${product.categorySlug}/${product.slug}`} className="before:absolute before:inset-0">
						{product.name}
					</Link>
				</h3>
				<p className="mb-6 line-clamp-3 flex-1 text-[0.7rem] sm:text-xs font-medium text-slate-600 leading-relaxed">
					{product.description}
				</p>
				
				<div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-200">
					<span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 group-hover:text-amber-600 transition-colors">
						View Details
					</span>
					<div className="flex h-8 w-8 items-center justify-center bg-slate-100 text-slate-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
						<ArrowRight className="h-4 w-4" />
					</div>
				</div>
			</div>
		</article>
	)
}
