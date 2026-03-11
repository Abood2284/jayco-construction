import type { Metadata } from "next"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { getFeaturedProducts, getProductCategories, getSiteSettings } from "@/lib/cms"
import { headingFont, bodyFont } from "@/lib/font"
import { siteUrl } from "@/lib/seo/config"
import "./globals.css"

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: "Jayco Hoist & Cranes Mfg. Co.",
	description:
		"Manufacturers of hoists, cranes, and material handling equipment. Trusted by industries across India.",
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const [settings, categories, featuredProducts] = await Promise.all([
		getSiteSettings(),
		getProductCategories(),
		getFeaturedProducts(),
	])

	return (
		<html lang="en">
			<body className={`${headingFont.variable} ${bodyFont.variable}`}>
				<Header settings={settings} categories={categories} featuredProducts={featuredProducts} />
				{children}
				<Footer settings={settings} />
			</body>
		</html>
	)
}
