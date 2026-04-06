import Link from "next/link"
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
			<section className="relative overflow-hidden border-b border-red-700/80 bg-slate-950 px-4 pb-8 pt-6 sm:pb-10 sm:pt-8 lg:px-6 lg:pb-12 lg:pt-10">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.06]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 42px,#fff 42px,#fff 43px),repeating-linear-gradient(90deg,transparent,transparent 42px,#fff 42px,#fff 43px)",
					}}
				/>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08),transparent_42%)]" />

				<div className="relative mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
					<h1 className="font-heading text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[clamp(1.75rem,3vw,2.25rem)]">
						Products
					</h1>
					{query ? (
						<div className="inline-flex w-fit flex-wrap items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1.5 text-sm text-red-100">
							<span className="max-w-[min(100%,280px)] truncate" title={query}>
								&quot;{query}&quot;
							</span>
							<Link
								href="/products"
								className="shrink-0 font-medium text-white underline underline-offset-4 hover:text-red-50"
							>
								Reset
							</Link>
						</div>
					) : null}
				</div>
			</section>

			<section className="border-t border-slate-100 bg-slate-50/70 py-8 sm:py-10 lg:py-14">
				<div className="mx-auto max-w-7xl px-4 lg:px-6">
					<div className="space-y-8 lg:space-y-10">
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
