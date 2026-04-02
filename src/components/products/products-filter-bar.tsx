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
	return (
		<div className="border-b border-slate-200 pb-6">
			{query ? (
				<p className="mb-3 text-sm text-slate-600">
					Refine by family below. Search is already applied to the list.
				</p>
			) : null}

			<div
				className="flex flex-wrap gap-2"
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
							className={`font-heading rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 ${
								isActive
									? "border-red-600 bg-red-600 text-white"
									: isDisabled
										? "border-slate-200 bg-slate-100 text-slate-400"
										: "border-slate-300 bg-white text-slate-800 hover:border-red-300 hover:bg-red-50/60"
							}`}
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
