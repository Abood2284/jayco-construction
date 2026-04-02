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
			<section className="relative overflow-hidden border-b-4 border-red-700 bg-slate-950 px-4 pb-14 pt-28 lg:px-6 lg:pb-16 lg:pt-36">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.06]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 42px,#fff 42px,#fff 43px),repeating-linear-gradient(90deg,transparent,transparent 42px,#fff 42px,#fff 43px)",
					}}
				/>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.1),transparent_40%)]" />

				<div className="relative mx-auto max-w-6xl">
					<div className="mb-6">
						<Breadcrumbs
							items={[
								{ name: "Home", path: "/" },
								{ name: "Products", path: "/products" },
							]}
						/>
					</div>

					<div className="max-w-3xl">
						<p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-red-300">
							<span className="h-px w-8 shrink-0 bg-red-500" aria-hidden="true" />
							Product catalog
						</p>
						<h1 className="mt-3 text-[clamp(2.1rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-white">
							Industrial lifting and material handling products
						</h1>
						<p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-slate-300 sm:text-base">
							Browse Jayco by product family, open the right datasheet, or move straight to a quote when you
							know what you need.
						</p>

						{query ? (
							<div className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1.5 text-sm text-red-100">
								<span>Search: &quot;{query}&quot;</span>
								<Link href="/products" className="font-medium text-white underline underline-offset-4 hover:text-red-100">
									Reset
								</Link>
							</div>
						) : null}
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
