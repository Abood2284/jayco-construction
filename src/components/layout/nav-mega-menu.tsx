"use client";

import { useMemo, useState } from "react"
import Link from "next/link"
import type { Product, ProductCategory } from "@/lib/cms/types"

interface NavMegaMenuProps {
	open: boolean
	onClose: () => void
	categories: ProductCategory[]
	featuredProducts: Product[]
}

function NavMegaMenu({ open, onClose, categories, featuredProducts }: NavMegaMenuProps) {
	const [activeSlug, setActiveSlug] = useState<string | null>(categories[0]?.slug ?? null)

	const categoryEntries = useMemo(
		() =>
			categories.map((category) => ({
				category,
				products: featuredProducts.filter((product) => category.featuredProductSlugs.includes(product.slug)),
			})),
		[categories, featuredProducts],
	)

	const activeEntry =
		categoryEntries.find((entry) => entry.category.slug === activeSlug) ?? categoryEntries[0] ?? null

	if (!open || !categoryEntries.length || !activeEntry) return null

	return (
		<div className="absolute left-1/2 top-full z-40 w-[min(960px,100vw-2rem)] -translate-x-1/2 pt-4">
			<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-2xl shadow-slate-900/10">
				<div className="flex min-h-[440px] max-h-[min(540px,80vh)]">
					{/* Left Sidebar - Categories */}
					<div className="flex w-1/3 flex-col border-r border-slate-100 bg-slate-50/80 px-4 py-6">
						<div className="mb-4 shrink-0 px-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
							Capabilities & Systems
						</div>
						<ul className="flex-1 space-y-1.5 overflow-y-auto text-sm">
							{categoryEntries.map((entry) => (
								<li key={entry.category.slug}>
									<Link
										href={`/products/${entry.category.slug}`}
										onMouseEnter={() => setActiveSlug(entry.category.slug)}
										onClick={onClose}
										className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
											activeEntry.category.slug === entry.category.slug
												? "bg-amber-500 text-slate-950 font-bold shadow-md"
												: "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
										}`}
									>
										<span>{entry.category.name}</span>
										<svg 
											viewBox="0 0 24 24" 
											className={`h-4 w-4 transition-transform ${
												activeEntry.category.slug === entry.category.slug 
													? "translate-x-0 opacity-100 text-slate-900" 
													: "-translate-x-2 opacity-0 text-amber-500 group-hover:translate-x-0 group-hover:opacity-100"
											}`} 
											aria-hidden="true"
										>
											<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</Link>
								</li>
							))}
						</ul>
						<div className="mt-6 shrink-0 px-2">
							<Link
								href="/products"
								onClick={onClose}
								className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-600 transition hover:border-amber-500 hover:text-amber-600 shadow-sm"
							>
								View All Products
							</Link>
						</div>
					</div>

					{/* Right Content - Products */}
					<div className="flex w-2/3 flex-col bg-white px-8 py-6">
						<div className="mb-6 flex shrink-0 items-baseline justify-between gap-4 border-b border-slate-100 pb-4">
							<div>
								<h3 className="text-lg font-bold text-slate-900">
									{activeEntry.category.name}
								</h3>
								<p className="mt-1 line-clamp-2 text-sm text-slate-500">{activeEntry.category.intro}</p>
							</div>
							<Link
								href={`/products/${activeEntry.category.slug}`}
								onClick={onClose}
								className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
							>
								Explore Category
							</Link>
						</div>

						<div className="flex-1 overflow-y-auto">
							<div className="grid grid-cols-2 gap-4 pb-1">
								{activeEntry.products.map((product) => (
									<Link
										key={product.slug}
										href={`/products/${product.categorySlug}/${product.slug}`}
										onClick={onClose}
										className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400 hover:bg-white hover:shadow-lg"
									>
										{/* Top section */}
										<div className="mb-3 flex items-start justify-between gap-2">
											<span className="inline-flex rounded-md bg-amber-100 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-amber-800">
												Featured
											</span>
											<div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-white">
												<svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
													<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</div>
										</div>
										<div className="mb-1.5 text-sm font-bold text-slate-900 transition-colors group-hover:text-amber-600">
											{product.name}
										</div>
										<p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{product.description}</p>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export { NavMegaMenu }
