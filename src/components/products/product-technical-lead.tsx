import Link from "next/link"

import type { Product, ProductSpec } from "@/lib/cms/types"

interface ProductTechnicalLeadProps {
	product: Product
}

function SpecTable({ rows }: { rows: ProductSpec[] }) {
	if (!rows.length) return null
	return (
		<div className="border-4 border-slate-900 bg-white shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
			<table className="w-full text-left text-sm sm:text-base">
				<tbody>
					{rows.map((spec, index) => (
						<tr
							key={`${spec.label}-${index}`}
							className="border-b-2 border-slate-900 last:border-b-0 transition-colors hover:bg-amber-50"
						>
							<th
								scope="row"
								className="w-[40%] border-r-2 border-slate-900 bg-slate-100 px-6 py-5 font-black uppercase tracking-wide text-slate-900 sm:w-1/3 sm:px-8"
							>
								{spec.label}
							</th>
							<td className="px-6 py-5 font-bold text-slate-800 sm:px-8">{spec.value}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export function ProductTechnicalLead({ product }: ProductTechnicalLeadProps) {
	const additional = product.additionalInfo ?? []
	const hasContent =
		product.specs.length > 0 || product.features.length > 0 || additional.length > 0
	if (!hasContent) return null

	const ctaLabel = product.ctaLabel?.trim() || "Request specifications"

	return (
		<section
			id="specs"
			className="mx-auto mt-12 w-full max-w-7xl scroll-mt-32 px-4 sm:px-6 lg:mt-16 lg:px-8"
			aria-labelledby="product-technical-lead-heading"
		>
			<div className="mb-8 border-b-2 border-slate-900 pb-4 text-center">
				<h2
					id="product-technical-lead-heading"
					className="text-3xl font-black tracking-tight text-slate-900"
				>
					Technical specifications
				</h2>
				<p className="mt-3 max-w-2xl mx-auto text-sm font-medium text-slate-600 sm:text-base">
					Product details at a glance. Need a formal quote or custom configuration?
				</p>
			</div>

			<div className="flex flex-col gap-10">
				{product.specs.length > 0 && (
					<div>
						<h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
							Product details
						</h3>
						<SpecTable rows={product.specs} />
					</div>
				)}

				{product.features.length > 0 && (
					<div>
						<h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
							Features
						</h3>
						<ul className="flex flex-col gap-2 border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0_0_rgba(15,23,42,1)] sm:p-8">
							{product.features.map((feature) => (
								<li
									key={feature}
									className="flex gap-3 text-base font-medium leading-relaxed text-slate-800"
								>
									<span className="text-amber-500 shrink-0">▪</span>
									{feature}
								</li>
							))}
						</ul>
					</div>
				)}

				{additional.length > 0 && (
					<div>
						<h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
							Additional information
						</h3>
						<SpecTable rows={additional} />
					</div>
				)}

				<div className="flex flex-wrap justify-center gap-3 pt-2">
					<Link
						href="#enquiry"
						className="inline-flex h-12 items-center justify-center bg-amber-500 px-8 text-[0.8rem] font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-amber-400 hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
					>
						{ctaLabel}
					</Link>
				</div>
			</div>
		</section>
	)
}

export function productHasTechnicalLead(product: Product): boolean {
	const additional = product.additionalInfo ?? []
	return (
		product.specs.length > 0 || product.features.length > 0 || additional.length > 0
	)
}
