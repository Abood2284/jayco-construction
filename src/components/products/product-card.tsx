import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/cms/types"

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<article className="group relative overflow-hidden border-2 border-slate-900 bg-white shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(245,158,11,1)] hover:border-amber-500">
			<div className="relative aspect-3/2 sm:aspect-4/3 overflow-hidden bg-slate-100 border-b-2 border-slate-900">
				<Image
					src={product.heroImages[0].src}
					alt={product.heroImages[0].alt}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-105"
					sizes="(max-width: 640px) 50vw, (max-width: 768px) 100vw, 33vw"
				/>
				<span className="hidden sm:inline-block absolute left-3 top-3 border-2 border-amber-500 bg-slate-900 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white">
					{product.categorySlug.replace(/-/g, " ")}
				</span>
			</div>
			<div className="p-3 sm:p-5">
				<h3 className="mb-1 sm:mb-2 text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 group-hover:text-amber-600">
					<Link href={`/products/${product.categorySlug}/${product.slug}`} className="before:absolute before:inset-0 block">
						{product.name}
					</Link>
				</h3>
				<p className="mb-4 line-clamp-2 text-sm font-medium text-slate-600 hidden sm:block">{product.description}</p>
				<div
					className="hidden sm:inline-flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-[0.18em] text-slate-900 transition group-hover:text-amber-600"
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
