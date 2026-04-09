import { JsonLd } from "@/components/ui/json-ld"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSpecialFeaturesSection } from "@/components/sections/about-special-features-section"
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
			<HeroSection settings={settings} products={products} categories={categories} />
			<EquipmentGridSection products={products} />
			<AboutSpecialFeaturesSection settings={settings} />
			<FeaturedProductsSection products={featuredProducts} />
			<ClientsSection clients={clientList} settings={settings} />
			<CategoriesSection categories={categories} />
			<section aria-label="Support and careers" className="bg-slate-50 py-16 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
						<SupportSection variant="card" />
						<CareersDisciplinedSection variant="card" />
					</div>
				</div>
			</section>
			<GalleryTeaserSection galleryCategories={galleryCategories} />
		</main>
	)
}
