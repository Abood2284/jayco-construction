import Image from "next/image"
import Link from "next/link"

import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ImageGallery } from "@/components/products/image-gallery"
import { EnquiryForm } from "@/components/sections/enquiry-form"
import type { Product, ProductCategory, ProductSpec } from "@/lib/cms/types"
import type { ProductArticle } from "@/lib/content/product-articles"

type BreadcrumbItem = {
	name: string
	path: string
}

interface ProductDetailTemplateProps {
	product: Product
	category: ProductCategory
	article: ProductArticle | null
	relatedProducts: Product[]
	breadcrumbItems: BreadcrumbItem[]
	yearsInBusiness: number
	serviceSupport: string
}

type SectionLink = {
	href: string
	label: string
}

type QuickSpecItem = {
	label: string
	value: string
}

const PRIMARY_CTA_LABEL = "Request Quote"

function dedupeQuickSpecs(items: QuickSpecItem[]) {
	const seen = new Set<string>()
	return items.filter((item) => {
		const key = `${item.label.toLowerCase()}::${item.value.toLowerCase()}`
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
}

function getQuickSpecs(product: Product, category: ProductCategory) {
	const conciseSpecs = [...product.specs, ...(product.additionalInfo ?? [])]
		.filter((spec) => spec.value.length <= 90)
		.slice(0, 4)

	const items: QuickSpecItem[] = [
		{ label: "Product family", value: category.name },
		...(product.applications.length > 0
			? [{ label: "Use case", value: product.applications.slice(0, 2).join(" · ") }]
			: []),
		...conciseSpecs,
	]

	return dedupeQuickSpecs(items).slice(0, 6)
}

function getProductSummary(product: Product, article: ProductArticle | null) {
	return article?.frontmatter.excerpt?.trim() || product.excerpt?.trim() || product.description
}

function SectionHeading({
	eyebrow,
	title,
	description,
}: {
	eyebrow: string
	title: string
	description?: string
}) {
	return (
		<div className="max-w-3xl">
			<p className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-amber-700">
				<span className="h-px w-8 bg-amber-600" aria-hidden="true" />
				{eyebrow}
			</p>
			<h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-slate-950">
				{title}
			</h2>
			{description ? (
				<p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
			) : null}
		</div>
	)
}

function ProductHeroActions({ category }: { category: ProductCategory }) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
			<Link
				href="#enquiry"
				className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
			>
				{PRIMARY_CTA_LABEL}
			</Link>
			<Link
				href={`/products/${category.slug}`}
				className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
			>
				View Category
			</Link>
		</div>
	)
}

function ProductSummaryPanel({
	product,
	category,
	summary,
	yearsInBusiness,
	serviceSupport,
}: {
	product: Product
	category: ProductCategory
	summary: string
	yearsInBusiness: number
	serviceSupport: string
}) {
	const supportPoints =
		product.complianceNotes.length > 0
			? product.complianceNotes.slice(0, 2)
			: [
					`${yearsInBusiness}+ years supporting industrial lifting requirements`,
					serviceSupport,
				]

	return (
		<div className="rounded-[1.75rem] border border-slate-200 bg-white/92 p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-7">
			<h1 className="text-[clamp(2.1rem,4.4vw,4.2rem)] font-semibold leading-[1.02] tracking-tight text-slate-950">
				{product.name}
			</h1>
			<p className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-amber-800">
				<span className="h-2 w-2 rounded-full bg-amber-600" aria-hidden="true" />
				{category.name}
			</p>
			<p className="mt-5 max-w-[56ch] text-base leading-relaxed text-slate-600 sm:text-lg">
				{summary}
			</p>

			<div className="mt-7">
				<ProductHeroActions category={category} />
			</div>

			<ul className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
				{supportPoints.map((point) => (
					<li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700">
						<span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
						<span>{point}</span>
					</li>
				))}
			</ul>
		</div>
	)
}

function ProductQuickSpecs({ items }: { items: QuickSpecItem[] }) {
	if (items.length === 0) return null

	return (
		<div
			id="quick-specs"
			className="rounded-[2rem] border border-slate-200 bg-white/94 p-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-6 lg:p-7"
		>
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-2xl">
					<p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
						Quick specification summary
					</p>
					<p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
						High-value scan points pulled from available Jayco product data.
					</p>
				</div>
				<Link
					href="#technical-details"
					className="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-800 transition hover:text-amber-800"
				>
					View technical details
					<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
						<path
							d="M5 12h14M13 6l6 6-6 6"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
						/>
					</svg>
				</Link>
			</div>

			<div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{items.map((item) => (
					<div
						key={`${item.label}-${item.value}`}
						className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5"
					>
						<p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
							{item.label}
						</p>
						<p className="mt-2 font-sans text-sm font-medium leading-6 text-slate-900 sm:text-[0.96rem]">
							{item.value}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

function ProductHeroBlock({
	product,
	category,
	breadcrumbItems,
	summary,
	quickSpecs,
	yearsInBusiness,
	serviceSupport,
}: {
	product: Product
	category: ProductCategory
	breadcrumbItems: BreadcrumbItem[]
	summary: string
	quickSpecs: QuickSpecItem[]
	yearsInBusiness: number
	serviceSupport: string
}) {
	return (
		<section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-36">
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(0deg,transparent,transparent 38px,#0f172a 38px,#0f172a 39px),repeating-linear-gradient(90deg,transparent,transparent 38px,#0f172a 38px,#0f172a 39px)",
				}}
			/>
			<div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/60 blur-3xl" />
			<div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />

			<div className="relative mx-auto max-w-7xl">
				<div className="mb-8">
					<Breadcrumbs items={breadcrumbItems} variant="light" />
				</div>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] xl:items-start">
					<div className="grid gap-5">
						<ProductSummaryPanel
							product={product}
							category={category}
							summary={summary}
							yearsInBusiness={yearsInBusiness}
							serviceSupport={serviceSupport}
						/>
						<ProductQuickSpecs items={quickSpecs} />
					</div>

					<div className="grid gap-4 xl:pt-1">
						{product.heroImages[0] ? (
							<div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)]">
								<div className="absolute inset-x-0 top-0 h-px bg-white/80" aria-hidden="true" />
								<div className="relative aspect-[5/4] w-full bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] sm:aspect-[4/3]">
									<Image
										src={product.heroImages[0].src}
										alt={product.heroImages[0].alt}
										fill
										className="object-contain p-6 sm:p-8"
										priority
										sizes="(max-width: 1279px) 100vw, 42vw"
									/>
								</div>
							</div>
						) : null}

						<div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.4)] backdrop-blur-sm">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
								Product summary
							</p>
							<p className="mt-3 text-sm leading-relaxed text-slate-700">
								Use the summary and quick spec panel to qualify relevance early, then move into technical
								details or request a quote if the fit looks right.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

function ProductSectionNav({ links }: { links: SectionLink[] }) {
	if (links.length === 0) return null

	return (
		<section className="border-b border-slate-200 bg-white/92 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<nav aria-label="Product sections" className="overflow-x-auto scrollbar-none">
					<ul className="flex min-w-max items-center gap-2">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</section>
	)
}

function ProductApplicationsSection({ applications }: { applications: string[] }) {
	if (applications.length === 0) return null

	return (
		<section id="applications" className="scroll-mt-28">
			<SectionHeading
				eyebrow="Applications"
				title="Where this product fits"
				description="Use cases surfaced as quick industrial scanning points."
			/>
			<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{applications.map((application) => (
					<div
						key={application}
						className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.45)]"
					>
						<p className="text-sm font-semibold leading-relaxed text-slate-900 sm:text-base">{application}</p>
					</div>
				))}
			</div>
		</section>
	)
}

function ProductFeaturesSection({ features }: { features: string[] }) {
	if (features.length === 0) return null

	return (
		<section id="features" className="scroll-mt-28">
			<SectionHeading
				eyebrow="Key Features"
				title="Benefits presented for faster product qualification"
				description="Structured feature blocks replace long generic copy and make the offer easier to compare."
			/>
			<div className="mt-8 grid gap-4 lg:grid-cols-2">
				{features.map((feature, index) => (
					<div
						key={feature}
						className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.45)] sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start"
					>
						<div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-sm font-semibold text-amber-800">
							{String(index + 1).padStart(2, "0")}
						</div>
						<p className="text-sm leading-relaxed text-slate-700 sm:text-base">{feature}</p>
					</div>
				))}
			</div>
		</section>
	)
}

function SpecTable({ rows }: { rows: ProductSpec[] }) {
	if (rows.length === 0) return null

	return (
		<div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)]">
			<table className="w-full border-collapse text-left">
				<tbody>
					{rows.map((spec, index) => (
						<tr key={`${spec.label}-${index}`} className="border-b border-slate-200 last:border-b-0">
							<th
								scope="row"
								className="w-[32%] bg-slate-50 px-4 py-4 align-top font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-slate-700 sm:px-6 sm:py-5"
							>
								{spec.label}
							</th>
							<td className="px-4 py-4 font-sans text-[0.97rem] leading-7 text-slate-900 sm:px-6 sm:py-5">
								{spec.value}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

function ProductTechnicalDetails({
	specs,
	additionalInfo,
}: {
	specs: ProductSpec[]
	additionalInfo: ProductSpec[]
}) {
	if (specs.length === 0 && additionalInfo.length === 0) return null

	return (
		<section id="technical-details" className="scroll-mt-28">
			<SectionHeading
				eyebrow="Technical Details"
				title="Structured technical information"
				description="Tables keep the specification layer easy to scan without turning the page into a dense article."
			/>

			<div className="mt-8 grid gap-6 xl:grid-cols-2">
				{specs.length > 0 ? (
					<div>
						<p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
							Primary specifications
						</p>
						<SpecTable rows={specs} />
					</div>
				) : null}

				{additionalInfo.length > 0 ? (
					<div>
						<p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
							Additional details
						</p>
						<SpecTable rows={additionalInfo} />
					</div>
				) : null}
			</div>
		</section>
	)
}

function ProductVisualReference({ images }: { images: Product["heroImages"] }) {
	if (images.length <= 1) return null

	return (
		<section id="product-views" className="scroll-mt-28">
			<SectionHeading
				eyebrow="Product Views"
				title="Additional product visuals"
				description="Supporting imagery stays accessible without pushing the quote path further down the page."
			/>
			<div className="mt-8">
				<ImageGallery images={images} />
			</div>
		</section>
	)
}

function ProductSupportingContent({ article }: { article: ProductArticle }) {
	const sections = article.headings.filter((heading) => heading.depth === 2)

	return (
		<section id="engineering-guide" className="scroll-mt-28">
			<SectionHeading
				eyebrow="Supporting Content"
				title="Engineering guide and deeper reading"
				description="Long-form product guidance is still available, but it now sits behind a cleaner supporting-content layer."
			/>

			<details className="group mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)]">
				<summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 sm:px-6">
					<div>
						<p className="text-sm font-semibold text-slate-950 sm:text-base">Open the detailed product guide</p>
						<p className="mt-1 text-sm text-slate-600">
							Review the full engineering explanation, selection guidance, and supporting notes.
						</p>
					</div>
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition group-open:rotate-180 group-open:border-slate-300 group-open:bg-slate-100">
						<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
							<path
								d="M19 9l-7 7-7-7"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2.5"
							/>
						</svg>
					</span>
				</summary>

				<div className="border-t border-slate-200 px-5 py-6 sm:px-6 sm:py-8">
					{sections.length > 0 ? (
						<div className="mb-6 flex flex-wrap gap-2">
							{sections.map((heading) => (
								<Link
									key={heading.id}
									href={`#${heading.id}`}
									className="inline-flex min-h-10 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900"
								>
									{heading.text}
								</Link>
							))}
						</div>
					) : null}

					<div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-6 sm:px-8 sm:py-8">
						<div className="markdown-content">{article.content}</div>
					</div>
				</div>
			</details>
		</section>
	)
}

function ProductFaqSection({ faqs }: { faqs: Product["faq"] }) {
	if (faqs.length === 0) return null

	return (
		<section id="faqs" className="scroll-mt-28">
			<SectionHeading
				eyebrow="FAQ"
				title="Practical questions before you enquire"
				description="Short answers help reduce uncertainty without adding another long content block."
			/>

			<div className="mt-8 flex flex-col gap-3">
				{faqs.map((faq) => (
					<details
						key={faq.question}
						className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_14px_36px_-32px_rgba(15,23,42,0.45)]"
					>
						<summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 sm:px-6">
							<span className="text-sm font-semibold leading-relaxed text-slate-950 sm:text-base">
								{faq.question}
							</span>
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition group-open:rotate-180 group-open:border-slate-300 group-open:bg-slate-100">
								<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
									<path
										d="M19 9l-7 7-7-7"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2.5"
									/>
								</svg>
							</span>
						</summary>
						<div className="border-t border-slate-200 bg-slate-50 px-5 py-5 text-sm leading-relaxed text-slate-700 sm:px-6 sm:text-base">
							{faq.answer}
						</div>
					</details>
				))}
			</div>
		</section>
	)
}

function ProductQuoteCta({
	product,
	category,
	relatedProducts,
}: {
	product: Product
	category: ProductCategory
	relatedProducts: Product[]
}) {
	return (
		<section id="enquiry" className="scroll-mt-28">
			<div className="overflow-hidden rounded-[2rem] border border-slate-900 bg-slate-950 text-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.7)]">
				<div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
					<div className="border-b border-white/10 px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r">
						<p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-amber-400">
							Request quote
						</p>
						<h2 className="mt-4 text-[clamp(1.9rem,3vw,2.7rem)] font-semibold leading-tight tracking-tight text-white">
							Move this product into an active enquiry
						</h2>
						<p className="mt-4 max-w-[42ch] text-base leading-relaxed text-slate-300">
							Share your application, site constraints, and required commercial details for{" "}
							<span className="font-semibold text-white">{product.name}</span>. Jayco&apos;s team can
							respond with the next relevant specification or quotation path.
						</p>

						<div className="mt-8 flex flex-col gap-3">
							<Link
								href="/contact"
								className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-slate-100"
							>
								Contact Our Team
							</Link>
							<Link
								href={`/products/${category.slug}`}
								className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/40 hover:bg-white/5"
							>
								View Category
							</Link>
							{relatedProducts.length > 0 ? (
								<Link
									href="#related-products"
									className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 px-6 text-sm font-semibold text-slate-200 transition hover:border-amber-400/50 hover:text-white"
								>
									Explore Related Products
								</Link>
							) : null}
						</div>
					</div>

					<div className="bg-white px-5 py-8 sm:px-8">
						<EnquiryForm
							title={PRIMARY_CTA_LABEL}
							sourcePath={`/products/${category.slug}/${product.slug}`}
							defaultProduct={product.name}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

function RelatedProductsSection({
	relatedProducts,
	category,
}: {
	relatedProducts: Product[]
	category: ProductCategory
}) {
	if (relatedProducts.length === 0) return null

	return (
		<section id="related-products" className="scroll-mt-28">
			<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
				<SectionHeading
					eyebrow="Related Products"
					title="Keep comparison paths open"
					description="If this model is not the right fit, adjacent products stay within easy reach instead of forcing a bounce."
				/>
				<Link
					href={`/products/${category.slug}`}
					className="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-800 transition hover:text-amber-800"
				>
					View all in {category.name}
					<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
						<path
							d="M5 12h14M13 6l6 6-6 6"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
						/>
					</svg>
				</Link>
			</div>

			<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{relatedProducts.map((entry) => (
					<Link
						key={entry.slug}
						href={`/products/${entry.categorySlug}/${entry.slug}`}
						className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.55)]"
					>
						<div className="relative aspect-[4/3] overflow-hidden border-b border-slate-200 bg-slate-100">
							{entry.heroImages[0] ? (
								<Image
									src={entry.heroImages[0].src}
									alt={entry.heroImages[0].alt}
									fill
									className="object-cover transition duration-700 group-hover:scale-105"
									sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
								/>
							) : null}
						</div>
						<div className="flex flex-1 flex-col p-5">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
								{entry.categorySlug.replace(/-/g, " ")}
							</p>
							<h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-amber-900">
								{entry.name}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-slate-600">
								{entry.excerpt ?? entry.description}
							</p>
							<span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:text-amber-800">
								View product
								<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
									<path
										d="M5 12h14M13 6l6 6-6 6"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
									/>
								</svg>
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	)
}

export function ProductDetailTemplate({
	product,
	category,
	article,
	relatedProducts,
	breadcrumbItems,
	yearsInBusiness,
	serviceSupport,
}: ProductDetailTemplateProps) {
	const quickSpecs = getQuickSpecs(product, category)
	const summary = getProductSummary(product, article)
	const additionalInfo = product.additionalInfo ?? []
	const sectionLinks: SectionLink[] = [
		...(quickSpecs.length > 0 ? [{ href: "#quick-specs", label: "Quick Specs" }] : []),
		...(product.applications.length > 0 ? [{ href: "#applications", label: "Applications" }] : []),
		...(product.features.length > 0 ? [{ href: "#features", label: "Features" }] : []),
		...(product.specs.length > 0 || additionalInfo.length > 0
			? [{ href: "#technical-details", label: "Technical Details" }]
			: []),
		...(product.heroImages.length > 1 ? [{ href: "#product-views", label: "Product Views" }] : []),
		...(article ? [{ href: "#engineering-guide", label: "Engineering Guide" }] : []),
		...(product.faq.length > 0 ? [{ href: "#faqs", label: "FAQ" }] : []),
		{ href: "#enquiry", label: "Request Quote" },
		...(relatedProducts.length > 0 ? [{ href: "#related-products", label: "Related Products" }] : []),
	]

	return (
		<main className="flex min-h-screen flex-col bg-slate-50 pb-28">
			<ProductHeroBlock
				product={product}
				category={category}
				breadcrumbItems={breadcrumbItems}
				summary={summary}
				quickSpecs={quickSpecs}
				yearsInBusiness={yearsInBusiness}
				serviceSupport={serviceSupport}
			/>

			<ProductSectionNav links={sectionLinks} />

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:gap-20 lg:px-8 lg:py-14">
				<ProductVisualReference images={product.heroImages} />
				<ProductApplicationsSection applications={product.applications} />
				<ProductFeaturesSection features={product.features} />
				<ProductTechnicalDetails specs={product.specs} additionalInfo={additionalInfo} />
				{article ? <ProductSupportingContent article={article} /> : null}
				<ProductFaqSection faqs={product.faq} />
				<ProductQuoteCta product={product} category={category} relatedProducts={relatedProducts} />
				<RelatedProductsSection relatedProducts={relatedProducts} category={category} />
			</div>
		</main>
	)
}
