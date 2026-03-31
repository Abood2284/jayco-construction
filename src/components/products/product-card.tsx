import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/cms/types"

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<article className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
			<div className="relative aspect-3/2 overflow-hidden border-b border-slate-200 bg-slate-100 sm:aspect-4/3">
				<Image
					src={product.heroImages[0].src}
					alt={product.heroImages[0].alt}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-105"
					sizes="(max-width: 640px) 50vw, (max-width: 768px) 100vw, 33vw"
				/>
				<span className="absolute left-3 top-3 hidden rounded-md border border-slate-200/80 bg-slate-950/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:inline-block lg:hidden">
					{product.categorySlug.replace(/-/g, " ")}
				</span>
			</div>
			<div className="p-3 sm:p-5">
				<h3 className="mb-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-amber-800 sm:mb-2 sm:text-base">
					<Link href={`/products/${product.categorySlug}/${product.slug}`} className="before:absolute before:inset-0 block">
						{product.name}
					</Link>
				</h3>
				<p className="mb-4 line-clamp-2 text-sm font-medium text-slate-600 hidden sm:block">{product.description}</p>
				<div
					className="hidden items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-600 transition-colors group-hover:text-amber-800 sm:inline-flex"
				>
					View details
					<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
						<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
					</svg>
				</div>
			</div>
		</article>
	)
}
