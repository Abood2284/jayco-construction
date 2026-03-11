import { CareerForm } from "@/components/sections/career-form";
import { getCareersPage } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
	return buildMetadata({
		title: "Careers",
		description: "Explore fabrication and industrial manufacturing careers with field and workshop opportunities.",
		path: "/careers",
	});
}

export default async function CareersPage() {
	const careers = await getCareersPage();

	return (
		<main className="flex min-h-screen flex-col bg-slate-50 pb-20 lg:pb-28">
			{/* Page Hero */}
			<section className="relative overflow-hidden border-b-4 border-slate-900 bg-slate-50 px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40">
				{/* Industrial Background Grid */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.06]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 40px,#0f172a 40px,#0f172a 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#0f172a 40px,#0f172a 41px)",
					}}
				/>
				{/* Accent Blur */}
				<div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] bg-amber-500 opacity-10 blur-[100px]" />

				<div className="relative mx-auto max-w-6xl text-center">
					<p className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-amber-600">
						<span className="block h-px w-6 bg-amber-500" />
						Join The Crew
						<span className="block h-px w-6 bg-amber-500" />
					</p>
					<h1 className="mb-6 text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.1] tracking-tighter text-slate-900">
						Build <span className="text-amber-600">Your Future.</span><br />
						Build The <span className="text-slate-400">Industry.</span>
					</h1>
					<p className="mx-auto max-w-[54ch] text-sm font-medium text-slate-600 lg:text-base">
						{careers.intro || "Explore fabrication and industrial manufacturing careers with field and workshop opportunities."}
					</p>
				</div>

				{/* Heavy Hazard Stripe Border */}
				<div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)]" />
			</section>

			<section className="mx-auto mt-12 w-full max-w-6xl px-4 lg:mt-24 lg:px-6">
				<div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
					
					{/* Left Column: Content */}
						<div className="flex-1 space-y-12">
						<div>
							<h2 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight text-slate-900">
                                {careers.title}
                            </h2>
							<div className="prose prose-slate max-w-none">
								<p className="text-lg font-medium leading-relaxed text-slate-600">{careers.intro}</p>
							</div>
						</div>

						<div className="border-2 border-slate-900 bg-white p-8 shadow-[4px_4px_0_0_rgba(15,23,42,1)] relative">
                            {/* Decorative Corner Accents */}
                            <div className="absolute left-0 top-0 h-4 w-4 border-l-4 border-t-4 border-amber-500 -mt-1 -ml-1" />
                            <div className="absolute right-0 top-0 h-4 w-4 border-r-4 border-t-4 border-amber-500 -mt-1 -mr-1" />

							<h3 className="mb-8 flex items-center gap-3 text-lg font-black uppercase tracking-widest text-slate-900">
								<svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
								</svg>
								Why Jayco Cranes?
							</h3>
							
							<ul className="space-y-6">
								{careers.highlights.map((highlight) => (
									<li key={highlight} className="flex gap-4">
										<div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center bg-slate-900 text-amber-500">
											<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M20 6 9 17l-5-5"/></svg>
										</div>
										<span className="text-slate-700 leading-relaxed font-bold">{highlight}</span>
									</li>
								))}
							</ul>
						</div>

						{/* Small promo block */}
						<div className="border-2 border-slate-900 bg-slate-900 p-8 shadow-[4px_4px_0_0_rgba(245,158,11,1)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 h-full w-1/3 bg-amber-500/10 skew-x-12 translate-x-1/2 transition-transform duration-500 group-hover:translate-x-full" />
							<div className="relative text-center sm:text-left z-10">
								<h3 className="text-lg font-black uppercase tracking-wider text-white mb-2">Our Capabilities</h3>
								<p className="text-sm font-medium text-slate-400 max-w-[40ch]">From pressure vessels to towering structural platforms, discover what our teams build every single day.</p>
							</div>
							<a href="/products" className="relative z-10 inline-flex shrink-0 h-12 items-center justify-center gap-2 bg-amber-500 px-6 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-amber-400 shadow-[4px_4px_0_0_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none">
								View Products
								<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" /></svg>
							</a>
						</div>
					</div>
					
					{/* Right Column: Application Form */}
					<div className="w-full shrink-0 border-2 border-slate-900 bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_rgba(15,23,42,1)] lg:w-[480px]">
						<div className="mb-8 text-center border-b-2 border-slate-100 pb-6">
							<span className="inline-block bg-amber-500 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-950 mb-4">
								Open Application
							</span>
							<h3 className="mb-3 text-3xl font-black uppercase tracking-tight text-slate-900">Apply Now</h3>
							<p className="text-sm font-medium text-slate-500 px-4">
								Submit your details to join our specialized crews and manufacturing teams.
							</p>
						</div>
						
						<CareerForm sourcePath="/careers" />
					</div>
				</div>
			</section>
		</main>
	);
}
