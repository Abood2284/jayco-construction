import Link from "next/link"
import { ArrowRight, Factory, History, Layers3, ShieldCheck, type LucideIcon } from "lucide-react"
import type { AboutPageContent, AboutPageFeature } from "@/lib/content/about"
import { AboutAnimatedProofGrid } from "@/components/about/about-animated-proof-grid"

interface AboutPageProps {
	content: AboutPageContent
}

interface SectionHeadingProps {
	eyebrow: string
	title: string
	description: string
	inverted?: boolean
}

interface FeatureCardProps {
	item: AboutPageFeature
	icon: LucideIcon
}

const credibilityIcons: LucideIcon[] = [History, Layers3, Factory, ShieldCheck]

function SectionHeading({ eyebrow, title, description, inverted = false }: SectionHeadingProps) {
	return (
		<div className="max-w-3xl">
			<p
				className={`mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-wide ${
					inverted ? "text-red-300" : "text-red-700"
				}`}
			>
				<span className={`block h-px w-7 shrink-0 ${inverted ? "bg-red-500/80" : "bg-red-600"}`} />
				{eyebrow}
			</p>
			<h2
				className={`text-[clamp(1.65rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight ${
					inverted ? "text-white" : "text-slate-950"
				}`}
			>
				{title}
			</h2>
			{description ? (
				<p
					className={`mt-3 max-w-[60ch] text-sm leading-relaxed ${inverted ? "text-slate-300" : "text-slate-600"}`}
				>
					{description}
				</p>
			) : null}
		</div>
	)
}

function FeatureCard({ item, icon: Icon }: FeatureCardProps) {
	return (
		<div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
			<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700">
				<Icon className="h-4 w-4" aria-hidden />
			</div>
			<h3 className="mt-3 text-base font-semibold tracking-tight text-slate-950">{item.title}</h3>
			<p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{item.description}</p>
		</div>
	)
}

export function AboutPage({ content }: AboutPageProps) {
	return (
		<main className="min-h-screen bg-slate-50">
			<section className="relative overflow-hidden border-b-4 border-red-700 bg-slate-950 pb-12 pt-24 sm:pb-14 lg:pb-16 lg:pt-32">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.08]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 44px,#fff 44px,#fff 45px),repeating-linear-gradient(90deg,transparent,transparent 44px,#fff 44px,#fff 45px)",
					}}
				/>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.12),transparent_38%)]" />

				<div className="relative mx-auto max-w-6xl px-4 lg:px-6">
					<div className="max-w-3xl">
						<p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-red-300">
							<span className="block h-px w-8 shrink-0 bg-red-500" />
							{content.pageEyebrow}
						</p>
						<h1 className="text-[clamp(2.2rem,5.5vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-white">
							{content.pageTitle}
						</h1>
						<p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-slate-300 sm:text-base">
							{content.pageDescription}
						</p>

						<ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
							{content.heroHighlights.map((highlight) => (
								<li
									key={highlight}
									className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[0.7rem] font-medium text-slate-200 sm:text-xs"
								>
									{highlight}
								</li>
							))}
						</ul>

						<div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
							<Link
								href={content.heroPrimaryCta.href}
								className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
							>
								{content.heroPrimaryCta.label}
								<ArrowRight className="h-4 w-4" aria-hidden />
							</Link>
							<Link
								href={content.heroSecondaryCta.href}
								className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/5"
							>
								{content.heroSecondaryCta.label}
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-12 lg:py-14">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] lg:items-start lg:gap-10">
						<div>
							<p className="mb-2 text-xs font-semibold tracking-wide text-red-700">{content.companyOverview.eyebrow}</p>
							<h2 className="text-[clamp(1.5rem,2.5vw,2.1rem)] font-semibold leading-tight tracking-tight text-slate-950">
								{content.companyOverview.title}
							</h2>

							<div className="mt-4 space-y-3">
								{content.companyOverview.description.map((paragraph) => (
									<p key={paragraph} className="max-w-[62ch] text-sm leading-relaxed text-slate-600">
										{paragraph}
									</p>
								))}
							</div>

							<ul className="mt-5 flex list-none flex-col gap-2 p-0">
								{content.companyOverview.quickPoints.map((point) => (
									<li
										key={point}
										className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
									>
										{point}
									</li>
								))}
							</ul>
						</div>

						<div className="grid grid-cols-2 gap-3">
							{content.credibilityPoints.map((point, index) => (
								<FeatureCard key={point.title} item={point} icon={credibilityIcons[index] ?? Factory} />
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-slate-200 bg-white py-10 sm:py-12 lg:py-14">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.capabilitySection.eyebrow}
						title={content.capabilitySection.title}
						description={content.capabilitySection.description}
					/>

					<div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{content.capabilitySection.groups.map((group) => (
							<div
								key={group.title}
								className="rounded-xl border border-slate-200 border-l-4 border-l-red-600 bg-slate-50 p-4 sm:p-5"
							>
								<h3 className="text-base font-semibold tracking-tight text-slate-950">{group.title}</h3>
								<p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{group.description}</p>
								<ul className="mt-3 flex list-none flex-wrap gap-1.5 p-0">
									{group.items.map((item) => (
										<li
											key={item}
											className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
										>
											{item}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-b border-slate-200 bg-slate-100 py-10 sm:py-12 lg:py-14">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.industriesSection.eyebrow}
						title={content.industriesSection.title}
						description={content.industriesSection.description}
					/>

					<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						{content.industriesSection.industries.map((industry) => (
							<div
								key={industry.name}
								className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
							>
								<p className="text-xs font-semibold text-red-700">Sector</p>
								<h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950">{industry.name}</h3>
								<p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{industry.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-12 lg:py-14">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.proofSection.eyebrow}
						title={content.proofSection.title}
						description={content.proofSection.description}
					/>

					<div className="mt-6">
						<AboutAnimatedProofGrid stats={content.proofSection.stats} />
					</div>
				</div>
			</section>

			<section className="relative overflow-hidden border-t-4 border-red-600 bg-slate-950 py-10 sm:py-12 lg:py-14">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.1),transparent_34%)]" />

				<div className="relative mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.ctaSection.eyebrow}
						title={content.ctaSection.title}
						description={content.ctaSection.description}
						inverted
					/>

					<div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
						{content.ctaSection.links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-red-400/50 hover:bg-red-600/90"
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
						<Link
							href={content.ctaSection.primaryCta.href}
							className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
						>
							{content.ctaSection.primaryCta.label}
							<ArrowRight className="h-4 w-4" aria-hidden />
						</Link>
						<Link
							href={content.ctaSection.secondaryCta.href}
							className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/5"
						>
							{content.ctaSection.secondaryCta.label}
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
