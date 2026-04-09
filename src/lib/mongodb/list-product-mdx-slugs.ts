import { getProductMdxCollection } from "@/lib/mongodb/client"

export type ProductMdxSlugPair = {
	categorySlug: string
	productSlug: string
}

/**
 * Lists all product documents (category + product slug) from MongoDB.
 * Used to build the catalog when `content/products` is absent.
 */
export async function listProductMdxSlugsFromDatabase(): Promise<ProductMdxSlugPair[]> {
	if (!process.env.MONGODB_URI?.trim()) return []

	try {
		const coll = await getProductMdxCollection()
		const docs = await coll
			.find(
				{
					categorySlug: { $exists: true, $ne: "" },
					productSlug: { $exists: true, $ne: "" },
				},
				{ projection: { _id: 0, categorySlug: 1, productSlug: 1 } },
			)
			.toArray()

		const seen = new Set<string>()
		const out: ProductMdxSlugPair[] = []

		for (const doc of docs) {
			const categorySlug = String(doc.categorySlug ?? "").trim()
			const productSlug = String(doc.productSlug ?? "").trim()
			if (!categorySlug || !productSlug) continue
			const key = `${categorySlug}\0${productSlug}`
			if (seen.has(key)) continue
			seen.add(key)
			out.push({ categorySlug, productSlug })
		}

		return out
	} catch {
		return []
	}
}
