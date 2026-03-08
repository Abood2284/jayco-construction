export interface ProductArticleHeading {
	id: string
	text: string
	depth: 2 | 3
}

const headingPattern = /^(#{2,3})\s+(.+)$/

export function slugifyHeading(text: string) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
}

export function extractMarkdownHeadings(source: string): ProductArticleHeading[] {
	const lines = source.split("\n")

	return lines
		.map((line) => {
			const match = line.match(headingPattern)
			if (!match) return null

			const [, hashes, rawText] = match
			const depth = hashes.length as 2 | 3
			const text = rawText.trim()

			return {
				id: slugifyHeading(text),
				text,
				depth,
			}
		})
		.filter((entry): entry is ProductArticleHeading => Boolean(entry))
}

