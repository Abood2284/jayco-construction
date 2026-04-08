"use server"

import matter from "gray-matter"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { resetCatalogCache } from "@/lib/content/catalog"
import { getProductMdxCollection } from "@/lib/mongodb/client"

const saveProductMdxSchema = z.object({
	categorySlug: z.string().min(1),
	productSlug: z.string().min(1),
	body: z.string(),
	frontmatter: z.record(z.string(), z.unknown()),
	passphrase: z.string().optional(),
})

export type SaveProductMdxResult = { ok: true } | { ok: false; message: string }

export async function saveProductMdx(
	raw: z.infer<typeof saveProductMdxSchema>,
): Promise<SaveProductMdxResult> {
	const parsed = saveProductMdxSchema.safeParse(raw)
	if (!parsed.success) {
		return { ok: false, message: "Invalid payload" }
	}

	const secret = process.env.PRODUCT_EDITOR_SECRET?.trim()
	if (secret && parsed.data.passphrase !== secret) {
		return { ok: false, message: "Invalid editor passphrase" }
	}

	const { categorySlug, productSlug, body, frontmatter } = parsed.data

	const title = String(frontmatter.title ?? "").trim()
	const description = String(frontmatter.description ?? "").trim()
	if (!title || !description) {
		return { ok: false, message: "Title and description are required" }
	}

	const data = {
		...frontmatter,
		categorySlug,
		productSlug,
	}

	const normalizedBody = body.replace(/\r\n/g, "\n")

	try {
		const coll = await getProductMdxCollection()
		const existing = await coll.findOne({ categorySlug, productSlug }, { projection: { mdxSource: 1 } })
		if (existing?.mdxSource) {
			const parsedExisting = matter(existing.mdxSource)
			if (parsedExisting.data.heroImage) {
				data.heroImage = parsedExisting.data.heroImage
			}
		}

		const mdxSource = matter.stringify(normalizedBody, data)
		const now = new Date()

		await coll.updateOne(
			{ categorySlug, productSlug },
			{
				$set: {
					mdxSource,
					updatedAt: now,
					seededFromFilesystem: false,
				},
				$setOnInsert: {
					createdAt: now,
				},
			},
			{ upsert: true },
		)
	} catch {
		return { ok: false, message: "Could not save to MongoDB. Check MONGODB_URI and network access." }
	}

	resetCatalogCache()
	revalidatePath(`/products/${categorySlug}/${productSlug}`)
	revalidatePath(`/products/${categorySlug}`)

	return { ok: true }
}
