import Link from "next/link";
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
			<section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40">
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

						<div className="relative rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
							<h3 className="mb-8 flex items-center gap-3 text-lg font-bold uppercase tracking-wide text-slate-900">
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
						<div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-md sm:flex-row">
							<div className="relative z-10 text-center sm:text-left">
								<h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-white">Our capabilities</h3>
								<p className="max-w-[40ch] text-sm font-medium text-slate-400">From pressure vessels to towering structural platforms, discover what our teams build every single day.</p>
							</div>
							<Link
								href="/products"
								className="relative z-10 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-amber-500 px-6 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-sm transition-colors hover:bg-amber-400"
							>
								View products
								<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" /></svg>
							</Link>
						</div>
					</div>
					
					{/* Right Column: Application Form */}
					<div className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:w-[480px]">
						<div className="mb-8 border-b border-slate-100 pb-6 text-center">
							<span className="mb-4 inline-block rounded-md bg-amber-100 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-950">
								Open application
							</span>
							<h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">Apply now</h3>
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
