import Link from "next/link"
import type { SiteSettings } from "@/lib/cms/types"
import { buildHomeAboutSplitContent, type HomeAboutSplitColumn } from "@/lib/content/home-about-split"

interface AboutSpecialFeaturesSectionProps {
	settings: SiteSettings
}

function SplitColumn({ column, isFirst }: { column: HomeAboutSplitColumn; isFirst: boolean }) {
	return (
		<div
			className={`text-left ${
				isFirst ? "" : "border-t border-slate-200 pt-10 sm:border-t-0 sm:pt-0 lg:border-l lg:border-slate-200 lg:pl-10"
			}`}
		>
			<p className="mb-2 text-xs font-semibold tracking-wide text-red-700">{column.eyebrow}</p>
			<h2 className="text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold leading-tight tracking-tight text-slate-950">
				{column.title}
			</h2>
			<div className="mt-4 space-y-3">
				{column.paragraphs.map((paragraph, index) => (
					<p key={index} className="max-w-[62ch] text-sm leading-relaxed text-slate-600">
						{paragraph}
					</p>
				))}
			</div>
			{column.features && column.features.length > 0 ? (
				<ul className="mt-4 flex list-none flex-col gap-2 p-0">
					{column.features.map((item) => (
						<li
							key={item}
							className="relative pl-4 text-sm leading-relaxed text-slate-600 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600"
						>
							{item}
						</li>
					))}
				</ul>
			) : null}
			<Link
				href={column.cta.href}
				className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-red-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
			>
				{column.cta.label}
			</Link>
		</div>
	)
}

export function AboutSpecialFeaturesSection({ settings }: AboutSpecialFeaturesSectionProps) {
	const content = buildHomeAboutSplitContent(settings)

	return (
		<section className="border-b border-slate-200 bg-white py-12 sm:py-14 lg:py-20">
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
					<SplitColumn column={content.left} isFirst />
					<SplitColumn column={content.right} isFirst={false} />
				</div>
			</div>
		</section>
	)
}
