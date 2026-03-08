import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { JsonLd } from "@/components/ui/json-ld";
import {
	getGalleryCategories,
	getProductCategories,
	getProductCategoryBySlug,
	getProducts,
	getProductsByCategory,
} from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

type CategoryPageProps = {
	params: Promise<{ categorySlug: string }>;
};

export async function generateStaticParams() {
	const categories = await getProductCategories();
	return categories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
	const { categorySlug } = await params;
	const category = await getProductCategoryBySlug(categorySlug);
	if (!category) {
		return buildMetadata({
			title: "Product Category",
			description: "Industrial product category.",
			path: "/products",
			indexable: false,
		});
	}

	return buildMetadata({
		title: category.name,
		description: category.seoCopy,
		path: `/products/${category.slug}`,
		imagePath: category.heroImage.src,
	});
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const { categorySlug } = await params;
	const [category, products, allCategories, allProducts, galleryCategories] = await Promise.all([
		getProductCategoryBySlug(categorySlug),
		getProductsByCategory(categorySlug),
		getProductCategories(),
		getProducts(),
		getGalleryCategories(),
	]);

	if (!category) {
		notFound();
	}

	const relatedCategories = allCategories.filter((entry) => category.relatedCategorySlugs.includes(entry.slug));
	const popularProducts = products.slice(0, 3);
	const productSlugs = new Set(products.map((product) => product.slug));
	const galleryProof = galleryCategories.filter((gallery) =>
		gallery.images.some((image) => image.productSlug && productSlugs.has(image.productSlug)),
	);
	const linkedProducts = allProducts.reduce<Map<string, { slug: string; categorySlug: string; name: string }>>((map, product) => {
		map.set(product.slug, { slug: product.slug, categorySlug: product.categorySlug, name: product.name });
		return map;
	}, new Map());

	return (
		<main className="flex min-h-screen flex-col bg-slate-50">
			<JsonLd
				data={buildBreadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "Products", path: "/products" },
					{ name: category.name, path: `/products/${category.slug}` },
				])}
			/>
			
			{/* Category Hero */}
			<section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40">
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
								{ name: "Products", path: "/products" },
								{ name: category.name, path: `/products/${category.slug}` },
							]}
						/>
					</div>
					
					<div className="max-w-3xl">
						<h1 className="mb-6 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white">
							{category.name} <span className="text-amber-500">Systems.</span>
						</h1>
						<p className="max-w-[54ch] text-sm text-slate-400 lg:text-base">
							{category.intro}
						</p>
					</div>
				</div>
				
				{/* Caution stripe decoration */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-60" />
			</section>

			<section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
				<div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
					
					{/* Sidebar */}
					<div className="flex w-full shrink-0 flex-col gap-8 lg:sticky lg:top-32 lg:w-72">
						{/* Context menu block */}
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
								Overview
							</h3>
							<nav className="flex flex-col gap-3 text-sm font-medium">
								<a href="#products" className="text-slate-600 transition hover:text-amber-600">
									Available Products
								</a>
								<a href="#related" className="text-slate-600 transition hover:text-amber-600">
									Related Categories
								</a>
								<a href="#gallery" className="text-slate-600 transition hover:text-amber-600">
									Gallery Proof
								</a>
							</nav>
						</div>

						{/* Quick Contact CTA */}
						<div className="overflow-hidden rounded-2xl border-t-4 border-amber-500 bg-slate-900 p-6 shadow-sm">
							<p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-500">Engineering Support</p>
							<p className="mb-6 text-sm text-slate-400">
								Need detailed specifications for our {category.name.toLowerCase()}?
							</p>
							<Link 
								href="/contact"
								className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-amber-400"
							>
								Request Specs
							</Link>
						</div>
					</div>

					{/* Main Content Area */}
					<div className="flex-1 space-y-24">
						
						{/* Products Array */}
						<div id="products" className="scroll-mt-32">
							<div className="mb-8 border-b border-slate-200 pb-4">
								<h2 className="text-2xl font-bold text-slate-900">Engineered Products</h2>
								<p className="text-sm text-slate-500">Browse current configurations for this category.</p>
							</div>
							
							<div className="grid gap-6 sm:grid-cols-2">
								{products.map((product) => (
									<ProductCard key={product.slug} product={product} />
								))}
							</div>
						</div>

						{/* Related Context Matrix */}
						<div className="grid gap-12 sm:grid-cols-2">
							
							{/* Related Categories */}
							{relatedCategories.length > 0 && (
								<div id="related" className="scroll-mt-32">
									<h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-900">
										<span className="block h-px w-4 bg-amber-500" />
										Related Categories
									</h3>
									<ul className="flex flex-col gap-3">
										{relatedCategories.map((entry) => (
											<li key={entry.slug}>
												<Link 
													href={`/products/${entry.slug}`}
													className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-500"
												>
													<span className="font-semibold text-slate-700">{entry.name}</span>
													<svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400 transition group-hover:text-amber-500" aria-hidden>
														<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Popular Products Sidebar */}
							{popularProducts.length > 0 && (
								<div>
									<h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-900">
										<span className="block h-px w-4 bg-amber-500" />
										Popular in Category
									</h3>
									<ul className="flex flex-col gap-3">
										{popularProducts.map((product) => (
											<li key={product.slug}>
												<Link 
													href={`/products/${product.categorySlug}/${product.slug}`}
													className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-500"
												>
													<span className="font-semibold text-slate-700 line-clamp-1">{product.name}</span>
													<svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400 transition group-hover:text-amber-500" aria-hidden>
														<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>

						{/* Proof of Work Gallery Links */}
						{galleryProof.length > 0 && (
							<div id="gallery" className="scroll-mt-32">
								<div className="mb-8 border-b border-slate-200 pb-4">
									<h2 className="text-2xl font-bold text-slate-900">Proof of Capability</h2>
									<p className="text-sm text-slate-500">Real-world applications of these systems.</p>
								</div>
								
								<div className="grid gap-4 sm:grid-cols-2">
									{galleryProof.map((gallery) => (
										<Link 
											key={gallery.slug}
											href={`/gallery/${gallery.slug}`}
											className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-amber-500 hover:shadow-md"
										>
											<div className="p-5 line-clamp-1 font-semibold text-slate-900 transition group-hover:text-amber-600">
												{gallery.name}
											</div>
										</Link>
									))}
								</div>
							</div>
						)}
						
					</div>
				</div>
			</section>
		</main>
	);
}
