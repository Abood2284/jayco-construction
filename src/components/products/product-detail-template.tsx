import Image from "next/image"
import Link from "next/link"

import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ImageGallery } from "@/components/products/image-gallery"
import { EnquiryForm } from "@/components/sections/enquiry-form"
import type { Product, ProductCategory, ProductSpec } from "@/lib/cms/types"
import { partitionSpecsForPrimaryDisplay } from "@/lib/content/product-spec-display"
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
}

type SectionLink = {
	href: string
	label: string
}

const PRIMARY_CTA_LABEL = "Request Quote"

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
			<p className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-rose-700">
				<span className="h-px w-8 bg-rose-600" aria-hidden="true" />
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

function ProductTitleStrip({ product, category }: { product: Product; category: ProductCategory }) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)] sm:rounded-3xl sm:p-8">
			<h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[clamp(2rem,4vw,3.25rem)]">
				{product.name}
			</h1>
			<p className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-rose-800">
				<span className="h-2 w-2 rounded-full bg-rose-600" aria-hidden="true" />
				{category.name}
			</p>
			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				<Link
					href="#enquiry"
					className="inline-flex min-h-12 items-center justify-center rounded-full bg-rose-700 px-8 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_14px_32px_rgba(190,24,93,0.22)] transition-colors hover:bg-rose-600"
				>
					{PRIMARY_CTA_LABEL}
				</Link>
				<Link
					href={`/products/${category.slug}`}
					className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-8 text-sm font-semibold uppercase tracking-wide text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50"
				>
					View category
				</Link>
			</div>
		</div>
	)
}

function ProductLeadSection({
	product,
	category,
	breadcrumbItems,
}: {
	product: Product
	category: ProductCategory
	breadcrumbItems: BreadcrumbItem[]
}) {
	return (
		<section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#fafafa_0%,#f1f5f9_100%)] px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-36">
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.06]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(0deg,transparent,transparent 38px,#0f172a 38px,#0f172a 39px),repeating-linear-gradient(90deg,transparent,transparent 38px,#0f172a 38px,#0f172a 39px)",
				}}
			/>
			<div className="pointer-events-none absolute -right-32 -top-24 h-72 w-72 rounded-full bg-rose-400/20 blur-3xl" />
			<div className="pointer-events-none absolute -left-24 top-24 h-56 w-56 rounded-full bg-white/70 blur-3xl" />

			<div className="relative mx-auto max-w-7xl">
				<div className="mb-8">
					<Breadcrumbs items={breadcrumbItems} variant="light" />
				</div>

				{product.heroImages.length > 0 ? (
					<div id="product-gallery" className="scroll-mt-28">
						<ImageGallery images={product.heroImages} leadLayout />
					</div>
				) : null}

				<div className="mt-8 lg:mt-10">
					<ProductTitleStrip product={product} category={category} />
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
									className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-900"
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
						<div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-sm font-semibold text-rose-800">
							{String(index + 1).padStart(2, "0")}
						</div>
						<p className="text-sm leading-relaxed text-slate-700 sm:text-base">{feature}</p>
					</div>
				))}
			</div>
		</section>
	)
}

function SpecTable({ rows, title }: { rows: ProductSpec[]; title?: string }) {
	if (rows.length === 0) return null

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			{title ? (
				<p className="border-b border-slate-200 bg-slate-100/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-6">
					{title}
				</p>
			) : null}
			<dl className="divide-y divide-slate-200">
				{rows.map((spec, index) => (
					<div
						key={`${spec.label}-${index}`}
						className={`grid gap-1 px-4 py-4 sm:grid-cols-[minmax(0,42%)_1fr] sm:items-start sm:gap-8 sm:px-6 sm:py-4 ${
							index % 2 === 0 ? "bg-slate-50/95" : "bg-white"
						}`}
					>
						<dt className="text-sm font-medium text-slate-600">{spec.label}</dt>
						<dd className="text-base font-semibold leading-snug text-slate-900">{spec.value}</dd>
					</div>
				))}
			</dl>
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
	const { primaryRows, secondaryRows, usedFallback } = partitionSpecsForPrimaryDisplay(specs, additionalInfo)

	if (primaryRows.length === 0 && secondaryRows.length === 0) return null

	const primaryTitle = usedFallback ? "Technical specifications" : "Key specifications"
	const secondaryTitle = "Industry context, references & notes"

	return (
		<section id="technical-details" className="scroll-mt-28 space-y-8">
			{primaryRows.length > 0 ? <SpecTable rows={primaryRows} title={primaryTitle} /> : null}
			{secondaryRows.length > 0 ? (
				<SpecTable rows={secondaryRows} title={usedFallback ? "Additional notes" : secondaryTitle} />
			) : null}
		</section>
	)
}

function ProductSupportingContent({ article }: { article: ProductArticle }) {
	const sections = article.headings.filter((heading) => heading.depth === 2)

	return (
		<section id="engineering-guide" className="scroll-mt-28">
			<SectionHeading
				eyebrow="Extended information"
				title="Product guide & reference"
				description="Long-form detail for SEO and buyers who want depth. Most users can rely on the gallery and specifications above."
			/>

			<details className="group mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)]">
				<summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 sm:px-6">
					<div>
						<p className="text-sm font-semibold text-slate-950 sm:text-base">Open full product article</p>
						<p className="mt-1 text-sm text-slate-600">
							Engineering notes, selection guidance, and supporting copy in one place.
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
									className="inline-flex min-h-10 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-900"
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
						<p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-rose-300">
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
									className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 px-6 text-sm font-semibold text-slate-200 transition hover:border-rose-400/50 hover:text-white"
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
					className="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-800 transition hover:text-rose-800"
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
						className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.55)]"
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
							<h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-rose-800">
								{entry.name}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-slate-600">
								{entry.excerpt ?? entry.description}
							</p>
							<span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:text-rose-800">
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
}: ProductDetailTemplateProps) {
	const additionalInfo = product.additionalInfo ?? []
	const sectionLinks: SectionLink[] = [
		...(product.heroImages.length > 0 ? [{ href: "#product-gallery", label: "Gallery" }] : []),
		...(product.specs.length > 0 || additionalInfo.length > 0
			? [{ href: "#technical-details", label: "Specifications" }]
			: []),
		...(product.applications.length > 0 ? [{ href: "#applications", label: "Applications" }] : []),
		...(product.features.length > 0 ? [{ href: "#features", label: "Features" }] : []),
		...(article ? [{ href: "#engineering-guide", label: "Full article" }] : []),
		...(product.faq.length > 0 ? [{ href: "#faqs", label: "FAQ" }] : []),
		{ href: "#enquiry", label: "Request Quote" },
		...(relatedProducts.length > 0 ? [{ href: "#related-products", label: "Related Products" }] : []),
	]

	return (
		<main className="flex min-h-screen flex-col bg-slate-50 pb-28">
			<ProductLeadSection product={product} category={category} breadcrumbItems={breadcrumbItems} />

			<ProductSectionNav links={sectionLinks} />

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:gap-20 lg:px-8 lg:py-14">
				<ProductTechnicalDetails specs={product.specs} additionalInfo={additionalInfo} />
				<ProductApplicationsSection applications={product.applications} />
				<ProductFeaturesSection features={product.features} />
				{article ? <ProductSupportingContent article={article} /> : null}
				<ProductFaqSection faqs={product.faq} />
				<ProductQuoteCta product={product} category={category} relatedProducts={relatedProducts} />
				<RelatedProductsSection relatedProducts={relatedProducts} category={category} />
			</div>
		</main>
	)
}
