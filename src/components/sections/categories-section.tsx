import Image from "next/image"
import Link from "next/link"
import type { ProductCategory } from "@/lib/cms/types"

interface CategoriesSectionProps {
	categories: ProductCategory[]
}

function ArrowRight() {
	return (
		<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
			<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
	const [featured, ...rest] = categories

	if (!featured) return null

	return (
		<section className="bg-slate-50 py-20 lg:py-28">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				{/* Section header */}
				<div className="mb-12 flex flex-col items-center text-center">
					<p className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-amber-600">
						<span className="block h-px w-6 bg-amber-500" />
						What We Build
						<span className="block h-px w-6 bg-amber-500" />
					</p>
					<h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-slate-900 leading-tight">
						Heavy Industrial <br className="hidden sm:block" />
						Product Categories
					</h2>
					<p className="mt-4 max-w-[50ch] text-slate-500 text-sm sm:text-base">
						Engineered to exact specifications, our manufacturing and fabrication services cover the core infrastructure of the industry.
					</p>
				</div>

				{/* Bento Grid */}
				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[160px] md:auto-rows-[220px] lg:auto-rows-[240px]">
					{categories.map((category, idx) => {
						// Hide after item 3 on mobile to prevent vertical scroll bloat
						const mobileHiddenClass = idx > 2 ? "hidden md:flex" : "flex";

						// Logic for flawless dynamic spanning based on item index to prevent white space
						let spanClass = "col-span-1";
						const modulus = idx % 5;
						
						if (modulus === 0) {
							// Large feature block
							spanClass = "col-span-2 md:col-span-2 lg:col-span-2 row-span-2";
						} else if (modulus === 1 || modulus === 2) {
							// Standard blocks next to feature
							spanClass = "col-span-1 md:col-span-1 lg:col-span-2";
						} else if (modulus === 3 || modulus === 4) {
							// Wide blocks on bottom
							spanClass = "col-span-2 md:col-span-1 lg:col-span-2"; 
						}
						
						// If it's the very last item and it's alone on its row, make it span full width safely
						const isLast = idx === categories.length - 1;
						if (isLast && (categories.length % 5 === 2 || categories.length % 5 === 4)) {
							spanClass = "col-span-2 md:col-span-2 lg:col-span-4";
						}

						const isFeatured = spanClass.includes("row-span-2");

						return (
							<Link
								key={category.slug}
								href={`/products/${category.slug}`}
								className={`group relative overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${spanClass} ${mobileHiddenClass}`}
							>
								{/* Image with Industrial Overlay */}
								<div className="absolute inset-0 z-0 bg-slate-100">
									<Image
										src={category.heroImage.src}
										alt={category.heroImage.alt}
										fill
										className={`object-cover transition-transform duration-700 max-w-full ${
											isFeatured ? "opacity-60 group-hover:scale-105" : "opacity-40 group-hover:scale-105"
										}`}
										sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>
									{/* Gradients */}
									<div className={`absolute inset-0 block bg-gradient-to-t from-slate-950/90 ${isFeatured ? "via-slate-950/40" : "via-slate-950/50"} to-transparent`} />
									{/* Subtle Border */}
									<div className="absolute inset-0 border border-slate-900/20 rounded-2xl z-10 pointer-events-none transition-colors group-hover:border-amber-500/30" />
								</div>
								
								{/* Content block */}
								<div className="absolute inset-0 z-20 flex flex-col justify-end p-5 lg:p-6">
									<h3 className={`font-black text-white leading-tight ${isFeatured ? "text-xl sm:text-2xl md:text-3xl mb-2" : "text-sm sm:text-xl mb-1.5"}`}>
										{category.name}
									</h3>
									
									{isFeatured && (
										<p className="mb-4 max-w-[40ch] text-[0.65rem] sm:text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
											{category.intro}
										</p>
									)}

									<div className="mt-auto flex items-center justify-between">
										<span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-amber-500 transition-all group-hover:text-amber-400 group-hover:gap-2">
											Explore <ArrowRight />
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
				
				<div className="mt-12 flex justify-center">
					<Link
						href="/products"
						className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:border-amber-500 hover:text-amber-500 hover:shadow-md"
					>
						View full product catalog
						<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
							<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</Link>
				</div>
			</div>
		</section>
	)
}
