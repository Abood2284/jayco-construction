import type { ReactNode } from "react"

import type { ProductArticleFrontmatter } from "@/lib/cms/types"
import type { ProductArticleHeading } from "@/lib/content/headings"

interface ProductArticleLayoutProps {
	frontmatter: ProductArticleFrontmatter
	headings?: ProductArticleHeading[]
	children: ReactNode
}

export function ProductArticleLayout({ frontmatter, headings, children }: ProductArticleLayoutProps) {
	return (
		<div className="product-article-content">
			{(frontmatter.title || frontmatter.shortTitle) && (
				<header className="mb-10 border-b-2 border-slate-100 pb-8 lg:mb-14">
					<p className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-500">
						<span className="block h-px w-5 bg-amber-500" />
						Product Overview
					</p>
					<h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 lg:text-4xl">
						{frontmatter.shortTitle ?? frontmatter.title}
					</h2>
					{frontmatter.excerpt && (
						<p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-slate-500 lg:text-xl">
							{frontmatter.excerpt}
						</p>
					)}
				</header>
			)}

			<div className="markdown-content">{children}</div>
		</div>
	)
}
