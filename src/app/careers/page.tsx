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
			<section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40 text-white">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
					}}
				/>
				<div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-500 opacity-10 blur-[100px]" />

				<div className="relative mx-auto max-w-6xl text-center">
					<p className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-500">
						<span className="block h-px w-6 bg-amber-500" />
						Join The Crew
						<span className="block h-px w-6 bg-amber-500" />
					</p>
					<h1 className="mb-6 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white">
						Build <span className="text-amber-500">Your Future.</span><br />
						Build The <span className="text-slate-400">Industry.</span>
					</h1>
					<p className="mx-auto max-w-[54ch] text-center text-sm text-slate-400 lg:text-base">
						{careers.intro || "Explore fabrication and industrial manufacturing careers with field and workshop opportunities."}
					</p>
				</div>

				{/* Caution stripe decoration */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-60" />
			</section>

			<section className="mx-auto mt-12 w-full max-w-6xl px-4 lg:mt-24 lg:px-6">
				<div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
					
					{/* Left Column: Content */}
					<div className="flex-1 space-y-10">
						<div>
							<h2 className="mb-6 text-3xl font-bold text-slate-900">{careers.title}</h2>
							<div className="prose prose-slate max-w-none text-slate-600">
								<p className="text-lg leading-relaxed">{careers.intro}</p>
							</div>
						</div>

						<div className="rounded-2xl border-t-4 border-t-amber-500 border border-slate-200 bg-white p-8 shadow-sm">
							<h3 className="mb-6 flex items-center gap-3 text-lg font-bold uppercase tracking-wide text-slate-900">
								<svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
								</svg>
								Why Jayco Construction?
							</h3>
							
							<ul className="space-y-4">
								{careers.highlights.map((highlight) => (
									<li key={highlight} className="flex gap-4">
										<div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
											<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
										</div>
										<span className="text-slate-700 leading-relaxed font-medium">{highlight}</span>
									</li>
								))}
							</ul>
						</div>

						{/* Small promo block */}
						<div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 p-8">
							<div className="text-center sm:text-left">
								<h3 className="text-lg font-bold text-white mb-2">Our Capabilities</h3>
								<p className="text-sm text-slate-400 max-w-[40ch]">From pressure vessels to towering structural platforms, discover what our teams build every single day.</p>
							</div>
							<a href="/products" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-amber-400">
								View Products
								<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
							</a>
						</div>
					</div>
					
					{/* Right Column: Application Form */}
					<div className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md lg:w-[480px]">
						<div className="mb-8 text-center">
							<span className="inline-block rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 mb-4">
								Open Application
							</span>
							<h3 className="mb-2 text-2xl font-bold text-slate-900">Apply Now</h3>
							<p className="text-sm text-slate-500">
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
