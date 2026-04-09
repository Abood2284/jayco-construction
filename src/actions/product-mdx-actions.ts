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

interface ProductMdxData extends Record<string, unknown> {
	heroImage?: unknown
}

function mapMongoSaveError(error: unknown): { code: string; message: string } {
	if (!error || typeof error !== "object") {
		return { code: "UNKNOWN", message: "Could not save to MongoDB. Unknown failure." }
	}

	const maybeMessage = "message" in error ? String(error.message ?? "") : ""
	const maybeCode = "code" in error ? String(error.code ?? "") : ""
	const message = maybeMessage.toLowerCase()

	if (maybeCode === "8000" || message.includes("bad auth") || message.includes("authentication failed")) {
		return {
			code: "AUTH_FAILED",
			message: "Could not save to MongoDB [AUTH_FAILED]. Check DB username/password in MONGODB_URI.",
		}
	}

	if (message.includes("querysrv") || message.includes("enotfound") || message.includes("eai_again")) {
		return {
			code: "DNS_ERROR",
			message: "Could not save to MongoDB [DNS_ERROR]. Check cluster hostname in MONGODB_URI.",
		}
	}

	if (message.includes("server selection timed out")) {
		return {
			code: "SERVER_SELECTION_TIMEOUT",
			message: "Could not save to MongoDB [SERVER_SELECTION_TIMEOUT]. Check Atlas network access and cluster health.",
		}
	}

	if (
		message.includes("tls") ||
		message.includes("ssl") ||
		message.includes("certificate") ||
		message.includes("handshake")
	) {
		return {
			code: "TLS_ERROR",
			message: "Could not save to MongoDB [TLS_ERROR]. Check TLS/SSL connectivity between host and Atlas.",
		}
	}

	if (message.includes("econnreset") || message.includes("econnrefused") || message.includes("etimedout")) {
		return {
			code: "NETWORK_ERROR",
			message: "Could not save to MongoDB [NETWORK_ERROR]. Check outbound network/firewall from your runtime.",
		}
	}

	return {
		code: "MONGO_WRITE_FAILED",
		message: "Could not save to MongoDB [MONGO_WRITE_FAILED]. Check runtime env vars and Atlas logs.",
	}
}

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

	const data: ProductMdxData = {
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
	} catch (error) {
		const mapped = mapMongoSaveError(error)
		return { ok: false, message: mapped.message }
	}

	resetCatalogCache()
	revalidatePath(`/products/${categorySlug}/${productSlug}`)
	revalidatePath(`/products/${categorySlug}`)

	return { ok: true }
}
