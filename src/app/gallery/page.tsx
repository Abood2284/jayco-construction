import Image from "next/image";
import Link from "next/link";
import { getGalleryCategories } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
	return buildMetadata({
		title: "Gallery",
		description: "Industrial fabrication and site installation gallery categorized for crawlable project proof.",
		path: "/gallery",
	});
}

export default async function GalleryPage() {
	const categories = await getGalleryCategories();

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
						Project Capabilities
						<span className="block h-px w-6 bg-amber-500" />
					</p>
					<h1 className="mb-6 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white">
						Real-World <span className="text-slate-400">Proof.</span><br />
						Built For <span className="text-amber-400">Industry.</span>
					</h1>
					<p className="mx-auto max-w-[54ch] text-center text-sm text-slate-400 lg:text-base">
						Explore fabrication, workshop, and field delivery visuals by category. Witness our heavy-industrial systems in action, engineered and built to exacting standards.
					</p>
				</div>

				{/* Caution stripe decoration */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-60" />
			</section>

			{/* Gallery Grid */}
			<section className="mx-auto mt-12 w-full max-w-6xl px-4 lg:mt-24 lg:px-6">
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((category) => (
						<Link 
							key={category.slug} 
							href={`/gallery/${category.slug}`}
							className="group relative flex flex-col overflow-hidden rounded-2xl border-t-4 border-t-amber-500 border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
						>
							<div className="relative aspect-video w-full overflow-hidden bg-slate-100">
								<Image
									src={category.images[0].src}
									alt={category.images[0].alt}
									fill
									className="object-cover transition-transform duration-700 group-hover:scale-105"
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>
								<div className="absolute inset-0 bg-slate-900/20 transition-opacity duration-300 group-hover:bg-slate-900/10" />
							</div>
							<div className="flex flex-1 flex-col p-6">
								<div className="mb-2 flex items-center justify-between gap-4">
									<h2 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-amber-600 line-clamp-1">
										{category.name}
									</h2>
									<span className="shrink-0 inline-flex h-6 items-center justify-center rounded-xl bg-slate-100 px-2 text-[0.65rem] font-bold text-slate-500 mt-0.5">
										{category.images.length} Photos
									</span>
								</div>
								
								<div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition-colors group-hover:text-amber-600">
									View Installation
									<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
										<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
							</div>
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
