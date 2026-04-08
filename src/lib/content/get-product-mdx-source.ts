import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { findProductMdxInDatabase } from "@/lib/mongodb/find-product-mdx-source"

const PRODUCTS_ROOT = join(process.cwd(), "content", "products")

export type ProductMdxSourceOrigin = "database" | "filesystem"

export type ProductMdxSourceResult = {
	source: string
	origin: ProductMdxSourceOrigin
}

/**
 * Loads product `index.mdx` text: MongoDB first (when configured and a row exists), else repo file.
 */
export async function getProductMdxSource(
	categorySlug: string,
	productSlug: string,
): Promise<ProductMdxSourceResult | null> {
	const fromDb = await findProductMdxInDatabase(categorySlug, productSlug)
	if (fromDb) return { source: fromDb, origin: "database" }

	const mdxPath = join(PRODUCTS_ROOT, categorySlug, productSlug, "index.mdx")
	try {
		const source = await readFile(mdxPath, "utf8")
		return { source, origin: "filesystem" }
	} catch {
		return null
	}
}
