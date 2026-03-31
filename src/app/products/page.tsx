import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductsCatalog } from "@/components/products/products-catalog";
import { JsonLd } from "@/components/ui/json-ld";
import { getProducts, getProductCategories } from "@/lib/cms";
import type { Product } from "@/lib/cms/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export async function generateMetadata() {
	return buildMetadata({
		title: "Products",
		description:
			"Browse industrial product categories including material handling systems, pressure vessels, and fabrication packages.",
		path: "/products",
	});
}

type ProductsPageProps = {
	searchParams?: {
		query?: string | string[] | undefined;
	};
};

function normalizeQuery(raw: string) {
	return raw.trim().toLowerCase();
}

function productMatchesQuery(
	product: Product,
	categoryName: string | undefined,
	normalizedQuery: string,
) {
	if (!normalizedQuery) return true;

	const candidates = [
		product.name,
		product.description,
		categoryName,
		product.ctaLabel ?? "",
		...product.features,
		...product.applications,
		...product.complianceNotes,
		...product.faq.flatMap((f) => [f.question, f.answer]),
		...product.specs.flatMap((s) => [s.label, s.value]),
		...(product.additionalInfo ?? []).flatMap((s) => [s.label, s.value]),
	]
		.filter((value): value is string => typeof value === "string" && value.length > 0)
		.map((value) => value.toLowerCase());

	return candidates.some((value) => value.includes(normalizedQuery));
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
	const queryRaw = searchParams?.query;
	const query =
		typeof queryRaw === "string"
			? queryRaw
			: Array.isArray(queryRaw)
				? queryRaw[0] ?? ""
				: "";
	const normalizedQuery = normalizeQuery(query);

	const [categories, allProducts] = await Promise.all([getProductCategories(), getProducts()]);

	const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
	const filteredProducts = normalizedQuery
		? allProducts.filter((product) =>
				productMatchesQuery(product, categoryBySlug.get(product.categorySlug)?.name, normalizedQuery),
			)
		: allProducts;

	return (
		<main className="flex min-h-screen flex-col">
			<JsonLd
				data={buildBreadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "Products", path: "/products" },
				])}
			/>
			
			{/* Page Hero */}
			<section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.05]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
					}}
				/>
				<div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] bg-amber-500 opacity-10 blur-[100px]" />

				<div className="relative mx-auto max-w-6xl">
					<div className="mb-6">
						<Breadcrumbs
							items={[
								{ name: "Home", path: "/" },
								{ name: "Products", path: "/products" },
							]}
						/>
					</div>
					
					<div className="max-w-2xl">
						<p className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-400/95">
							<span className="block h-px w-6 bg-amber-400/90" />
							Products &amp; systems
						</p>
						<h1 className="mb-5 text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-white">
							{normalizedQuery ? `Search results for "${query}"` : "Heavy-industrial material handling, organized by application"}
						</h1>
						<p className="max-w-[54ch] text-base font-medium leading-relaxed text-slate-400 lg:text-lg">
							{normalizedQuery
								? `Showing ${filteredProducts.length} matching product${filteredProducts.length === 1 ? "" : "s"}. Refine your search by trying a capability, application, or model keyword.`
								: "Browse hoists, lifts, cranes, and allied equipment with clear categories, imagery, and paths to engineering support when you are ready to specify."}
						</p>
					</div>
				</div>

				<div className="absolute bottom-0 left-0 right-0 h-px bg-slate-700/80" aria-hidden />
			</section>

			{/* Interactive Catalog Layout */}
			<section className="bg-slate-50 py-12 lg:py-24">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<ProductsCatalog categories={categories} products={filteredProducts} />
				</div>
			</section>
		</main>
	);
}
