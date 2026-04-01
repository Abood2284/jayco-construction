import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/cms/types"
import { getProductDescriptor } from "@/components/products/catalog-utils"

interface ProductCatalogCardProps {
	product: Product
}

export function ProductCatalogCard({ product }: ProductCatalogCardProps) {
	const descriptor = getProductDescriptor(product)
	const heroImage = product.heroImages[0]

	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_26px_60px_-32px_rgba(15,23,42,0.55)]">
			<div className="relative aspect-square overflow-hidden border-b border-slate-200 bg-slate-100">
				<Image
					src={heroImage.src}
					alt={heroImage.alt}
					fill
					className="object-cover transition duration-700 group-hover:scale-105"
					sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
				/>
			</div>

			<div className="flex flex-1 flex-col p-5 sm:p-6">
				<div className="space-y-3">
					<h3 className="text-xl font-semibold tracking-tight text-slate-950">
						<Link
							href={`/products/${product.categorySlug}/${product.slug}`}
							className="transition-colors hover:text-amber-800 focus-visible:outline-none"
						>
							{product.name}
						</Link>
					</h3>
					<p className="text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">{descriptor}</p>
				</div>

				<div className="mt-auto pt-6">
					<Link
						href={`/products/${product.categorySlug}/${product.slug}`}
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-amber-700 hover:bg-amber-50 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
					>
						View Product
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
		</article>
	)
}
