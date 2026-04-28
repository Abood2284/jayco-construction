import type { Metadata } from "next"
import { Suspense } from "react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import {
	getProducts,
	getSiteSettings,
} from "@/lib/cms"
import { headingFont, bodyFont } from "@/lib/font"
import {
	listProductCategoriesFromDatabase,
	type ProductCategoryRecord,
} from "@/lib/mongodb/product-categories"
import { siteUrl } from "@/lib/seo/config"
import "./globals.css"

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: "Jayco Hoist & Cranes Mfg. Co.",
	description:
		"Manufacturers of hoists, cranes, and material handling equipment. Trusted by industries across India.",
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const [settings, rawCategories, products] = await Promise.all([
		getSiteSettings(),
		listProductCategoriesFromDatabase({ includeDrafts: false, includeArchived: false }),
		getProducts(),
	])
	const categories = rawCategories.map(toHeaderCategory)

	return (
		<html lang="en">
			<body className={`${headingFont.variable} ${bodyFont.variable} pb-24 lg:pb-0`}>
				<Suspense fallback={null}>
					<Header settings={settings} categories={categories} />
				</Suspense>
				<div
					className="min-w-0"
					style={{ paddingTop: "var(--site-header-offset, calc(env(safe-area-inset-top, 0px) + 80px))" }}
				>
					{children}
				</div>
				<Footer settings={settings} products={products} />
			</body>
		</html>
	)
}

function toHeaderCategory(category: ProductCategoryRecord) {
	return {
		slug: category.slug,
		name: category.name,
		intro: category.intro ?? "",
		seoCopy: category.seoCopy ?? "",
		order: category.order,
		status: category.status,
		createdAt: category.createdAt,
		updatedAt: category.updatedAt,
	}
}
