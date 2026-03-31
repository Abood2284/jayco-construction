import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

function CareersDisciplinedSection() {
	return (
		<section className="bg-slate-50 py-16 lg:py-20">
			<div className="mx-auto max-w-6xl px-4 lg:px-6">
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#b71c1c] to-[#ef4444] p-6 shadow-[0_35px_90px_rgba(183,28,28,0.25)] lg:p-10">
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_15%_20%,rgba(255,255,255,0.14),transparent_45%),radial-gradient(500px_circle_at_85%_60%,rgba(0,0,0,0.18),transparent_55%)]" />

					<div className="relative grid items-center gap-10 lg:grid-cols-2">
						<div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5">
							<div className="aspect-[4/3] w-full">
								<Image
									src="/images/career-section.webp"
									alt="Welding and disciplined manufacturing"
									fill
									className="object-cover"
									priority
								/>
							</div>
						</div>

						<div>
							<p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/90">
								Careers
							</p>

							<h2 className="text-[clamp(1.8rem,3vw,2.7rem)] font-bold leading-[1.08] tracking-tight text-white">
								Join the people behind disciplined manufacturing.
							</h2>

							<p className="mt-4 max-w-[46ch] text-base font-medium leading-relaxed text-white/85">
								Help us deliver consistent, quality-first manufacturing through strong documentation, operational rigor, and a
								culture that values ownership.
							</p>

							<div className="mt-6">
								<Link
									href="/careers"
									className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3 text-sm font-semibold uppercase tracking-wide text-[#b71c1c] shadow-sm transition-colors hover:bg-[#ffe5e5]"
								>
									View Careers
									<ArrowRight className="h-4 w-4" aria-hidden />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export { CareersDisciplinedSection }

