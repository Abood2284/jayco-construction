import { getProductMdxCollection } from "@/lib/mongodb/client"

/** Returns full MDX file text from MongoDB, or null if missing / DB unavailable. */
export async function findProductMdxInDatabase(
	categorySlug: string,
	productSlug: string,
): Promise<string | null> {
	if (!process.env.MONGODB_URI?.trim()) return null

	try {
		const coll = await getProductMdxCollection()
		const doc = await coll.findOne({ categorySlug, productSlug }, { projection: { mdxSource: 1 } })
		return doc?.mdxSource ?? null
	} catch {
		return null
	}
}
