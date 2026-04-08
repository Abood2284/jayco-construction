"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition, type ReactNode } from "react"

import { saveProductMdx, type SaveProductMdxResult } from "@/actions/product-mdx-actions"
import type { ProductSpec } from "@/lib/cms/types"
import type { ProductMdxSourceOrigin } from "@/lib/content/get-product-mdx-source"

export interface ProductEditorConfig {
	categorySlug: string
	productSlug: string
	initialFrontmatter: Record<string, unknown>
	initialBody: string
	sourceOrigin: ProductMdxSourceOrigin
	requireEditorPassphrase: boolean
}

interface Draft {
	title: string
	description: string
	shortTitle: string
	excerpt: string
	ctaLabel: string
	toc: boolean
	keywordsText: string
	specs: ProductSpec[]
	additionalInfo: ProductSpec[]
	featuresText: string
	applicationsText: string
	complianceText: string
	body: string
}

function draftFromFrontmatter(frontmatter: Record<string, unknown>, body: string): Draft {
	const keywords = Array.isArray(frontmatter.keywords)
		? frontmatter.keywords.map((k) => String(k)).join(", ")
		: ""

	const linesFrom = (key: string) =>
		Array.isArray(frontmatter[key])
			? (frontmatter[key] as unknown[]).map((line) => String(line)).join("\n")
			: ""

	const specRows = (key: "specs" | "additionalInfo"): ProductSpec[] => {
		const raw = frontmatter[key]
		if (!Array.isArray(raw)) return [{ label: "", value: "" }]
		const out: ProductSpec[] = []
		for (const row of raw) {
			if (!row || typeof row !== "object") continue
			const label = String((row as { label?: unknown }).label ?? "").trim()
			const value = String((row as { value?: unknown }).value ?? "").trim()
			if (!label && !value) continue
			out.push({ label, value })
		}
		return out.length ? out : [{ label: "", value: "" }]
	}

	return {
		title: String(frontmatter.title ?? ""),
		description: String(frontmatter.description ?? ""),
		shortTitle: String(frontmatter.shortTitle ?? ""),
		excerpt: String(frontmatter.excerpt ?? ""),
		ctaLabel: String(frontmatter.ctaLabel ?? ""),
		toc: Boolean(frontmatter.toc),
		keywordsText: keywords,
		specs: specRows("specs"),
		additionalInfo: specRows("additionalInfo"),
		featuresText: linesFrom("features"),
		applicationsText: linesFrom("applications"),
		complianceText: linesFrom("complianceNotes"),
		body,
	}
}

function buildFrontmatterRecord(draft: Draft, categorySlug: string, productSlug: string): Record<string, unknown> {
	const keywords = draft.keywordsText
		.split(",")
		.map((k) => k.trim())
		.filter(Boolean)

	const splitLines = (text: string) =>
		text
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean)

	const specs = draft.specs.filter((row) => row.label.trim() && row.value.trim())
	const additionalInfo = draft.additionalInfo.filter((row) => row.label.trim() && row.value.trim())

	const base: Record<string, unknown> = {
		title: draft.title.trim(),
		description: draft.description.trim(),
		categorySlug,
		productSlug,
	}

	if (draft.shortTitle.trim()) base.shortTitle = draft.shortTitle.trim()
	if (draft.excerpt.trim()) base.excerpt = draft.excerpt.trim()
	if (draft.ctaLabel.trim()) base.ctaLabel = draft.ctaLabel.trim()
	if (draft.toc) base.toc = true
	if (keywords.length) base.keywords = keywords
	if (specs.length) base.specs = specs
	if (additionalInfo.length) base.additionalInfo = additionalInfo

	const features = splitLines(draft.featuresText)
	if (features.length) base.features = features

	const applications = splitLines(draft.applicationsText)
	if (applications.length) base.applications = applications

	const complianceNotes = splitLines(draft.complianceText)
	if (complianceNotes.length) base.complianceNotes = complianceNotes

	return base
}

function inputClassName() {
	return "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-rose-200 placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
}

function labelClassName() {
	return "text-xs font-semibold uppercase tracking-wide text-slate-500"
}

function SpecRowsEditor({
	rows,
	title,
	onChange,
}: {
	rows: ProductSpec[]
	title: string
	onChange: (next: ProductSpec[]) => void
}) {
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between gap-3">
				<p className={labelClassName()}>{title}</p>
				<button
					type="button"
					className="text-xs font-semibold text-rose-700 hover:text-rose-800"
					onClick={() => onChange([...rows, { label: "", value: "" }])}
				>
					+ Add row
				</button>
			</div>
			<div className="space-y-2">
				{rows.map((row, index) => (
					<div key={`row-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
						<label className="block text-sm text-slate-700">
							<span className="text-xs text-slate-500">Label</span>
							<input
								className={inputClassName()}
								value={row.label}
								onChange={(event) => {
									const next = rows.slice()
									next[index] = { ...row, label: event.target.value }
									onChange(next)
								}}
							/>
						</label>
						<label className="block text-sm text-slate-700">
							<span className="text-xs text-slate-500">Value</span>
							<input
								className={inputClassName()}
								value={row.value}
								onChange={(event) => {
									const next = rows.slice()
									next[index] = { ...row, value: event.target.value }
									onChange(next)
								}}
							/>
						</label>
						<button
							type="button"
							className="h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-800"
							onClick={() => onChange(rows.filter((_, i) => i !== index))}
						>
							Remove
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

function ProductEditorChrome({
	children,
	editorConfig,
}: {
	children: ReactNode
	editorConfig: ProductEditorConfig
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [panelOpen, setPanelOpen] = useState(true)
	const [message, setMessage] = useState<string | null>(null)
	const [passphrase, setPassphrase] = useState("")
	const [activeSection, setActiveSection] = useState<"basics" | "facts" | "content" | "publish">("basics")

	const [draft, setDraft] = useState(() =>
		draftFromFrontmatter(editorConfig.initialFrontmatter, editorConfig.initialBody),
	)

	useEffect(() => {
		setDraft(draftFromFrontmatter(editorConfig.initialFrontmatter, editorConfig.initialBody))
	}, [editorConfig.initialBody, editorConfig.initialFrontmatter])

	const handleSave = () => {
		setMessage(null)
		const frontmatter = buildFrontmatterRecord(draft, editorConfig.categorySlug, editorConfig.productSlug)

		startTransition(async () => {
			const result: SaveProductMdxResult = await saveProductMdx({
				categorySlug: editorConfig.categorySlug,
				productSlug: editorConfig.productSlug,
				body: draft.body,
				frontmatter,
				passphrase: editorConfig.requireEditorPassphrase ? passphrase : undefined,
			})

			if (!result.ok) {
				setMessage(result.message)
				return
			}

			setMessage("Saved. Refreshing…")
			router.refresh()
		})
	}

	const originLabel =
		editorConfig.sourceOrigin === "database" ? "Source: MongoDB" : "Source: repo file (fallback)"

	return (
		<>
			<div className="pb-[min(32rem,55vh)]">{children}</div>

			<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-stretch">
				{panelOpen ? (
					<div className="pointer-events-auto max-h-[min(85vh,calc(100vh-3.5rem))] overflow-y-auto border-t border-slate-200 bg-white shadow-[0_-12px_40px_-28px_rgba(15,23,42,0.45)]">
						<div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Product content</p>
									<h2 className="mt-2 text-lg font-semibold text-slate-950">Edit MDX fields</h2>
									<p className="mt-1 max-w-2xl text-sm text-slate-600">
										Changes save to MongoDB and update this page. Title and description are required.
									</p>
								</div>
								<button
									type="button"
									className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:border-slate-300"
									onClick={() => setPanelOpen(false)}
								>
									Hide editor
								</button>
							</div>

							{message ? (
								<p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{message}</p>
							) : null}

							<div className="flex flex-wrap gap-2">
								{[
									{ id: "basics", label: "1. Basics" },
									{ id: "facts", label: "2. Quick facts" },
									{ id: "content", label: "3. Detailed content" },
									{ id: "publish", label: "4. Save" },
								].map((section) => {
									const isActive = activeSection === section.id
									return (
										<button
											key={section.id}
											type="button"
											onClick={() =>
												setActiveSection(section.id as "basics" | "facts" | "content" | "publish")
											}
											className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
												isActive
													? "bg-rose-700 text-white"
													: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
											}`}
										>
											{section.label}
										</button>
									)
								})}
							</div>

							{activeSection === "basics" ? (
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
									<p className="font-semibold text-slate-900">These fields control the product heading and search snippet.</p>
									<p className="mt-1">Tip: Keep title short and description clear in 1-2 sentences.</p>
								</div>
							) : null}

							{activeSection === "basics" ? (
							<div className="grid gap-6 lg:grid-cols-2">
								<label className="block">
									<span className={labelClassName()}>Title (SEO)</span>
									<input
										className={inputClassName()}
										value={draft.title}
										onChange={(e) => setDraft({ ...draft, title: e.target.value })}
									/>
								</label>
								<label className="block">
									<span className={labelClassName()}>Short title (display name)</span>
									<input
										className={inputClassName()}
										value={draft.shortTitle}
										onChange={(e) => setDraft({ ...draft, shortTitle: e.target.value })}
									/>
								</label>
								<label className="block lg:col-span-2">
									<span className={labelClassName()}>Description (SEO)</span>
									<textarea
										className={`${inputClassName()} min-h-[96px]`}
										value={draft.description}
										onChange={(e) => setDraft({ ...draft, description: e.target.value })}
									/>
								</label>
								<label className="block lg:col-span-2">
									<span className={labelClassName()}>Excerpt</span>
									<textarea
										className={`${inputClassName()} min-h-[80px]`}
										value={draft.excerpt}
										onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
									/>
								</label>
								<label className="block">
									<span className={labelClassName()}>CTA label</span>
									<input
										className={inputClassName()}
										value={draft.ctaLabel}
										onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
									/>
								</label>
								<label className="flex items-center gap-3 lg:col-span-2">
									<input
										type="checkbox"
										className="h-4 w-4 rounded border-slate-300 text-rose-700 focus:ring-rose-500"
										checked={draft.toc}
										onChange={(e) => setDraft({ ...draft, toc: e.target.checked })}
									/>
									<span className="text-sm font-medium text-slate-800">Show table of contents</span>
								</label>
								<label className="block lg:col-span-2">
									<span className={labelClassName()}>Keywords (comma-separated)</span>
									<input
										className={inputClassName()}
										value={draft.keywordsText}
										onChange={(e) => setDraft({ ...draft, keywordsText: e.target.value })}
									/>
								</label>
							</div>
							) : null}

							{activeSection === "facts" ? (
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
									<p className="font-semibold text-slate-900">Quick facts are shown as short bullets and comparison points.</p>
									<p className="mt-1">Use simple language and one idea per line.</p>
								</div>
							) : null}

							{activeSection === "facts" ? (
							<SpecRowsEditor
								title="Specifications"
								rows={draft.specs}
								onChange={(specs) => setDraft({ ...draft, specs })}
							/>
							) : null}

							{activeSection === "facts" ? (
							<SpecRowsEditor
								title="Additional info"
								rows={draft.additionalInfo}
								onChange={(additionalInfo) => setDraft({ ...draft, additionalInfo })}
							/>
							) : null}

							{activeSection === "facts" ? (
							<div className="grid gap-6 lg:grid-cols-2">
								<label className="block">
									<span className={labelClassName()}>Features (one per line)</span>
									<textarea
										className={`${inputClassName()} min-h-[140px]`}
										value={draft.featuresText}
										onChange={(e) => setDraft({ ...draft, featuresText: e.target.value })}
									/>
								</label>
								<label className="block">
									<span className={labelClassName()}>Applications (one per line)</span>
									<textarea
										className={`${inputClassName()} min-h-[140px]`}
										value={draft.applicationsText}
										onChange={(e) => setDraft({ ...draft, applicationsText: e.target.value })}
									/>
								</label>
								<label className="block lg:col-span-2">
									<span className={labelClassName()}>Compliance notes (one per line)</span>
									<textarea
										className={`${inputClassName()} min-h-[100px]`}
										value={draft.complianceText}
										onChange={(e) => setDraft({ ...draft, complianceText: e.target.value })}
									/>
								</label>
							</div>
							) : null}

							{activeSection === "content" ? (
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
									<p className="font-semibold text-slate-900">Detailed product story</p>
									<p className="mt-1">You can write in plain text. Headings like “## Applications” are optional.</p>
								</div>
							) : null}

							{activeSection === "content" ? (
							<label className="block">
								<span className={labelClassName()}>Detailed product description</span>
								<textarea
									className={`${inputClassName()} min-h-[360px] text-[15px] leading-7`}
									value={draft.body}
									onChange={(e) => setDraft({ ...draft, body: e.target.value })}
								/>
							</label>
							) : null}

							{activeSection === "publish" ? (
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
									<p className="font-semibold text-slate-900">Final step</p>
									<p className="mt-1">Click save to update this product in MongoDB and refresh the page.</p>
								</div>
							) : null}

							{activeSection === "publish" && editorConfig.requireEditorPassphrase ? (
								<label className="block max-w-md">
									<span className={labelClassName()}>Editor passphrase</span>
									<input
										type="password"
										className={inputClassName()}
										value={passphrase}
										onChange={(e) => setPassphrase(e.target.value)}
										autoComplete="off"
									/>
								</label>
							) : null}

							{activeSection === "publish" ? (
							<div className="flex flex-wrap items-center gap-3 pb-4">
								<button
									type="button"
									disabled={isPending}
									className="inline-flex min-h-11 items-center justify-center rounded-full bg-rose-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
									onClick={handleSave}
								>
									{isPending ? "Saving…" : "Save to MongoDB"}
								</button>
								<button
									type="button"
									className="text-sm font-semibold text-slate-600 hover:text-slate-900"
									onClick={() => {
										setDraft(draftFromFrontmatter(editorConfig.initialFrontmatter, editorConfig.initialBody))
										setMessage("Reverted to last loaded content.")
									}}
								>
									Reset fields
								</button>
							</div>
							) : null}
						</div>
					</div>
				) : null}

				<div className="pointer-events-auto flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-950 px-4 py-3 text-white sm:px-6">
					<div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
						<p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-rose-200">Content editor</p>
						<p className="truncate text-xs text-slate-300">{originLabel}</p>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<button
							type="button"
							className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:border-white/40"
							onClick={() => setPanelOpen((open) => !open)}
						>
							{panelOpen ? "Collapse" : "Expand"}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export function ProductEditorShell({
	children,
	editorConfig,
}: {
	children: ReactNode
	editorConfig: ProductEditorConfig | null
}) {
	if (!editorConfig) {
		return children
	}

	return <ProductEditorChrome editorConfig={editorConfig}>{children}</ProductEditorChrome>
}
