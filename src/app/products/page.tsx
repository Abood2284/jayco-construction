import { ProductsListingPage } from "@/components/products/products-listing-page";
import { JsonLd } from "@/components/ui/json-ld";
import { getProducts, getProductCategories, getSiteSettings } from "@/lib/cms";
import type { Product } from "@/lib/cms/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export async function generateMetadata() {
	return buildMetadata({
		title: "Product Catalog",
		description:
			"Browse Jayco's industrial cranes, hoists, lifts, stackers, and handling equipment by product family.",
		path: "/products",
	});
}

type ProductsPageProps = {
	searchParams?: Promise<{
		query?: string | string[] | undefined;
	}>;
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
	const resolvedSearchParams = await searchParams;
	const queryRaw = resolvedSearchParams?.query;
	const query =
		typeof queryRaw === "string"
			? queryRaw
			: Array.isArray(queryRaw)
				? queryRaw[0] ?? ""
				: "";
	const normalizedQuery = normalizeQuery(query);

	const [categories, allProducts, settings] = await Promise.all([
		getProductCategories(),
		getProducts(),
		getSiteSettings(),
	]);

	const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
	const filteredProducts = normalizedQuery
		? allProducts.filter((product) =>
				productMatchesQuery(product, categoryBySlug.get(product.categorySlug)?.name, normalizedQuery),
			)
		: allProducts;

	return (
		<>
			<JsonLd
				data={buildBreadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "Products", path: "/products" },
				])}
			/>

			<ProductsListingPage
				categories={categories}
				products={filteredProducts}
				totalCatalogProducts={allProducts.length}
				query={normalizedQuery ? query : undefined}
				supportPhone={settings.phones[0] ?? "+91 0250-2390252"}
			/>
		</>
	);
}
