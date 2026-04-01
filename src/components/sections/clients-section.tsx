import Image from "next/image"
import type { Client, SiteSettings } from "@/lib/cms/types"
import { buildHomepageLogoProofContent } from "@/lib/content/homepage"
import { SectionCtaRow } from "@/components/sections/section-cta-row"

interface ClientsSectionProps {
	clients: Client[]
	settings: SiteSettings
}

export function ClientsSection({ clients, settings }: ClientsSectionProps) {
	if (!clients.length) return null

	const content = buildHomepageLogoProofContent(clients, settings)

	if (!content.logos.length) return null

	return (
		<section
			aria-labelledby="homepage-client-proof-title"
			className="border-y border-slate-200 bg-slate-50 py-18 sm:py-20"
		>
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.44fr)] lg:items-start">
					<div>
						<p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-rose-700">
							{content.eyebrow}
						</p>
						<h2
							id="homepage-client-proof-title"
							className="max-w-[16ch] text-[clamp(1.8rem,2.8vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em] text-slate-950"
						>
							{content.title}
						</h2>
						<p className="mt-4 max-w-[62ch] text-sm leading-7 text-slate-600 sm:text-base">
							{content.description}
						</p>
					</div>

					<div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-rose-700">
							Why this proof stays compact
						</p>
						<p className="mt-3 text-sm leading-6 text-slate-600">
							{content.supportingStatement}
						</p>
						<SectionCtaRow primary={content.primaryCta} secondary={content.secondaryCta} className="mt-5" />
					</div>
				</div>

				<ClientLogoGrid logos={content.logos} />
			</div>
		</section>
	)
}

function ClientLogoGrid({ logos }: { logos: Client[] }) {
	return (
		<ul
			aria-label="Selected client logos"
			className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
		>
			{logos.map((client, index) => (
				<li
					key={`${client.logo.src}-${index}`}
					className={`overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-sm ${getLogoVisibilityClass(index)}`}
				>
					<div className="flex aspect-video items-center justify-center px-2 py-3 sm:px-3 sm:py-4">
						<Image
							src={client.logo.src}
							alt=""
							width={client.logo.width}
							height={client.logo.height}
							sizes="(max-width: 639px) 44vw, (max-width: 767px) 28vw, (max-width: 1023px) 22vw, 14vw"
							className="max-h-14 w-auto max-w-48 object-contain transition duration-300 sm:max-h-16 sm:max-w-52"
						/>
					</div>
				</li>
			))}
		</ul>
	)
}

function getLogoVisibilityClass(index: number) {
	if (index < 4) return ""
	if (index < 6) return "hidden sm:block"
	if (index < 8) return "hidden md:block"
	return "hidden lg:block"
}
