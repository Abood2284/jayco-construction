import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/cms/types"
import {
	buildHomepageFlagshipContent,
	type HomepageFlagshipProduct,
} from "@/lib/content/homepage"
import { SectionCtaRow } from "@/components/sections/section-cta-row"

interface FeaturedProductsSectionProps {
	products: Product[]
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
	if (!products.length) return null

	const content = buildHomepageFlagshipContent(products)

	if (!content.featuredProducts.length) return null

	return (
		<section className="bg-(--bg) py-18 sm:py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
					<div className="max-w-3xl">
						<p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-rose-700">
							{content.eyebrow}
						</p>
						<h2 className="max-w-[18ch] text-[clamp(1.85rem,3vw,2.9rem)] font-semibold leading-tight tracking-[-0.03em] text-slate-950">
							{content.title}
						</h2>
						<p className="mt-4 max-w-[62ch] text-sm leading-7 text-slate-600 sm:text-base">
							{content.description}
						</p>
					</div>

					<div className="hidden lg:block">
						<SectionCtaRow primary={content.primaryCta} secondary={content.secondaryCta} />
					</div>
				</div>

				<div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
					{content.featuredProducts.map((product) => (
						<FlagshipProductCard key={product.href} product={product} />
					))}
				</div>

				<SectionCtaRow
					primary={content.primaryCta}
					secondary={content.secondaryCta}
					className="mt-8 border-t border-slate-200 pt-6 lg:hidden"
				/>
			</div>
		</section>
	)
}

function FlagshipProductCard({ product }: { product: HomepageFlagshipProduct }) {
	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.1)]">
			<div className="relative aspect-square overflow-hidden bg-slate-100">
				<Image
					src={product.image.src}
					alt={product.image.alt}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-105"
					sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-slate-950/54 via-slate-950/8 to-transparent" />
			</div>

			<div className="flex flex-1 flex-col p-5 sm:p-6">
				<h3 className="text-lg font-semibold leading-tight text-slate-950">
					<Link href={product.href} className="transition-colors hover:text-rose-700">
						{product.title}
					</Link>
				</h3>
				<p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{product.shortDescription}</p>

				<div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
					<Link
						href={product.href}
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-rose-700 px-3 py-3 text-center text-[0.72rem] font-semibold whitespace-nowrap text-white transition-colors hover:bg-rose-600"
					>
						View Product
						<ArrowRight className="h-4 w-4" aria-hidden />
					</Link>
					<Link
						href={product.quoteHref}
						className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-200 px-3 py-3 text-center text-[0.72rem] font-semibold whitespace-nowrap text-rose-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
					>
						Get Quote
					</Link>
				</div>
			</div>
		</article>
	)
}
