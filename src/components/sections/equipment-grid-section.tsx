import type { ReactNode } from "react"
import Link from "next/link"
import {
	Box,
	Cable,
	Factory,
	Forklift,
	HandMetal,
	Package,
	PanelsTopLeft,
	Shield,
	Truck,
	Wrench,
} from "lucide-react"
import type { Product } from "@/lib/cms/types"

interface EquipmentGridSectionProps {
	products: Product[]
}

interface CategoryIconDefinition {
	icon: ReactNode
}

const categoryIcons: Record<string, CategoryIconDefinition> = {
	"chain-pulley-block": {
		icon: <Cable className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"electric-hoist": {
		icon: <Factory className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"eot-cranes": {
		icon: <PanelsTopLeft className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"floor-gantry-cranes": {
		icon: <Truck className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"goods-lift": {
		icon: <Package className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"hydraulic-stacker": {
		icon: <Forklift className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"jib-cranes": {
		icon: <Factory className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"lifting-platforms": {
		icon: <Shield className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"material-transport-docking": {
		icon: <HandMetal className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	"pallet-drum-handling": {
		icon: <Box className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
	},
	sling: {
		icon: <Cable className="h-9 w-9 text-slate-950 sm:h-10 sm:w-10" strokeWidth={1.75} />,
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

export function EquipmentGridSection({ products }: EquipmentGridSectionProps) {
	if (!products.length) return null

	const mobileProductGroups = chunkProducts(products, 4)

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

				<div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
					{mobileProductGroups.map((productGroup, index) => (
						<div
							key={`mobile-group-${index}`}
							className="grid min-w-full shrink-0 snap-center grid-cols-2 gap-3"
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

									<div className="mt-4 flex justify-end text-slate-950 transition-transform duration-200 group-hover:scale-105">
										{categoryIcons[product.categorySlug]?.icon ?? (
											<Wrench className="h-9 w-9" strokeWidth={1.75} />
										)}
									</div>
								</Link>
							))}
						</div>
					))}
				</div>

				<div className="hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
					{products.map((product) => (
						<Link
							key={product.slug}
							href={`/products/${product.categorySlug}/${product.slug}`}
							className="group flex min-h-[112px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:min-h-[124px]"
						>
							<h3 className="max-w-[16ch] text-sm font-semibold leading-snug text-slate-800 sm:text-[0.95rem]">
								{product.name}
							</h3>

							<div className="mt-4 flex justify-end text-slate-950 transition-transform duration-200 group-hover:scale-105">
								{categoryIcons[product.categorySlug]?.icon ?? (
									<Wrench className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.75} />
								)}
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
