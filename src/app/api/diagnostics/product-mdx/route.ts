import { NextResponse } from "next/server"

import { getProductMdxSource } from "@/lib/content/get-product-mdx-source"
import { getProductMdxCollection } from "@/lib/mongodb/client"

export const dynamic = "force-dynamic"

function sanitizeMongoProbeError(error: unknown) {
	if (!error || typeof error !== "object") {
		return { name: "UnknownError", code: "", message: "" }
	}
	const name = "name" in error ? String(error.name ?? "Error") : "Error"
	const code = "code" in error ? String(error.code ?? "") : ""
	const message = "message" in error ? String(error.message ?? "") : ""
	return {
		name,
		code,
		message: message.slice(0, 280),
	}
}

/**
 * Verify Mongo + MDX resolution in production (or locally).
 *
 * Set PRODUCT_DIAGNOSTICS_SECRET in env, then:
 *   curl -sS "https://your-domain/api/diagnostics/product-mdx?categorySlug=electric-hoist&productSlug=material-hoist" \
 *     -H "x-product-diagnostics-secret: YOUR_SECRET"
 */
export async function GET(request: Request) {
	const secret = process.env.PRODUCT_DIAGNOSTICS_SECRET?.trim()
	if (!secret) {
		return NextResponse.json({ error: "PRODUCT_DIAGNOSTICS_SECRET is not configured" }, { status: 501 })
	}

	const provided = request.headers.get("x-product-diagnostics-secret")?.trim()
	if (provided !== secret) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const categorySlug = searchParams.get("categorySlug")?.trim() ?? ""
	const productSlug = searchParams.get("productSlug")?.trim() ?? ""

	if (!categorySlug || !productSlug) {
		return NextResponse.json(
			{ error: "Missing categorySlug or productSlug query parameters" },
			{ status: 400 },
		)
	}

	const mongodbUriConfigured = Boolean(process.env.MONGODB_URI?.trim())

	let databaseProbe:
		| { ok: true; documentFound: boolean; mdxCharLength: number }
		| { ok: false; error: ReturnType<typeof sanitizeMongoProbeError> }

	if (!mongodbUriConfigured) {
		databaseProbe = {
			ok: false,
			error: { name: "ConfigError", code: "", message: "MONGODB_URI is empty or missing" },
		}
	} else {
		try {
			const coll = await getProductMdxCollection()
			const doc = await coll.findOne({ categorySlug, productSlug }, { projection: { mdxSource: 1 } })
			const src = doc?.mdxSource
			databaseProbe = {
				ok: true,
				documentFound: typeof src === "string" && src.length > 0,
				mdxCharLength: typeof src === "string" ? src.length : 0,
			}
		} catch (error) {
			databaseProbe = { ok: false, error: sanitizeMongoProbeError(error) }
		}
	}

	const resolved = await getProductMdxSource(categorySlug, productSlug)

	return NextResponse.json({
		categorySlug,
		productSlug,
		runtime: {
			vercel: process.env.VERCEL === "1",
			nodeEnv: process.env.NODE_ENV,
		},
		mongodbUriConfigured,
		databaseProbe,
		resolved: resolved
			? { origin: resolved.origin, sourceCharLength: resolved.source.length }
			: null,
		hint:
			mongodbUriConfigured && databaseProbe.ok && databaseProbe.documentFound && resolved?.origin === "filesystem"
				? "DB has a document but getProductMdxSource fell back to filesystem — unexpected; check DB read errors inside findProductMdxInDatabase."
				: !mongodbUriConfigured && resolved?.origin === "filesystem"
					? "No MONGODB_URI in this runtime: all product MDX is read from repo files (expected on Vercel if env is missing for Production)."
					: undefined,
	})
}
