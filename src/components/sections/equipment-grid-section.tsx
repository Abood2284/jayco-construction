"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Product } from "@/lib/cms/types"
import { buildEquipmentGroupPills, productMatchesEquipmentGroup } from "@/lib/content/equipment-category-groups"

interface EquipmentGridSectionProps {
	products: Product[]
}

function chunkProducts(products: Product[], chunkSize: number) {
	if (chunkSize <= 0) return []

	const productGroups: Product[][] = []

	for (let index = 0; index < products.length; index += chunkSize) {
		productGroups.push(products.slice(index, index + chunkSize))
	}

	return productGroups
}

const ALL_FILTER = "all"

function EquipmentProductCard({ product }: { product: Product }) {
	const image = product.heroImages[0]

	return (
		<Link
			href={`/products/${product.categorySlug}/${product.slug}`}
			className="group flex min-h-0 flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
		>
			<div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm transition-[box-shadow,border-color,transform] duration-200 motion-reduce:transition-none group-hover:border-slate-300 group-hover:shadow-md group-hover:ring-1 group-hover:ring-slate-200/80 motion-safe:sm:group-hover:-translate-y-0.5 motion-reduce:sm:group-hover:translate-y-0">
				<div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
					{image ? (
						<Image
							src={image.src}
							alt=""
							fill
							sizes="(max-width: 640px) 42vw, (max-width: 1024px) 20vw, 16vw"
							className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
						/>
					) : (
						<div className="absolute inset-0 bg-slate-200/90" aria-hidden />
					)}
					<div
						className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/15 via-transparent to-transparent opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 motion-reduce:group-hover:opacity-0"
						aria-hidden
					/>
				</div>
			</div>
			<p className="m-0 line-clamp-2 text-left text-xs font-semibold leading-tight tracking-tight text-slate-700 underline decoration-transparent decoration-2 underline-offset-4 transition-colors motion-reduce:transition-none group-hover:text-slate-900 group-hover:decoration-slate-300 sm:text-sm">
				{product.name}
			</p>
		</Link>
	)
}

export function EquipmentGridSection({ products }: EquipmentGridSectionProps) {
	const [activeGroupId, setActiveGroupId] = useState<string>(ALL_FILTER)
	const panelRef = useRef<HTMLDivElement>(null)
	const skipScrollRef = useRef(true)

	const groupOptions = useMemo(() => buildEquipmentGroupPills(products), [products])

	const filteredProducts = useMemo(() => {
		if (activeGroupId === ALL_FILTER) return products
		return products.filter((p) => productMatchesEquipmentGroup(p, activeGroupId))
	}, [products, activeGroupId])

	useEffect(() => {
		if (activeGroupId === ALL_FILTER) return
		if (!groupOptions.some((g) => g.id === activeGroupId)) setActiveGroupId(ALL_FILTER)
	}, [activeGroupId, groupOptions])

	useEffect(() => {
		if (skipScrollRef.current) {
			skipScrollRef.current = false
			return
		}
		const el = panelRef.current
		if (!el) return
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		el.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" })
	}, [activeGroupId])

	const tabPanelLabelledBy =
		activeGroupId === ALL_FILTER || !groupOptions.some((g) => g.id === activeGroupId)
			? "equipment-filter-all"
			: `equipment-filter-${activeGroupId}`

	if (!products.length) return null

	const mobileProductGroups = chunkProducts(filteredProducts, 4)

	const activeLabel =
		activeGroupId === ALL_FILTER
			? "All categories"
			: (groupOptions.find((g) => g.id === activeGroupId)?.label ?? "Selected category")

	const filterButtonClass = (isActive: boolean) =>
		`font-heading rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm ${
			isActive
				? "border-transparent bg-slate-950 text-white shadow-sm"
				: "border-transparent bg-transparent text-slate-700 hover:bg-white/90 hover:text-slate-950"
		}`

	const resultPhrase =
		filteredProducts.length === 0
			? "No products match this filter."
			: `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}${activeGroupId === ALL_FILTER ? "" : ` in ${activeLabel}`}.`

	return (
		<section className="border-b border-slate-200 border-t border-slate-100 bg-slate-50/70 py-14 sm:py-16 lg:py-20">
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="mb-8 w-full sm:mb-10">
					<h2 className="w-full text-xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-2xl md:text-3xl lg:max-w-none lg:text-[clamp(2rem,4vw,3.3rem)]">
						Browse the largest fleet in the industry
					</h2>
				</div>

				{groupOptions.length > 0 ? (
					<div
						className="mb-6 flex flex-wrap gap-1 rounded-2xl bg-slate-100/90 p-1 sm:mb-8 sm:gap-1"
						role="tablist"
						aria-label="Filter equipment by category"
					>
						<button
							type="button"
							role="tab"
							aria-selected={activeGroupId === ALL_FILTER}
							id="equipment-filter-all"
							className={filterButtonClass(activeGroupId === ALL_FILTER)}
							onClick={() => setActiveGroupId(ALL_FILTER)}
						>
							All
						</button>
						{groupOptions.map((group) => {
							const isActive = activeGroupId === group.id

							return (
								<button
									key={group.id}
									type="button"
									role="tab"
									aria-selected={isActive}
									id={`equipment-filter-${group.id}`}
									className={filterButtonClass(isActive)}
									onClick={() => setActiveGroupId(group.id)}
								>
									{group.label}
								</button>
							)
						})}
					</div>
				) : null}

				<div
					ref={panelRef}
					id="equipment-grid-panel"
					role={groupOptions.length > 0 ? "tabpanel" : undefined}
					aria-labelledby={groupOptions.length > 0 ? tabPanelLabelledBy : undefined}
				>
					<p
						className="sr-only mb-0 text-sm text-slate-600 sm:not-sr-only sm:mb-4"
						aria-live="polite"
						aria-atomic="true"
					>
						{resultPhrase}
					</p>

					{filteredProducts.length === 0 ? (
						<div className="py-8 text-center">
							<Link
								href="/products"
								className="inline-flex text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-rose-800 hover:decoration-rose-400"
							>
								Browse full catalog
							</Link>
						</div>
					) : (
						<>
							<div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-6 sm:hidden">
								{mobileProductGroups.map((productGroup, index) => (
									<div
										key={`mobile-group-${index}`}
										className="grid min-w-[84%] shrink-0 snap-start grid-cols-2 gap-2"
									>
										{productGroup.map((product) => (
											<EquipmentProductCard key={product.slug} product={product} />
										))}
									</div>
								))}
							</div>

							<div className="hidden grid-cols-2 gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 sm:gap-2.5 lg:gap-3">
								{filteredProducts.map((product) => (
									<EquipmentProductCard key={product.slug} product={product} />
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	)
}
