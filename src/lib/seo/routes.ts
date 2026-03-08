import { getGalleryCategories, getProductCategories, getProducts } from "@/lib/cms";

export type CanonicalRoute = {
	path: string;
	priority: number;
};

export const getCanonicalRoutes = async (): Promise<CanonicalRoute[]> => {
	const [categories, products, galleryCategories] = await Promise.all([
		getProductCategories(),
		getProducts(),
		getGalleryCategories(),
	]);

	const staticRoutes: CanonicalRoute[] = [
		{ path: "/", priority: 1 },
		{ path: "/about", priority: 0.8 },
		{ path: "/clients", priority: 0.7 },
		{ path: "/gallery", priority: 0.75 },
		{ path: "/careers", priority: 0.65 },
		{ path: "/contact", priority: 0.9 },
		{ path: "/products", priority: 0.95 },
	];

	const categoryRoutes = categories.map((category) => ({
		path: `/products/${category.slug}`,
		priority: 0.85,
	}));

	const productRoutes = products.map((product) => ({
		path: `/products/${product.categorySlug}/${product.slug}`,
		priority: 0.8,
	}));

	const galleryRoutes = galleryCategories.map((entry) => ({
		path: `/gallery/${entry.slug}`,
		priority: 0.7,
	}));

	return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...galleryRoutes];
};
