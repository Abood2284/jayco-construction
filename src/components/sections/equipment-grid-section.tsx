"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { Product, ProductCategory } from "@/lib/cms/types"
import {
	buildEquipmentCategorySummaryRows,
	buildEquipmentGroupPills,
	productMatchesEquipmentGroup,
} from "@/lib/content/equipment-category-groups"

interface EquipmentGridSectionProps {
	products: Product[]
	categories: ProductCategory[]
}

const SUMMARY_ICON_CLASS =
	"h-8 w-8 shrink-0 text-rose-400 sm:h-9 sm:w-9"

interface CategoryIconDefinition {
	icon: ReactNode
}

interface EquipmentIconProps {
	children: ReactNode
	className?: string
}

function EquipmentIcon({ children, className }: EquipmentIconProps) {
	return (
		<svg
			viewBox="0 0 48 48"
			aria-hidden="true"
			className={className ?? "h-9 w-9 text-red-600 sm:h-10 sm:w-10"}
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{children}
		</svg>
	)
}

function HoistIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M12 10h24" />
			<path d="M24 10v8" />
			<path d="M18 18h12v8H18z" />
			<path d="M24 26v8" />
			<path d="M24 34c0 3 2 5 5 5" />
			<path d="M29 39c0-2 1-3 3-3" />
		</EquipmentIcon>
	)
}

function CraneIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M10 40h28" />
			<path d="M14 40V12" />
			<path d="M14 12h22" />
			<path d="M20 18h10" />
			<path d="M24 12v16" />
			<path d="M24 28c0 3 2 5 5 5" />
			<path d="M29 33c0-2 1-3 3-3" />
		</EquipmentIcon>
	)
}

function GantryIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M10 14h28" />
			<path d="M14 14v20" />
			<path d="M34 14v20" />
			<path d="M24 14v10" />
			<path d="M24 24c0 3 2 5 5 5" />
			<path d="M13 34h4" />
			<path d="M31 34h4" />
			<circle cx="15" cy="38" r="2" />
			<circle cx="33" cy="38" r="2" />
		</EquipmentIcon>
	)
}

function LiftIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M12 36h24" />
			<path d="M16 12v20" />
			<path d="M32 12v20" />
			<path d="M18 16h12v12H18z" />
			<path d="M24 10v4" />
		</EquipmentIcon>
	)
}

function StackerIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M14 38V14" />
			<path d="M14 16h8" />
			<path d="M22 22h8v10H22z" />
			<path d="M12 38h18" />
			<path d="M30 34h6" />
			<circle cx="18" cy="38" r="2" />
			<circle cx="30" cy="38" r="2" />
		</EquipmentIcon>
	)
}

function PlatformIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M10 34h28" />
			<path d="M16 34l8-14 8 14" />
			<path d="M20 18l4-6 4 6" />
		</EquipmentIcon>
	)
}

function TransportIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M10 32h20l4-8h4" />
			<path d="M14 24h10" />
			<path d="M30 24h4" />
			<circle cx="18" cy="36" r="2.5" />
			<circle cx="32" cy="36" r="2.5" />
		</EquipmentIcon>
	)
}

function DrumHandlingIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M18 14h12" />
			<path d="M16 18h16" />
			<path d="M18 14v20" />
			<path d="M30 14v20" />
			<path d="M16 30h16" />
			<path d="M12 24h4" />
			<path d="M32 24h4" />
		</EquipmentIcon>
	)
}

function SlingIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M16 14c0 10 4 18 8 20" />
			<path d="M32 14c0 10-4 18-8 20" />
			<path d="M16 14c0-3 2-5 4-5h8c2 0 4 2 4 5" />
			<path d="M22 34h4" />
		</EquipmentIcon>
	)
}

function BulldozerIcon({ className }: { className?: string }) {
	return (
		<EquipmentIcon className={className}>
			<path d="M10 32h24" />
			<path d="M14 32v-8h10l4 4h6" />
			<path d="M34 32l4-4" />
			<path d="M14 24l4-8h8" />
			<circle cx="18" cy="36" r="2.5" />
			<circle cx="30" cy="36" r="2.5" />
		</EquipmentIcon>
	)
}

const categoryIcons: Record<string, CategoryIconDefinition> = {
	"chain-pulley-block": {
		icon: <HoistIcon />,
	},
	"electric-hoist": {
		icon: <HoistIcon />,
	},
	"eot-cranes": {
		icon: <CraneIcon />,
	},
	"floor-gantry-cranes": {
		icon: <GantryIcon />,
	},
	"goods-lift": {
		icon: <LiftIcon />,
	},
	"hydraulic-stacker": {
		icon: <StackerIcon />,
	},
	"jib-cranes": {
		icon: <CraneIcon />,
	},
	"lifting-platforms": {
		icon: <PlatformIcon />,
	},
	"material-transport-docking": {
		icon: <TransportIcon />,
	},
	"pallet-drum-handling": {
		icon: <DrumHandlingIcon />,
	},
	sling: {
		icon: <SlingIcon />,
	},
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

function EquipmentGroupSummaryIcon({ groupId }: { groupId: string }) {
	switch (groupId) {
		case "cranes":
			return <CraneIcon className={SUMMARY_ICON_CLASS} />
		case "hoists":
			return <HoistIcon className={SUMMARY_ICON_CLASS} />
		case "lifts-platforms":
			return <LiftIcon className={SUMMARY_ICON_CLASS} />
		case "stackers-pallet":
			return <StackerIcon className={SUMMARY_ICON_CLASS} />
		case "transport-docking":
			return <TransportIcon className={SUMMARY_ICON_CLASS} />
		case "slings":
			return <SlingIcon className={SUMMARY_ICON_CLASS} />
		default:
			return <BulldozerIcon className={SUMMARY_ICON_CLASS} />
	}
}

export function EquipmentGridSection({ products, categories }: EquipmentGridSectionProps) {
	const [activeGroupId, setActiveGroupId] = useState<string>(ALL_FILTER)

	const groupOptions = useMemo(() => buildEquipmentGroupPills(products), [products])

	const summaryRows = useMemo(
		() => buildEquipmentCategorySummaryRows(products, categories),
		[products, categories],
	)

	const filteredProducts = useMemo(() => {
		if (activeGroupId === ALL_FILTER) return products
		return products.filter((p) => productMatchesEquipmentGroup(p, activeGroupId))
	}, [products, activeGroupId])

	useEffect(() => {
		if (activeGroupId === ALL_FILTER) return
		if (!groupOptions.some((g) => g.id === activeGroupId)) setActiveGroupId(ALL_FILTER)
	}, [activeGroupId, groupOptions])

	const tabPanelLabelledBy =
		activeGroupId === ALL_FILTER || !groupOptions.some((g) => g.id === activeGroupId)
			? "equipment-filter-all"
			: `equipment-filter-${activeGroupId}`

	if (!products.length) return null

	const mobileProductGroups = chunkProducts(filteredProducts, 4)

	return (
		<section className="border-b border-slate-200 bg-white py-14 sm:py-16 lg:py-20">
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="mb-8 sm:mb-10">
					<p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-slate-600">
						Equipment
					</p>
					<h2 className="max-w-4xl text-[clamp(2rem,4vw,3.3rem)] font-extrabold leading-tight tracking-tight text-slate-950">
						Browse the largest fleet in the industry
					</h2>
				</div>

				{summaryRows.length > 0 ? (
					<div className="font-body mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 sm:mb-10">
						<ul className="m-0 list-none divide-y divide-white/10 p-0">
							{summaryRows.map((row) => (
								<li key={row.groupId}>
									<button
										type="button"
										className="flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-white/4 sm:flex-row sm:items-start sm:gap-8 sm:px-6 sm:py-5"
										aria-label={`Show equipment in ${row.label}`}
										onClick={() => {
											if (!groupOptions.some((g) => g.id === row.groupId)) return
											setActiveGroupId(row.groupId)
										}}
									>
										<div className="flex min-w-0 items-center gap-3 sm:min-w-48 sm:max-w-56 sm:shrink-0">
											<EquipmentGroupSummaryIcon groupId={row.groupId} />
											<span className="text-base font-semibold tracking-tight text-white sm:text-lg">
												{row.label}
											</span>
										</div>
										<p className="min-w-0 pl-11 text-sm leading-relaxed font-normal text-white/80 sm:pl-0 sm:pt-0.5 sm:text-base">
											{row.subCategoryNames.join(", ")}
										</p>
									</button>
								</li>
							))}
						</ul>
					</div>
				) : null}

				{groupOptions.length > 0 ? (
					<div
						className="mb-8 flex flex-wrap gap-2 sm:mb-10"
						role="tablist"
						aria-label="Filter equipment by category"
					>
						<button
							type="button"
							role="tab"
							aria-selected={activeGroupId === ALL_FILTER}
							id="equipment-filter-all"
							className={`font-heading rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
								activeGroupId === ALL_FILTER
									? "border-slate-950 bg-slate-950 text-white"
									: "border-slate-950 bg-white text-slate-950 hover:bg-slate-50"
							}`}
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
									className={`font-heading rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
										isActive
											? "border-slate-950 bg-slate-950 text-white"
											: "border-slate-950 bg-white text-slate-950 hover:bg-slate-50"
									}`}
									onClick={() => setActiveGroupId(group.id)}
								>
									{group.label}
								</button>
							)
						})}
					</div>
				) : null}

				<div
					id="equipment-grid-panel"
					role={groupOptions.length > 0 ? "tabpanel" : undefined}
					aria-labelledby={groupOptions.length > 0 ? tabPanelLabelledBy : undefined}
				>
					{filteredProducts.length === 0 ? (
						<p className="py-10 text-center text-sm text-slate-600">No equipment in this category.</p>
					) : (
						<>
							<div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pr-10 sm:hidden">
								{mobileProductGroups.map((productGroup, index) => (
									<div
										key={`mobile-group-${index}`}
										className="grid min-w-[84%] shrink-0 snap-start grid-cols-2 gap-3"
									>
										{productGroup.map((product) => (
											<Link
												key={product.slug}
												href={`/products/${product.categorySlug}/${product.slug}`}
												className="group flex min-h-[112px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-slate-300 hover:shadow-md"
											>
												<h3 className="max-w-[16ch] text-sm font-semibold leading-snug text-slate-800">
													{product.name}
												</h3>

												<div className="mt-4 flex justify-end transition-transform duration-200 group-hover:scale-105">
													{categoryIcons[product.categorySlug]?.icon ?? (
														<BulldozerIcon />
													)}
												</div>
											</Link>
										))}
									</div>
								))}
							</div>

							<div className="hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
								{filteredProducts.map((product) => (
									<Link
										key={product.slug}
										href={`/products/${product.categorySlug}/${product.slug}`}
										className="group flex min-h-[112px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:min-h-[124px]"
									>
										<h3 className="max-w-[16ch] text-sm font-semibold leading-snug text-slate-800 sm:text-[0.95rem]">
											{product.name}
										</h3>

										<div className="mt-4 flex justify-end transition-transform duration-200 group-hover:scale-105">
											{categoryIcons[product.categorySlug]?.icon ?? (
												<BulldozerIcon />
											)}
										</div>
									</Link>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	)
}
