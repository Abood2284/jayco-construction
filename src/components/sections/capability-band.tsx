import Image from "next/image"
import type { SiteSettings } from "@/lib/cms/types"

interface CapabilityBandProps {
	settings: SiteSettings
}

export function CapabilityBand({ settings }: CapabilityBandProps) {
	const metrics = [
		{
			value: `${settings.yearsInBusiness}+`,
			label: "Years in Business",
			sub: "Established expertise",
		},
		{
			value: `${settings.industriesServed.length}`,
			label: "Industries Served",
			sub: settings.industriesServed.slice(0, 2).join(" · "),
		},
		{
			value: `${settings.standards.length}`,
			label: "Compliance Standards",
			sub: settings.standards.join(" · "),
		},
		{
			value: "24/7",
			label: "Project Response",
			sub: "Commissioning & support",
		},
	]

	return (
		<section className="relative border-b border-slate-800 bg-slate-950">
			{/* Caution stripe decoration */}
			<div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-80" />
			
			{/* Animated Bulldozer traveling on the stripe */}
			<div 
				className="pointer-events-none absolute -top-[28px] left-0 z-10 w-full overflow-hidden"
				aria-hidden="true"
			>
				<div 
					className="w-max"
					style={{ animation: "drive 25s linear infinite" }}
				>
					<Image 
						src="/images/icons/bulldozer.png" 
						alt="" 
						width={32} 
						height={24} 
						className="h-6 w-auto opacity-80"
						unoptimized
					/>
				</div>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
				<div className="grid grid-cols-2 divide-x divide-y divide-slate-800 lg:grid-cols-4 lg:divide-y-0">
					{metrics.map((metric) => (
						<div key={metric.label} className="px-6 py-8 first:pl-0 lg:last:pr-0">
							<p className="mb-1 text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-amber-400">
								{metric.value}
							</p>
							<p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-200">
								{metric.label}
							</p>
							<p className="text-[0.65rem] text-slate-400">{metric.sub}</p>
						</div>
					))}
				</div>
			</div>

			<style>{`
				@keyframes drive {
					from { transform: translateX(-100px); }
					to { transform: translateX(100vw); }
				}
			`}</style>
		</section>
	)
}
