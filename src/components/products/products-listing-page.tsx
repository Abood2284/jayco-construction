import Link from "next/link"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProductsCatalog } from "@/components/products/products-catalog"
import { ProductsSupportCta } from "@/components/products/products-support-cta"
import type { Product, ProductCategory } from "@/lib/cms/types"

interface ProductsListingPageProps {
	categories: ProductCategory[]
	products: Product[]
	totalCatalogProducts: number
	query?: string
	supportPhone: string
}

export function ProductsListingPage({
	categories,
	products,
	totalCatalogProducts,
	query,
	supportPhone,
}: ProductsListingPageProps) {
	return (
		<main className="flex min-h-screen flex-col">
			<section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 px-4 pb-20 pt-32 lg:px-6 lg:pb-24 lg:pt-40">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.05]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 42px,#fff 42px,#fff 43px),repeating-linear-gradient(90deg,transparent,transparent 42px,#fff 42px,#fff 43px)",
					}}
				/>
				<div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
				<div className="pointer-events-none absolute -right-16 top-12 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

				<div className="relative mx-auto max-w-6xl">
					<div className="mb-6">
						<Breadcrumbs
							items={[
								{ name: "Home", path: "/" },
								{ name: "Products", path: "/products" },
							]}
						/>
					</div>

					<div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,24rem)] lg:items-end">
						<div className="max-w-3xl">
							<p className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-amber-400">
								<span className="h-px w-8 bg-amber-400/90" aria-hidden="true" />
								Product Catalog
							</p>
							<h1 className="mt-4 text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.02] tracking-tight text-white">
								Industrial lifting and material handling products
							</h1>
							<p className="mt-5 max-w-[58ch] text-base leading-relaxed text-slate-300 lg:text-lg">
								Browse Jayco&apos;s product range by family, narrow the catalog quickly, compare relevant
								equipment at a glance, and move into the right product page or enquiry path without
								friction.
							</p>

							{query && (
								<div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100">
									<span>Search active: &quot;{query}&quot;</span>
									<Link href="/products" className="font-semibold text-white underline underline-offset-4">
										Reset search
									</Link>
								</div>
							)}
						</div>

						<div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
							<div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
									Product families
								</p>
								<p className="mt-3 text-3xl font-semibold text-white">{categories.length}</p>
							</div>
							<div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
									Catalog entries
								</p>
								<p className="mt-3 text-3xl font-semibold text-white">{totalCatalogProducts}</p>
							</div>
							<div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
									Need support?
								</p>
								<Link
									href="/contact"
									className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-white transition hover:text-amber-300"
								>
									Request product guidance
									<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
										<path
											d="M5 12h14M13 6l6 6-6 6"
											fill="none"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
										/>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-slate-50 py-10 lg:py-14">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="space-y-10 lg:space-y-12">
						<ProductsCatalog categories={categories} products={products} query={query} />
						<ProductsSupportCta
							productCount={totalCatalogProducts}
							categoryCount={categories.length}
							phone={supportPhone}
						/>
					</div>
				</div>
			</section>
		</main>
	)
}
