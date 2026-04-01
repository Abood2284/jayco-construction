import {
	Factory,
	History,
	Layers3,
	ShieldCheck,
	Wrench,
	type LucideIcon,
} from "lucide-react"
import type { Product, SiteSettings } from "@/lib/cms/types"
import type { HomepageTrustStat } from "@/lib/content/homepage"
import { buildHomepageHeroContent } from "@/lib/content/homepage"

interface TrustStripProps {
	settings: SiteSettings
	products: Product[]
}

interface TrustStatCardProps {
	stat: HomepageTrustStat
}

const trustIcons: Record<HomepageTrustStat["icon"], LucideIcon> = {
	history: History,
	layers: Layers3,
	factory: Factory,
	shield: ShieldCheck,
	wrench: Wrench,
}

function TrustStatCard({ stat }: TrustStatCardProps) {
	const Icon = trustIcons[stat.icon]

	return (
		<li className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
			<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
				<Icon className="h-5 w-5" aria-hidden />
			</div>
			<h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">{stat.title}</h2>
			<p className="mt-2 text-sm leading-relaxed text-slate-600">{stat.description}</p>
		</li>
	)
}

export function TrustStrip({ settings, products }: TrustStripProps) {
	const { trustStats } = buildHomepageHeroContent(settings, products)

	return (
		<section className="relative z-10 -mt-12 pb-8 sm:-mt-14 sm:pb-10 lg:-mt-16 lg:pb-12">
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="rounded-[2rem] border border-slate-200/90 bg-slate-50/96 p-5 shadow-[0_32px_72px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-6 lg:p-8">
					<div className="mb-6 flex flex-col gap-2 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Why industrial buyers shortlist Jayco
							</p>
							<h2 className="mb-0 text-[clamp(1.6rem,2.4vw,2.15rem)] font-semibold tracking-[-0.02em] text-slate-950">
								Proof up front, before the deeper product browse
							</h2>
						</div>
						<p className="m-0 max-w-[38ch] text-sm leading-relaxed text-slate-600">
							A compact trust layer for experience, product breadth, sectors served, standards context, and support capability.
						</p>
					</div>

					<ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-5">
						{trustStats.map((stat) => (
							<TrustStatCard key={stat.title} stat={stat} />
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}
