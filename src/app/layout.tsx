import type { Metadata } from "next"
import { Suspense } from "react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import {
	getProductCategories,
	getProducts,
	getSiteSettings,
} from "@/lib/cms"
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
	const [settings, categories, products] = await Promise.all([
		getSiteSettings(),
		getProductCategories(),
		getProducts(),
	])

	return (
		<html lang="en">
			<body className={`${headingFont.variable} ${bodyFont.variable} pb-24 lg:pb-0`}>
				<Suspense fallback={null}>
					<Header settings={settings} categories={categories} />
				</Suspense>
				<div className="lg:pt-[84px]">
					{children}
				</div>
				<Footer settings={settings} products={products} />
			</body>
		</html>
	)
}
