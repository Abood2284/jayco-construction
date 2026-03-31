import Image from "next/image"
import type { Client } from "@/lib/cms/types"

interface ClientsSectionProps {
	clients: Client[]
}

export function ClientsSection({ clients }: ClientsSectionProps) {
	if (!clients.length) return null

	const doubled = [...clients, ...clients]

	return (
		<section
			aria-label="Trusted by industry leaders"
			className="overflow-hidden border-y border-slate-100 bg-slate-50 py-16"
		>
			<div className="mx-auto mb-8 max-w-6xl px-4 lg:px-6">
				<p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
					Trusted by industry leaders
				</p>
			</div>

			<div className="relative mb-4">
				<ul
					className="m-0 flex w-max list-none gap-3 p-0 motion-safe:animate-[marquee-left_150s_linear_infinite] lg:gap-4"
					aria-live="off"
				>
					{doubled.map((client, idx) => (
						<li
							key={`${client.name}-${idx}`}
							className="flex h-28 w-56 shrink-0 items-center justify-center lg:h-36 lg:w-72"
							aria-hidden={idx >= clients.length}
						>
							<Image
								src={client.logo.src}
								alt={client.logo.alt}
								width={client.logo.width}
								height={client.logo.height}
								sizes="(min-width: 1024px) 288px, 224px"
								className="max-h-full w-auto max-w-full object-contain opacity-90"
							/>
						</li>
					))}
				</ul>
			</div>

			<style>{`
				@keyframes marquee-left {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
			`}</style>
		</section>
	)
}
