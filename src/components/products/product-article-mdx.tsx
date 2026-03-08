import type { ReactNode } from "react"

import { slugifyHeading } from "@/lib/content/headings"

type HeadingProps = {
	children?: ReactNode
	id?: string
}

function getTextFromChildren(children: ReactNode) {
	if (typeof children === "string") return children
	if (Array.isArray(children)) {
		const parts = children.filter((child) => typeof child === "string") as string[]
		return parts.join(" ")
	}
	return ""
}

function H2(props: HeadingProps) {
	const text = getTextFromChildren(props.children)
	const id = props.id ?? (text ? slugifyHeading(text) : undefined)

	return (
		<h2
			id={id}
			className="mt-14 mb-5 scroll-mt-28 border-l-4 border-amber-500 pl-4 text-2xl font-black leading-snug tracking-tight text-slate-900 lg:text-3xl"
		>
			{props.children}
		</h2>
	)
}

function H3(props: HeadingProps) {
	const text = getTextFromChildren(props.children)
	const id = props.id ?? (text ? slugifyHeading(text) : undefined)

	return (
		<h3
			id={id}
			className="mt-10 mb-3 scroll-mt-28 text-xl font-bold leading-snug text-slate-800 lg:text-2xl"
		>
			<span className="mr-2 text-amber-500" aria-hidden="true">
				▪
			</span>
			{props.children}
		</h3>
	)
}

export const productArticleMdxComponents = {
	h2: H2,
	h3: H3,
	p: (props: React.ComponentProps<"p">) => (
		<p
			{...props}
			className={`mb-6 text-base leading-[1.85] text-slate-700 lg:text-lg ${props.className ?? ""}`}
		/>
	),
	strong: (props: React.ComponentProps<"strong">) => (
		<strong {...props} className={`font-bold text-slate-900 ${props.className ?? ""}`} />
	),
	em: (props: React.ComponentProps<"em">) => (
		<em {...props} className={`italic text-slate-700 ${props.className ?? ""}`} />
	),
	ul: (props: React.ComponentProps<"ul">) => (
		<ul
			{...props}
			className={`mb-6 space-y-2.5 pl-6 list-disc marker:text-amber-500 text-base text-slate-700 lg:text-lg ${props.className ?? ""}`}
		/>
	),
	ol: (props: React.ComponentProps<"ol">) => (
		<ol
			{...props}
			className={`mb-6 space-y-2.5 pl-6 list-decimal marker:text-amber-500 text-base text-slate-700 lg:text-lg ${props.className ?? ""}`}
		/>
	),
	li: (props: React.ComponentProps<"li">) => (
		<li {...props} className={`leading-relaxed ${props.className ?? ""}`} />
	),
	hr: (props: React.ComponentProps<"hr">) => (
		<hr {...props} className={`my-10 border-slate-200 ${props.className ?? ""}`} />
	),
	a: (props: React.ComponentProps<"a">) => (
		<a
			{...props}
			className={`font-semibold text-amber-600 underline underline-offset-2 transition hover:text-amber-500 ${props.className ?? ""}`}
		/>
	),
	table: (props: React.ComponentProps<"table">) => (
		<div className="mb-8 w-full overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
			<table
				{...props}
				className={`min-w-full border-collapse text-sm text-slate-800 ${props.className ?? ""}`}
			/>
		</div>
	),
	thead: (props: React.ComponentProps<"thead">) => (
		<thead {...props} className={`bg-slate-50 ${props.className ?? ""}`} />
	),
	tbody: (props: React.ComponentProps<"tbody">) => (
		<tbody {...props} className={`divide-y divide-slate-100 ${props.className ?? ""}`} />
	),
	tr: (props: React.ComponentProps<"tr">) => (
		<tr
			{...props}
			className={`transition-colors hover:bg-amber-50/40 ${props.className ?? ""}`}
		/>
	),
	th: (props: React.ComponentProps<"th">) => (
		<th
			{...props}
			className={`whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 ${props.className ?? ""}`}
		/>
	),
	td: (props: React.ComponentProps<"td">) => (
		<td
			{...props}
			className={`px-4 py-3 text-sm text-slate-700 ${props.className ?? ""}`}
		/>
	),
	blockquote: (props: React.ComponentProps<"blockquote">) => (
		<blockquote
			{...props}
			className={`my-8 rounded-r-2xl border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-base font-medium leading-relaxed text-slate-800 ${props.className ?? ""}`}
		/>
	),
}
