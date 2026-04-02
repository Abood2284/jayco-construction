"use client"

import Link from "next/link"

interface EmptyResultsStateProps {
	title: string
	description: string
	resetLabel?: string
	onReset?: () => void
	showReset?: boolean
}

export function EmptyResultsState({
	title,
	description,
	resetLabel = "View all products",
	onReset,
	showReset = true,
}: EmptyResultsStateProps) {
	return (
		<div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-[0_18px_45px_-34px_rgba(15,23,42,0.4)] sm:px-8">
			<p className="text-xs font-semibold tracking-wide text-red-700">No matching products</p>
			<h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
			<p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
				{description}
			</p>

			<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
				{showReset && onReset && (
					<button
						type="button"
						onClick={onReset}
						className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
					>
						{resetLabel}
					</button>
				)}
				<Link
					href="/contact"
					className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-red-300 hover:bg-red-50 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
				>
					Get Product Guidance
				</Link>
			</div>
		</div>
	)
}
