import { JsonLd } from "@/components/ui/json-ld"
import { HeroSection } from "@/components/sections/hero-section"
import { CapabilityBand } from "@/components/sections/capability-band"
import { CategoriesSection } from "@/components/sections/categories-section"
import { FeaturedProductsSection } from "@/components/sections/featured-products-section"
import { ClientsSection } from "@/components/sections/clients-section"
import { GalleryTeaserSection } from "@/components/sections/gallery-teaser-section"
import {
	getClients,
	getFeaturedProducts,
	getGalleryCategories,
	getProductCategories,
	getSiteSettings,
} from "@/lib/cms"
import { buildMetadata } from "@/lib/seo/metadata"
import { buildOrganizationSchema } from "@/lib/seo/schema"

export async function generateMetadata() {
	return buildMetadata({
		title: "Heavy-Industrial Manufacturing Solutions",
		description:
			"Engineered material handling systems, pressure vessels, and fabrication services with industrial-grade performance and lifecycle support.",
		path: "/",
	})
}

export default async function Home() {
	const [settings, categories, featuredProducts, clientList, galleryCategories] = await Promise.all([
		getSiteSettings(),
		getProductCategories(),
		getFeaturedProducts(),
		getClients(),
		getGalleryCategories(),
	])

	return (
		<main>
			<JsonLd data={buildOrganizationSchema(settings)} />
			<HeroSection settings={settings} />
			<CapabilityBand settings={settings} />
			<CategoriesSection categories={categories} />
			<FeaturedProductsSection products={featuredProducts} />
			<ClientsSection clients={clientList} />
			<GalleryTeaserSection galleryCategories={galleryCategories} />
		</main>
	)
}
