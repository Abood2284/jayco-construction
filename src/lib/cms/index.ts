import { careersPage, clients, galleryCategories, siteSettings } from "@/lib/cms/data";
import type { GalleryCategory, Product, ProductCategory } from "@/lib/cms/types";
import { loadCatalog, loadCategories, loadProducts } from "@/lib/content/catalog";

export const getSiteSettings = async () => siteSettings;

export const getProductCategories = async () => {
	const categories = await loadCategories();
	return categories;
};

export const getProductCategoryBySlug = async (slug: string) => {
	const categories = await loadCategories();
	return categories.find((category) => category.slug === slug) ?? null;
};

export const getProducts = async () => {
	const products = await loadProducts();
	return products;
};

export const getProductsByCategory = async (categorySlug: string) => {
	const products = await loadProducts();
	return products.filter((product) => product.categorySlug === categorySlug);
};

export const getProductBySlug = async (slug: string) => {
	const products = await loadProducts();
	return products.find((product) => product.slug === slug) ?? null;
};

export const getProductByCategoryAndSlug = async (categorySlug: string, productSlug: string) => {
	const product = await getProductBySlug(productSlug);
	if (!product || product.categorySlug !== categorySlug) {
		return null;
	}
	return product;
};

export const getRelatedProducts = async (product: Product, limit = 4) => {
	const allProducts = await loadProducts();

	const manual = product.relatedProductSlugs
		.map((slug) => allProducts.find((entry) => entry.slug === slug))
		.filter((entry): entry is Product => Boolean(entry));

	const auto = allProducts.filter(
		(entry) =>
			entry.slug !== product.slug &&
			entry.categorySlug === product.categorySlug &&
			!manual.some((manualProduct) => manualProduct.slug === entry.slug),
	);

	return [...manual, ...auto].slice(0, limit);
};

export const getFeaturedProducts = async () => {
	const { categories, products } = await loadCatalog();
	const productBySlug = new Map(products.map((product) => [product.slug, product]));

	const featured = categories.flatMap((category) =>
		category.featuredProductSlugs
			.map((slug) => productBySlug.get(slug))
			.filter((product): product is Product => Boolean(product)),
	);

	const seen = new Set<string>();
	return featured.filter((product) => {
		if (seen.has(product.slug)) {
			return false;
		}
		seen.add(product.slug);
		return true;
	});
};

export const getGalleryCategories = async () => [...galleryCategories];

export const getGalleryCategoryBySlug = async (slug: string) =>
	galleryCategories.find((category) => category.slug === slug) ?? null;

export const getGalleryByProductSlug = async (productSlug: string) =>
	galleryCategories
		.flatMap((category) =>
			category.images
				.filter((image) => image.productSlug === productSlug)
				.map((image) => ({ ...image, galleryCategorySlug: category.slug, galleryCategoryName: category.name })),
		)
		.slice(0, 6);

export const getClients = async () => [...clients];

export const getCareersPage = async () => careersPage;

export const getCategoryMap = (categories: ProductCategory[]) => new Map(categories.map((category) => [category.slug, category]));

export const getGalleryMap = (entries: GalleryCategory[]) => new Map(entries.map((entry) => [entry.slug, entry]));
