import Image from "next/image"

export function SupportSection() {
	return (
		<section aria-label="Get support" className="bg-slate-50 py-16 lg:py-20">
			<div className="mx-auto max-w-6xl px-4 lg:px-6">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
					<div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
						<div className="relative aspect-4/3 w-full">
							<Image
								src="/images/call-us-banner.jpg"
								alt="Call us for equipment support"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
								priority
							/>
						</div>
					</div>

					<div>
						<p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-red-800">
							GET SUPPORT
						</p>
						<p className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-bold leading-tight tracking-tight text-slate-950">
							Need help finding the right equipment?
						</p>
						<p className="mt-4 text-base font-medium leading-relaxed text-slate-700">
							Call us at{" "}
							<a
								href="tel:+9102502390252"
								className="font-semibold text-slate-950 underline decoration-slate-200 underline-offset-4 transition-colors hover:decoration-red-400"
							>
								+91 0250-2390252
							</a>{" "}
							and we will make it happen.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

