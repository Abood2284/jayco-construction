import Image from "next/image"
import type { SiteSettings } from "@/lib/cms/types"
import { CheckCircle2, ShieldCheck, Factory, PiggyBank } from "lucide-react"

interface CapabilityBandProps {
	settings: SiteSettings
}

export function CapabilityBand({ settings }: CapabilityBandProps) {
	const values = [
		{
			title: "40+ Years",
			description: "Proven industry expertise.",
			icon: <ShieldCheck className="mb-2 h-5 w-5 text-amber-600 sm:mb-3 sm:h-6 sm:w-6" />
		},
		{
			title: "Premium Quality",
			description: "Strong, sturdy & safe.",
			icon: <CheckCircle2 className="mb-2 h-5 w-5 text-amber-600 sm:mb-3 sm:h-6 sm:w-6" />
		},
		{
			title: "Modular Design",
			description: "Robust & innovative builds.",
			icon: <Factory className="mb-2 h-5 w-5 text-amber-600 sm:mb-3 sm:h-6 sm:w-6" />
		},
		{
			title: "Cost-Effective",
			description: "High quality, accessible pricing.",
			icon: <PiggyBank className="mb-2 h-5 w-5 text-amber-600 sm:mb-3 sm:h-6 sm:w-6" />
		},
	]

	return (
		<section className="relative border-b-4 border-slate-900 bg-white">
			{/* Caution stripe decoration */}
			<div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] border-b-2 border-slate-900 z-10" />
			
			{/* Animated Bulldozer traveling on the stripe */}
			<div 
				className="pointer-events-none absolute -top-[23px] left-0 z-20 w-full overflow-hidden"
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
						className="h-7 w-auto drop-shadow-[2px_2px_0_rgba(15,23,42,1)]"
						unoptimized
					/>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-6">
				<div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
					{values.map((item, idx) => (
						<div 
              key={idx} 
              className="border-2 border-slate-200 bg-slate-50 p-3 transition-all hover:border-slate-400 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] sm:p-6"
            >
							{item.icon}
							<h3 className="mb-1 text-[0.65rem] font-black uppercase tracking-wide text-slate-900 sm:mb-2 sm:text-sm sm:tracking-wider">
								{item.title}
							</h3>
							<p className="text-[0.6rem] font-medium leading-relaxed text-slate-600 sm:text-sm">
                {item.description}
              </p>
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
