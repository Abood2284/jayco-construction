import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGalleryCategories, getGalleryCategoryBySlug, getProductBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";

type GalleryCategoryPageProps = {
	params: Promise<{ galleryCategorySlug: string }>;
};

export async function generateStaticParams() {
	const categories = await getGalleryCategories();
	return categories.map((category) => ({ galleryCategorySlug: category.slug }));
}

export async function generateMetadata({ params }: GalleryCategoryPageProps) {
	const { galleryCategorySlug } = await params;
	const category = await getGalleryCategoryBySlug(galleryCategorySlug);
	if (!category) {
		return buildMetadata({
			title: "Gallery",
			description: "Industrial gallery category.",
			path: "/gallery",
			indexable: false,
		});
	}

	return buildMetadata({
		title: `${category.name} Gallery`,
		description: `Project and production visuals for ${category.name.toLowerCase()} workflows.`,
		path: `/gallery/${category.slug}`,
		imagePath: category.images[0]?.src,
	});
}

import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default async function GalleryCategoryPage({ params }: GalleryCategoryPageProps) {
	const { galleryCategorySlug } = await params;
	const category = await getGalleryCategoryBySlug(galleryCategorySlug);
	if (!category) {
		notFound();
	}

	return (
		<main className="flex min-h-screen flex-col bg-slate-50 pb-20 lg:pb-28">
			{/* Page Hero */}
			<section className="relative overflow-hidden bg-slate-950 px-4 pb-16 pt-32 lg:px-6 lg:pb-20 lg:pt-40 text-white">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
					}}
				/>
				<div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-500 opacity-10 blur-[100px]" />

				<div className="relative mx-auto max-w-6xl">
					<div className="mb-6">
						<Breadcrumbs
							items={[
								{ name: "Home", path: "/" },
								{ name: "Gallery", path: "/gallery" },
								{ name: category.name, path: `/gallery/${category.slug}` },
							]}
						/>
					</div>

					<div className="max-w-3xl">
						<p className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-500">
							<span className="block h-px w-6 bg-amber-500" />
							Project Photography
						</p>
						<h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white">
							{category.name} <span className="text-slate-400">Installations.</span>
						</h1>
					</div>
				</div>

				{/* Caution stripe decoration */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-60" />
			</section>

			{/* Masonry-style Image Grid */}
			<section className="mx-auto mt-12 w-full max-w-6xl px-4 lg:mt-16 lg:px-6">
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{await Promise.all(
						category.images.map(async (image, index) => {
							const product = image.productSlug ? await getProductBySlug(image.productSlug) : null;
							return (
								<figure 
									key={`${image.src}-${index}`} 
									className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
								>
									<div className="relative aspect-square w-full overflow-hidden bg-slate-100 sm:aspect-[4/3]">
										<Image
											src={image.src}
											alt={image.alt}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-105"
											sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
											loading="lazy"
										/>
									</div>
									<figcaption className="p-4">
										{product ? (
											<Link 
												href={`/products/${product.categorySlug}/${product.slug}`}
												className="flex items-center justify-between gap-2 transition-colors hover:text-amber-600"
											>
												<div>
													<span className="block text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
														Engineered System
													</span>
													<span className="mt-1 block text-sm font-semibold text-slate-900 transition-colors group-hover:text-amber-600">
														{product.name}
													</span>
												</div>
												<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-amber-600" aria-hidden="true">
													<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										) : (
											<span className="block text-sm font-medium text-slate-600">
												{image.alt || "Field installation view"}
											</span>
										)}
									</figcaption>
								</figure>
							);
						}),
					)}
				</div>
			</section>
		</main>
	);
}
