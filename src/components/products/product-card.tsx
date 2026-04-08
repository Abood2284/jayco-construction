import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/cms/types"

const VISIBLE_SPEC_COUNT = 3

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const href = `/products/${product.categorySlug}/${product.slug}`
	const image = product.heroImages[0]
	const visibleSpecs = product.specs.slice(0, VISIBLE_SPEC_COUNT)
	const hasMoreSpecs = product.specs.length > VISIBLE_SPEC_COUNT

	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.1)]">
			<div className="relative aspect-square overflow-hidden bg-slate-100 lg:aspect-5/4">
				{image ? (
					<Image
						src={image.src}
						alt={image.alt}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 50vw"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
						No image
					</div>
				)}
				<div className="absolute inset-0 bg-linear-to-t from-slate-950/54 via-slate-950/8 to-transparent" />
			</div>

			<div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
				<h3 className="text-lg font-semibold leading-tight text-slate-950 lg:text-xl">
					<Link href={href} className="transition-colors hover:text-rose-700">
						{product.name}
					</Link>
				</h3>

				{visibleSpecs.length > 0 ? (
					<dl className="mt-3 flex flex-1 flex-col gap-2 text-sm text-slate-600">
						{visibleSpecs.map((spec) => (
							<div key={spec.label} className="flex flex-col gap-0.5 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
								<dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">
									{spec.label}
								</dt>
								<dd className="font-medium leading-snug text-slate-800">{spec.value}</dd>
							</div>
						))}
					</dl>
				) : (
					<div className="mt-3 flex-1" />
				)}

				{hasMoreSpecs ? (
					<Link
						href={href}
						className="mt-3 self-start text-sm font-semibold text-rose-700 underline-offset-4 transition-colors hover:text-rose-600 hover:underline"
					>
						Show more
					</Link>
				) : null}

				<div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
					<Link
						href={href}
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-rose-700 px-3 py-3 text-center text-[0.72rem] font-semibold whitespace-nowrap text-white transition-colors hover:bg-rose-600"
					>
						View Product
						<ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
					</Link>
					<Link
						href="/contact"
						className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-200 px-3 py-3 text-center text-[0.72rem] font-semibold whitespace-nowrap text-rose-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
					>
						Get Quote
					</Link>
				</div>
			</div>
		</article>
	)
}
