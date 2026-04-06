"use client"

import type { CategoryFilterOption } from "@/components/products/catalog-utils"
import { ALL_CATEGORIES_SLUG } from "@/components/products/catalog-utils"

interface ProductsFilterBarProps {
	options: CategoryFilterOption[]
	activeCategorySlug: string
	onSelectCategory: (slug: string) => void
	query?: string
}

export function ProductsFilterBar({
	options,
	activeCategorySlug,
	onSelectCategory,
	query,
}: ProductsFilterBarProps) {
	const pillClass = (isActive: boolean, isDisabled: boolean) =>
		`font-heading rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm disabled:cursor-not-allowed disabled:opacity-45 ${
			isDisabled
				? "border-transparent text-slate-400"
				: isActive
					? "border-transparent bg-slate-950 text-white shadow-sm"
					: "border-transparent bg-transparent text-slate-700 hover:bg-white/90 hover:text-slate-950"
		}`

	return (
		<div className="border-b border-slate-200 pb-6">
			{query ? (
				<p className="mb-3 text-sm text-slate-600">
					Refine by family below. Search is already applied to the list.
				</p>
			) : null}

			<div
				className="flex flex-wrap gap-1 rounded-2xl bg-slate-100/90 p-1 sm:gap-1"
				role="tablist"
				aria-label="Filter catalog by product family"
			>
				{options.map((option) => {
					const isActive = option.slug === activeCategorySlug
					const isDisabled = option.count === 0 && option.slug !== ALL_CATEGORIES_SLUG
					const label = option.slug === ALL_CATEGORIES_SLUG ? "All" : option.name

					return (
						<button
							key={option.slug}
							type="button"
							role="tab"
							aria-selected={isActive}
							disabled={isDisabled}
							onClick={() => onSelectCategory(option.slug)}
							className={pillClass(isActive, isDisabled)}
						>
							<span>{label}</span>
							<span className={`ml-1.5 tabular-nums ${isActive ? "text-white/90" : "text-slate-500"}`}>
								{option.count}
							</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
