import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import type { Product, SiteSettings } from "@/lib/cms/types"
import { buildHomepageHeroContent } from "@/lib/content/homepage"

interface HeroSectionProps {
	settings: SiteSettings
	products: Product[]
}

interface HeroActionsProps {
	primary: {
		label: string
		href: string
	}
	secondary: {
		label: string
		href: string
	}
}

function HeroActions({ primary, secondary }: HeroActionsProps) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
			<Link
				href={primary.href}
				className="font-heading inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-rose-700 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-[0_18px_40px_rgba(190,24,93,0.24)] transition-colors hover:bg-rose-600 sm:min-h-12 sm:tracking-[0.14em] sm:w-auto"
			>
				<span className="whitespace-nowrap">{primary.label}</span>
				<ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
			</Link>
			<Link
				href={secondary.href}
				className="font-heading inline-flex min-h-13 w-full items-center justify-center rounded-xl border border-white/18 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/10 sm:min-h-12 sm:tracking-[0.14em] sm:w-auto"
			>
				<span className="text-balance sm:whitespace-nowrap">{secondary.label}</span>
			</Link>
		</div>
	)
}

export function HeroSection({ settings, products }: HeroSectionProps) {
	const content = buildHomepageHeroContent(settings, products)

	return (
		<section className="relative overflow-hidden bg-slate-950 pt-24 pb-20 sm:pb-24 lg:pt-28">
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)",
					backgroundSize: "72px 72px",
					maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.18))",
				}}
			/>
			<div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-rose-600/14 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 -bottom-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

			<div className="relative mx-auto max-w-7xl px-4 lg:px-6">
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center lg:gap-10">
					<div className="min-w-0 w-full lg:max-w-3xl">
						<p className="font-heading mb-4 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-rose-300 sm:tracking-[0.22em]">
							<span className="block h-px w-8 bg-rose-400/80" aria-hidden />
							{content.eyebrow}
						</p>
						<h1 className="w-full max-w-none text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:leading-[1.05] lg:text-[clamp(2rem,4.2vw,4rem)] lg:leading-[1.02]">
							{content.title}
						</h1>
						<p className="font-body mt-4 max-w-[60ch] text-base leading-relaxed text-slate-300 sm:text-lg">
							{content.description}
						</p>

						<div className="font-body mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-3 py-1 text-xs font-medium text-slate-200">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-400/15 text-rose-300">
								<CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
							</span>
							<span>{settings.yearsInBusiness} years in business</span>
						</div>

						<div className="mt-6">
							<HeroActions primary={content.primaryCta} secondary={content.secondaryCta} />
						</div>

						<div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/65 px-5 py-4 text-sm text-slate-300 backdrop-blur-sm">
							<p className="font-heading mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:tracking-[0.2em]">
								Who Jayco serves
							</p>
							<p className="font-body m-0 text-pretty leading-relaxed text-slate-200">
								Industrial buyers planning plant upgrades, workshop handling systems, and site-specific lifting requirements
								need a clear path to quote, product fit, and support.
							</p>
						</div>
					</div>

					<div className="relative hidden lg:block">
						<div className="relative overflow-hidden rounded-4xl border border-white/12 bg-slate-900 shadow-[0_32px_80px_rgba(2,6,23,0.45)]">
							<div className="absolute inset-x-0 top-0 z-10 hidden items-center justify-between gap-3 border-b border-white/10 bg-slate-950/72 px-5 py-4 backdrop-blur-md lg:flex">
							</div>

							<div className="relative aspect-[4/4.4] sm:aspect-[5/4.4] lg:aspect-4/4">
								<Image
									src="/images/hero.jpeg"
									alt="Jayco industrial lifting equipment in a manufacturing environment"
									fill
									priority
									sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 100vw"
									className="object-cover object-center"
								/>
								<div
									className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/18 to-slate-950/14"
									aria-hidden
								/>
							</div>

							<div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
								<div className="rounded-[1.75rem] border border-white/12 bg-slate-950/82 p-5 backdrop-blur-md">
									<p className="font-heading mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:tracking-[0.18em]">
										Core product coverage
									</p>
									<ul className="m-0 grid list-none gap-3 p-0">
										{content.visualHighlights.map((item) => (
											<li key={item} className="font-heading flex items-start gap-3 text-sm font-medium text-slate-100">
												<span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-400" aria-hidden />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
