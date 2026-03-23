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
	const [featured, ...rest] = categories

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

				{/* Bento Grid */}
				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[220px] lg:auto-rows-[240px]">
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
								className={`group relative overflow-hidden border-2 border-slate-900 bg-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)] ${spanClass} ${mobileHiddenClass}`}
							>
								{/* Image — full opacity; readability via bottom gradient + yellow titles */}
								<div className="absolute inset-0 z-0 bg-slate-100">
									<Image
										src={category.heroImage.src}
										alt={category.heroImage.alt}
										fill
										className="max-w-full object-cover transition-transform duration-700 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>
									<div
										className={`pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/90 to-transparent ${
											isFeatured ? "h-[min(55%,320px)]" : "h-[min(65%,200px)]"
										}`}
										aria-hidden
									/>
									<div className="pointer-events-none absolute inset-0 z-10 transition-colors group-hover:bg-amber-500/10" />
								</div>
								
								{/* Content block */}
								<div className="absolute inset-0 z-20 flex flex-col justify-end p-5 lg:p-6">
									<h3
										className={`w-fit max-w-full bg-yellow-400 px-2 py-1 font-black uppercase leading-tight tracking-tight text-slate-900 ${
											isFeatured
												? "mb-3 text-xl sm:text-2xl md:text-3xl sm:px-3 sm:py-1.5"
												: "mb-2 text-base sm:text-xl sm:px-2.5 sm:py-1"
										}`}
									>
										{category.name}
									</h3>
									
									{isFeatured && (
										<p className="mb-5 max-w-[45ch] text-[0.65rem] sm:text-sm text-slate-300 font-medium leading-relaxed line-clamp-3">
											{category.intro}
										</p>
									)}

									<div className="mt-auto flex items-center justify-between">
										<span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-amber-500 transition-all group-hover:text-amber-400 group-hover:gap-2">
											Explore Machinery <ArrowRight />
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
						className="inline-flex h-14 items-center justify-center gap-2 border-2 border-slate-900 bg-white px-8 text-sm font-bold uppercase tracking-wider text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all hover:-translate-y-1 hover:bg-slate-50 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)]"
					>
						View Full Product Catalog
						<ArrowRight />
					</Link>
				</div>
			</div>
		</section>
	)
}
