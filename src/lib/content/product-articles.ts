import type { ReactElement } from "react"

import type { ProductArticleFrontmatter } from "@/lib/cms/types"
import type { ProductArticleHeading } from "@/lib/content/headings"

export type ProductArticle = {
	frontmatter: ProductArticleFrontmatter
	content: ReactElement
	headings: ProductArticleHeading[]
}

