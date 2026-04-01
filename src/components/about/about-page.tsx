import Link from "next/link"
import {
	ArrowRight,
	Factory,
	History,
	Layers3,
	ShieldCheck,
	Wrench,
	type LucideIcon,
} from "lucide-react"
import type {
	AboutPageContent,
	AboutPageFeature,
	AboutProofStat,
	AboutRouteCard,
} from "@/lib/content/about"

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
	inverted?: boolean
}

interface ProofStatCardProps {
	stat: AboutProofStat
}

interface RouteCardProps {
	route: AboutRouteCard
}

const heroIcons: LucideIcon[] = [History, Layers3, Wrench]
const credibilityIcons: LucideIcon[] = [History, Layers3, Factory, ShieldCheck]
const qualityIcons: LucideIcon[] = [ShieldCheck, Wrench, Factory]
const whyJaycoIcons: LucideIcon[] = [Factory, History, Layers3, Wrench]

function SectionHeading({ eyebrow, title, description, inverted = false }: SectionHeadingProps) {
	return (
		<div className="max-w-3xl">
			<p
				className={`mb-3 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${
					inverted ? "text-amber-300" : "text-amber-700"
				}`}
			>
				<span className={`block h-px w-8 ${inverted ? "bg-amber-500/80" : "bg-amber-600"}`} />
				{eyebrow}
			</p>
			<h2
				className={`text-[clamp(1.8rem,3vw,2.7rem)] font-semibold leading-[1.04] tracking-[-0.03em] ${
					inverted ? "text-white" : "text-slate-950"
				}`}
			>
				{title}
			</h2>
			<p className={`mt-4 max-w-[64ch] text-sm leading-relaxed sm:text-base ${inverted ? "text-slate-300" : "text-slate-600"}`}>
				{description}
			</p>
		</div>
	)
}

function FeatureCard({ item, icon: Icon, inverted = false }: FeatureCardProps) {
	return (
		<div
			className={`h-full rounded-[1.6rem] border p-5 sm:p-6 ${
				inverted
					? "border-white/10 bg-white/5 shadow-[0_18px_48px_rgba(2,6,23,0.22)]"
					: "border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.07)]"
			}`}
		>
			<div
				className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
					inverted ? "bg-amber-500/12 text-amber-300" : "bg-amber-50 text-amber-700"
				}`}
			>
				<Icon className="h-5 w-5" aria-hidden />
			</div>
			<h3 className={`mt-5 text-lg font-semibold tracking-tight ${inverted ? "text-white" : "text-slate-950"}`}>
				{item.title}
			</h3>
			<p className={`mt-3 text-sm leading-relaxed ${inverted ? "text-slate-300" : "text-slate-600"}`}>{item.description}</p>
		</div>
	)
}

function ProofStatCard({ stat }: ProofStatCardProps) {
	return (
		<div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
			<p className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{stat.value}</p>
			<p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
			<p className="mt-3 text-sm leading-relaxed text-slate-600">{stat.description}</p>
		</div>
	)
}

function RouteCard({ route }: RouteCardProps) {
	return (
		<Link
			href={route.href}
			className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition-colors hover:border-amber-400/40 hover:bg-white/[0.07] sm:p-6"
		>
			<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-300">Route</p>
			<h3 className="mt-3 text-xl font-semibold tracking-tight text-white">{route.title}</h3>
			<p className="mt-3 text-sm leading-relaxed text-slate-300">{route.description}</p>
			<span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5">
				Open path
				<ArrowRight className="h-4 w-4" aria-hidden />
			</span>
		</Link>
	)
}

export function AboutPage({ content }: AboutPageProps) {
	return (
		<main className="min-h-screen bg-slate-50">
			<section className="relative overflow-hidden bg-slate-950 pb-14 pt-28 sm:pb-16 lg:pb-20 lg:pt-36">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.1]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 44px,#fff 44px,#fff 45px),repeating-linear-gradient(90deg,transparent,transparent 44px,#fff 44px,#fff 45px)",
					}}
				/>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.16),transparent_36%)]" />

				<div className="relative mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start lg:gap-14">
						<div className="max-w-3xl">
							<p className="mb-4 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-amber-300">
								<span className="block h-px w-8 bg-amber-500" />
								{content.pageEyebrow}
							</p>
							<h1 className="text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-white">
								{content.pageTitle}
							</h1>
							<p className="mt-6 max-w-[66ch] text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
								{content.pageDescription}
							</p>

							<ul className="mt-7 grid list-none gap-3 p-0 sm:grid-cols-2">
								{content.heroHighlights.map((highlight) => (
									<li
										key={highlight}
										className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 backdrop-blur-sm"
									>
										{highlight}
									</li>
								))}
							</ul>

							<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
								<Link
									href={content.heroPrimaryCta.href}
									className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400"
								>
									{content.heroPrimaryCta.label}
									<ArrowRight className="h-4 w-4" aria-hidden />
								</Link>
								<Link
									href={content.heroSecondaryCta.href}
									className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
								>
									{content.heroSecondaryCta.label}
								</Link>
							</div>
						</div>

						<div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_28px_72px_rgba(2,6,23,0.34)] backdrop-blur-sm sm:p-6">
							<div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
								<div>
									<p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
										Industrial company profile
									</p>
									<h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
										{content.heroPanelTitle}
									</h2>
								</div>
								<div className="rounded-2xl border border-white/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-300">
									Verified
								</div>
							</div>

							<div className="grid gap-4">
								{content.heroPanelItems.map((item, index) => {
									const Icon = heroIcons[index] ?? Factory

									return (
										<div
											key={item.title}
											className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4 sm:p-5"
										>
											<div className="flex items-start gap-4">
												<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-300">
													<Icon className="h-5 w-5" aria-hidden />
												</div>
												<div>
													<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
														{item.label}
													</p>
													<h3 className="mt-2 text-base font-semibold tracking-tight text-white sm:text-lg">
														{item.title}
													</h3>
													<p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start lg:gap-12">
						<div>
							<p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-amber-700">
								{content.companyOverview.eyebrow}
							</p>
							<h2 className="text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-slate-950">
								{content.companyOverview.title}
							</h2>

							<div className="mt-5 space-y-4">
								{content.companyOverview.description.map((paragraph) => (
									<p key={paragraph} className="max-w-[66ch] text-sm leading-relaxed text-slate-600 sm:text-base">
										{paragraph}
									</p>
								))}
							</div>

							<ul className="mt-7 grid list-none gap-3 p-0">
								{content.companyOverview.quickPoints.map((point) => (
									<li
										key={point}
										className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
									>
										{point}
									</li>
								))}
							</ul>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							{content.credibilityPoints.map((point, index) => (
								<FeatureCard
									key={point.title}
									item={point}
									icon={credibilityIcons[index] ?? Factory}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-slate-200 bg-white py-14 sm:py-16 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.capabilitySection.eyebrow}
						title={content.capabilitySection.title}
						description={content.capabilitySection.description}
					/>

					<div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
						{content.capabilitySection.groups.map((group) => (
							<div
								key={group.title}
								className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] sm:p-6"
							>
								<h3 className="text-lg font-semibold tracking-tight text-slate-950">{group.title}</h3>
								<p className="mt-3 text-sm leading-relaxed text-slate-600">{group.description}</p>
								<ul className="mt-5 grid list-none gap-2 p-0">
									{group.items.map((item) => (
										<li
											key={item}
											className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
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

			<section className="border-b border-slate-200 bg-slate-100 py-14 sm:py-16 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.industriesSection.eyebrow}
						title={content.industriesSection.title}
						description={content.industriesSection.description}
					/>

					<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{content.industriesSection.industries.map((industry) => (
							<div
								key={industry.name}
								className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-6"
							>
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-700">Sector</p>
								<h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">{industry.name}</h3>
								<p className="mt-3 text-sm leading-relaxed text-slate-600">{industry.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-b border-slate-800 bg-slate-950 py-14 sm:py-16 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid gap-12 lg:grid-cols-2 lg:items-start">
						<div>
							<SectionHeading
								eyebrow={content.qualitySection.eyebrow}
								title={content.qualitySection.title}
								description={content.qualitySection.description}
								inverted
							/>

							<div className="mt-8 grid gap-4">
								{content.qualitySection.points.map((point, index) => (
									<FeatureCard
										key={point.title}
										item={point}
										icon={qualityIcons[index] ?? ShieldCheck}
										inverted
									/>
								))}
							</div>
						</div>

						<div>
							<SectionHeading
								eyebrow={content.whyJaycoSection.eyebrow}
								title={content.whyJaycoSection.title}
								description={content.whyJaycoSection.description}
								inverted
							/>

							<div className="mt-8 grid gap-4">
								{content.whyJaycoSection.points.map((point, index) => (
									<FeatureCard
										key={point.title}
										item={point}
										icon={whyJaycoIcons[index] ?? Factory}
										inverted
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.proofSection.eyebrow}
						title={content.proofSection.title}
						description={content.proofSection.description}
					/>

					<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{content.proofSection.stats.map((stat) => (
							<ProofStatCard key={stat.label} stat={stat} />
						))}
					</div>
				</div>
			</section>

			<section className="relative overflow-hidden bg-slate-950 py-14 sm:py-16 lg:py-20">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.12),transparent_32%)]" />

				<div className="relative mx-auto max-w-6xl px-4 lg:px-6">
					<SectionHeading
						eyebrow={content.ctaSection.eyebrow}
						title={content.ctaSection.title}
						description={content.ctaSection.description}
						inverted
					/>

					<div className="mt-8 grid gap-4 lg:grid-cols-3">
						{content.ctaSection.routes.map((route) => (
							<RouteCard key={route.title} route={route} />
						))}
					</div>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
						<Link
							href={content.ctaSection.primaryCta.href}
							className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400"
						>
							{content.ctaSection.primaryCta.label}
							<ArrowRight className="h-4 w-4" aria-hidden />
						</Link>
						<Link
							href={content.ctaSection.secondaryCta.href}
							className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
						>
							{content.ctaSection.secondaryCta.label}
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
