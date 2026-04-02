import Link from "next/link"

interface ProductsSupportCtaProps {
	productCount: number
	categoryCount: number
	phone: string
}

function toTelHref(phone: string) {
	return `tel:${phone.replace(/[^+\d]/g, "")}`
}

export function ProductsSupportCta({
	productCount,
	categoryCount,
	phone,
	}: ProductsSupportCtaProps) {
	return (
		<section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.9)] sm:px-8 sm:py-10">
			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
				<div>
					<p className="text-xs font-semibold tracking-wide text-red-300">Need help choosing?</p>
					<h2 className="mt-3 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold tracking-tight text-white">
						Short-list the right system before you request a final quote.
					</h2>
					<p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
						If you know the load, lift height, span, or plant constraint but not the exact product name,
						Jayco&apos;s team can direct you to the right family and next product page.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
					<Link
						href="/contact"
						className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
					>
						Request quote
					</Link>
					<a
						href={toTelHref(phone)}
						className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-red-400/60 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
					>
						Call Jayco
					</a>
				</div>
			</div>

			<div className="mt-8 grid gap-3 border-t border-slate-800 pt-6 sm:grid-cols-3">
				<div className="rounded-2xl border border-slate-800 bg-white/5 px-4 py-4">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
						Product families
					</p>
					<p className="mt-2 text-2xl font-semibold text-white">{categoryCount}</p>
				</div>
				<div className="rounded-2xl border border-slate-800 bg-white/5 px-4 py-4">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
						Catalog entries
					</p>
					<p className="mt-2 text-2xl font-semibold text-white">{productCount}</p>
				</div>
				<div className="rounded-2xl border border-slate-800 bg-white/5 px-4 py-4">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
						Direct support
					</p>
					<p className="mt-2 text-lg font-semibold text-white">{phone}</p>
				</div>
			</div>
		</section>
	)
}
