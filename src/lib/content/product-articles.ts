import type { ReactElement } from "react"
import { compileMDX } from "next-mdx-remote/rsc"

import type { ProductArticleFrontmatter } from "@/lib/cms/types"
import { getProductMdxSource } from "@/lib/content/get-product-mdx-source"
import { extractMarkdownHeadings, type ProductArticleHeading } from "@/lib/content/headings"
import { productArticleMdxComponents } from "@/components/products/product-article-mdx"

type GetProductArticleArgs = {
	categorySlug: string
	productSlug: string
}

export type ProductArticle = {
	frontmatter: ProductArticleFrontmatter
	content: ReactElement
	headings: ProductArticleHeading[]
}

const PRODUCT_IMAGE_PUBLIC_ROOT = "/images/products"

export const getProductArticle = async ({
	categorySlug,
	productSlug,
}: GetProductArticleArgs): Promise<ProductArticle | null> => {
	const resolved = await getProductMdxSource(categorySlug, productSlug)
	if (!resolved) return null

	const { source } = resolved
	const headings = extractMarkdownHeadings(source)

	const { content, frontmatter } = await compileMDX<ProductArticleFrontmatter>({
		source,
		options: {
			parseFrontmatter: true,
		},
		components: productArticleMdxComponents,
	})

	if (!frontmatter.title || !frontmatter.description) {
		throw new Error(`Product article frontmatter for ${categorySlug}/${productSlug} must include title and description`)
	}

	if (frontmatter.categorySlug !== categorySlug || frontmatter.productSlug !== productSlug) {
		throw new Error(
			`Product article frontmatter mismatch for ${categorySlug}/${productSlug}: expected categorySlug=${categorySlug}, productSlug=${productSlug} but received categorySlug=${frontmatter.categorySlug}, productSlug=${frontmatter.productSlug}`,
		)
	}

	if (frontmatter.heroImage && !frontmatter.heroImage.startsWith(`${PRODUCT_IMAGE_PUBLIC_ROOT}/${categorySlug}/${productSlug}/`)) {
		throw new Error(
			`Product article heroImage for ${categorySlug}/${productSlug} must live under ${PRODUCT_IMAGE_PUBLIC_ROOT}/${categorySlug}/${productSlug}/`,
		)
	}

	return {
		frontmatter,
		content,
		headings,
	}
}

