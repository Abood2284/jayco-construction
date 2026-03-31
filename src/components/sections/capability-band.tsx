import type { SiteSettings } from "@/lib/cms/types"
import { CheckCircle2, ShieldCheck, Factory, PiggyBank } from "lucide-react"

interface CapabilityBandProps {
	settings: SiteSettings
}

export function CapabilityBand({ settings: _settings }: CapabilityBandProps) {
	void _settings
	const values = [
		{
			title: "40+ Years",
			description: "Proven industry resilience and delivery.",
			icon: <ShieldCheck className="mb-2 h-5 w-5 text-amber-700 sm:mb-3 sm:h-6 sm:w-6" />,
		},
		{
			title: "Premium Quality",
			description: "Engineered for safety and load integrity.",
			icon: <CheckCircle2 className="mb-2 h-5 w-5 text-amber-700 sm:mb-3 sm:h-6 sm:w-6" />,
		},
		{
			title: "Modular Design",
			description: "Configurable for site-specific requirements.",
			icon: <Factory className="mb-2 h-5 w-5 text-amber-700 sm:mb-3 sm:h-6 sm:w-6" />,
		},
		{
			title: "Cost-Effective",
			description: "Durable lifecycle value without compromise.",
			icon: <PiggyBank className="mb-2 h-5 w-5 text-amber-700 sm:mb-3 sm:h-6 sm:w-6" />,
		},
	]

	return (
		<section className="border-b border-slate-200 bg-white">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-6">
				<div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
					{values.map((item, idx) => (
						<div
							key={idx}
							className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 shadow-sm transition-shadow hover:border-slate-300 hover:shadow-md sm:p-6"
						>
							{item.icon}
							<h3 className="mb-1 max-w-full text-[0.7rem] font-bold uppercase tracking-wide text-slate-900 sm:mb-2 sm:text-sm sm:tracking-wider">
								{item.title}
							</h3>
							<p className="text-[0.65rem] font-medium leading-relaxed text-slate-600 sm:text-sm">{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
