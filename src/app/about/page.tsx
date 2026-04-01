import { AboutPage } from "@/components/about/about-page"
import { JsonLd } from "@/components/ui/json-ld"
import { getProductCategories, getProducts, getSiteSettings } from "@/lib/cms"
import { buildAboutPageContent } from "@/lib/content/about"
import { buildMetadata } from "@/lib/seo/metadata"
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/seo/schema"

export async function generateMetadata() {
	return buildMetadata({
		title: "About Jayco",
		description:
			"Company profile for Jayco Hoist & Cranes Mfg. Co., covering industrial lifting expertise, product scope, sectors served, and support capabilities.",
		path: "/about",
	})
}

export default async function About() {
	const [settings, categories, products] = await Promise.all([
		getSiteSettings(),
		getProductCategories(),
		getProducts(),
	])

	const content = buildAboutPageContent(settings, categories, products)

	return (
		<>
			<JsonLd data={buildOrganizationSchema(settings)} />
			<JsonLd
				data={buildBreadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "About", path: "/about" },
				])}
			/>
			<AboutPage content={content} />
		</>
	)
}
