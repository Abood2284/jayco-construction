import Image from "next/image"
import type { Client } from "@/lib/cms/types"

interface ClientsSectionProps {
	clients: Client[]
}

export function ClientsSection({ clients }: ClientsSectionProps) {
	if (!clients.length) return null

	const doubled = [...clients, ...clients]

	return (
		<section className="overflow-hidden border-y border-slate-100 bg-slate-50 py-16">
			<div className="mx-auto mb-8 max-w-6xl px-4 lg:px-6">
				<p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
					Trusted by industry leaders
				</p>
			</div>

			{/* Row 1 — scrolls left */}
			<div className="relative mb-4">
				<div className="flex w-max gap-4" style={{ animation: "marquee-left 52s linear infinite" }}>
					{doubled.map((client, idx) => (
						<div
							key={`${client.name}-${idx}`}
							className="flex h-16 w-36 shrink-0 items-center justify-center rounded-sm border border-slate-200 bg-white px-4 shadow-sm"
						>
							<div className="relative h-full w-full">
								<Image
									src={client.logo.src}
									alt={client.logo.alt}
									fill
									sizes="120px"
									className="object-contain p-2 opacity-80"
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Row 2 — scrolls right */}
			<div className="relative">
				<div className="flex w-max gap-4" style={{ animation: "marquee-right 60s linear infinite" }}>
					{[...doubled].reverse().map((client, idx) => (
						<div
							key={`${client.name}-r${idx}`}
							className="flex h-16 w-36 shrink-0 items-center justify-center rounded-sm border border-slate-200 bg-white px-4 shadow-sm"
						>
							<div className="relative h-full w-full">
								<Image
									src={client.logo.src}
									alt={client.logo.alt}
									fill
									sizes="120px"
									className="object-contain p-2 opacity-90"
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			<style>{`
				@keyframes marquee-left {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
				@keyframes marquee-right {
					from { transform: translateX(-50%); }
					to { transform: translateX(0); }
				}
			`}</style>
		</section>
	)
}
