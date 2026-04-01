import { JsonLd } from "@/components/ui/json-ld"
import { HeroSection } from "@/components/sections/hero-section"
import { EquipmentGridSection } from "@/components/sections/equipment-grid-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { FeaturedProductsSection } from "@/components/sections/featured-products-section"
import { ClientsSection } from "@/components/sections/clients-section"
import { GalleryTeaserSection } from "@/components/sections/gallery-teaser-section"
import { CareersDisciplinedSection } from "@/components/sections/careers-disciplined-section"
import { SupportSection } from "@/components/sections/support-section"
import {
	getClients,
	getFeaturedProducts,
	getGalleryCategories,
	getProductCategories,
	getProducts,
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
	const [settings, categories, featuredProducts, products, clientList, galleryCategories] = await Promise.all([
		getSiteSettings(),
		getProductCategories(),
		getFeaturedProducts(),
		getProducts(),
		getClients(),
		getGalleryCategories(),
	])

	return (
		<main>
			<JsonLd data={buildOrganizationSchema(settings)} />
			<HeroSection settings={settings} products={products} />
			<EquipmentGridSection products={products} categories={categories} />
			<FeaturedProductsSection products={featuredProducts} />
			<ClientsSection clients={clientList} settings={settings} />
			<CategoriesSection categories={categories} />
			<SupportSection />
			<CareersDisciplinedSection />
			<GalleryTeaserSection galleryCategories={galleryCategories} />
		</main>
	)
}
