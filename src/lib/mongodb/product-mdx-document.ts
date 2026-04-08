import type { ObjectId } from "mongodb"

/**
 * One document per product page MDX file (`content/products/{categorySlug}/{productSlug}/index.mdx`).
 *
 * MongoDB does not require a predefined schema: the database and collection are created on first write,
 * and fields can evolve. This interface documents the shape we use in code; optional fields may appear
 * later (e.g. `updatedBy` when you add auth).
 */
export interface ProductMdxDocument {
	_id?: ObjectId
	categorySlug: string
	productSlug: string
	/** Full file contents: YAML frontmatter + MDX body */
	mdxSource: string
	/** True when the row was seeded from disk via `pnpm run seed:product-mdx` */
	seededFromFilesystem?: boolean
	createdAt: Date
	updatedAt: Date
}
