import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/cms/types"

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<article className="group overflow-hidden rounded-2xl border-t-4 border-t-amber-500 border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
			<div className="relative aspect-4/3 overflow-hidden bg-slate-100">
				<Image
					src={product.heroImages[0].src}
					alt={product.heroImages[0].alt}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-105"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
				<span className="absolute left-3 top-3 rounded-xl bg-slate-900/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-amber-400 backdrop-blur-sm">
					{product.categorySlug.replace(/-/g, " ")}
				</span>
			</div>
			<div className="p-5">
				<h3 className="mb-2 text-base font-semibold text-slate-900 group-hover:text-amber-600">
					<Link href={`/products/${product.categorySlug}/${product.slug}`}>{product.name}</Link>
				</h3>
				<p className="mb-4 line-clamp-2 text-sm text-slate-500">{product.description}</p>
				<Link
					href={`/products/${product.categorySlug}/${product.slug}`}
					className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-700 transition group-hover:text-amber-600"
				>
					View details
					<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
						<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</Link>
			</div>
		</article>
	)
}
