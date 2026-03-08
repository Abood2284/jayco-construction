import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EnquiryForm } from "@/components/sections/enquiry-form";
import { JsonLd } from "@/components/ui/json-ld";
import { ProductArticleLayout } from "@/components/products/product-article-layout";
import {
  getGalleryByProductSlug,
  getProductByCategoryAndSlug,
  getProductCategoryBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/cms";
import { getProductArticle } from "@/lib/content/product-articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildProductSchema } from "@/lib/seo/schema";

type ProductPageProps = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    categorySlug: product.categorySlug,
    productSlug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const [product, article] = await Promise.all([
    getProductByCategoryAndSlug(categorySlug, productSlug),
    getProductArticle({ categorySlug, productSlug }),
  ]);
  if (!product) {
    return buildMetadata({
      title: "Product",
      description: "Industrial product detail.",
      path: "/products",
      indexable: false,
    });
  }

  const title =
    article?.frontmatter.title ?? product.seo?.title ?? product.name;
  const description =
    article?.frontmatter.description ??
    article?.frontmatter.excerpt ??
    product.description;
  const imagePath =
    article?.frontmatter.heroImage ?? product.heroImages[0]?.src;

  return buildMetadata({
    title,
    description,
    path: `/products/${categorySlug}/${product.slug}`,
    imagePath,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const [product, category, article] = await Promise.all([
    getProductByCategoryAndSlug(categorySlug, productSlug),
    getProductCategoryBySlug(categorySlug),
    getProductArticle({ categorySlug, productSlug }),
  ]);

  if (!product || !category) {
    notFound();
  }

  const [relatedProducts, linkedGallery] = await Promise.all([
    getRelatedProducts(product as any, 4),
    getGalleryByProductSlug(product?.slug || ""),
  ]);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: category?.name || "", path: `/products/${category?.slug || ""}` },
    {
      name: product?.name || "",
      path: `/products/${category?.slug || ""}/${product?.slug || ""}`,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 pb-20 lg:pb-28">
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={buildProductSchema(product, category.name)} />

      {/* Immersive Product Hero Block */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36 text-white">
        {/* Background Texture Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
          }}
        />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-500 opacity-10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 lg:mb-10">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
            {/* Left: Text + CTAs */}
            <div className="flex flex-col gap-8 lg:flex-1">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-amber-500">
                  <span className="block h-px w-6 bg-amber-500" />
                  {category.name}
                </p>
                <h1 className="mb-5 text-[clamp(2.2rem,4.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm">
                  {product?.name}
                </h1>
                <p className="max-w-[52ch] text-base text-slate-300 leading-relaxed sm:text-lg">
                  {product?.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#enquiry"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-amber-500 px-8 text-xs font-bold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-amber-400 hover:scale-105 active:scale-95"
                >
                  {product.ctaLabel ?? "Request Specifications"}
                </Link>
                <Link
                  href="#specs"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 px-8 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Right: Hero Image — desktop only */}
            {product.heroImages[0] && (
              <div className="hidden lg:block relative w-[45%] shrink-0">
                <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/60">
                  <Image
                    src={product.heroImages[0].src}
                    alt={product.heroImages[0].alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="45vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-br from-transparent to-slate-950/25" />
                </div>
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-amber-500 opacity-15 blur-[80px]" />
              </div>
            )}
          </div>
        </div>

        {/* Caution stripe decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_15px,#0f172a_15px,#0f172a_30px)] opacity-80" />
      </section>

      {/* Product Image Showcase — immediately below hero */}
      {product.heroImages.length > 0 && (
        <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:mt-8 lg:px-8">
          <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-start lg:gap-3">
            {/* Primary large image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm lg:flex-1">
              <Image
                src={product.heroImages[0].src}
                alt={product.heroImages[0].alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 62vw"
              />
            </div>

            {/* Thumbnail grid — only when 2+ images exist */}
            {product.heroImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:w-[36%] lg:grid-cols-2 lg:grid-rows-2">
                {product.heroImages.slice(1, 5).map((image, idx) => {
                  const showOverlay =
                    idx === 3 && product.heroImages.length > 5
                  return (
                    <div
                      key={image.src}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className={`object-cover transition-transform duration-500 hover:scale-[1.04] ${showOverlay ? "brightness-[0.4]" : ""}`}
                        sizes="(max-width: 640px) 25vw, (max-width: 1024px) 25vw, 18vw"
                      />
                      {showOverlay && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-black text-white drop-shadow-lg">
                            +{product.heroImages.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Editorial Layout Grid */}
      <section className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:mt-20 lg:px-8">
        <div className="flex flex-col gap-12 xl:flex-row xl:gap-16">
          {/* Sidebar: TOC + Meta — on mobile shows below reading column */}
          <div className="order-2 w-full shrink-0 xl:order-1 xl:sticky xl:top-32 h-fit mb-12 xl:mb-0 xl:w-72">
            {/* Table of Contents */}
            <div className="mb-8 hidden xl:block">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-900 border-b border-slate-100 pb-3">
                On this page
              </h3>
              <ul className="flex flex-col gap-3 text-sm font-medium text-slate-600">
                <li>
                  <Link href="#" className="transition hover:text-amber-600">
                    Product Overview
                  </Link>
                </li>
                {article?.headings
                  .filter((h) => h.depth === 2)
                  .map((head) => (
                    <li key={head.id}>
                      <Link
                        href={`#${head.id}`}
                        className="transition hover:text-amber-600"
                      >
                        {head.text}
                      </Link>
                    </li>
                  ))}
                {product?.specs && product.specs.length > 0 && (
                  <li>
                    <Link
                      href="#specs"
                      className="transition hover:text-amber-600"
                    >
                      Technical Data
                    </Link>
                  </li>
                )}
                {product?.faq && product.faq.length > 0 && (
                  <li>
                    <Link
                      href="#faqs"
                      className="transition hover:text-amber-600"
                    >
                      Frequent Questions
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            {/* Applications Badges (Moved from right sidebar) */}
            {product.applications.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-900 border-b border-slate-100 pb-3">
                  Primary Uses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((application) => (
                    <span
                      key={application}
                      className="inline-flex rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm"
                    >
                      {application}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications (Moved from right sidebar) */}
            {product.complianceNotes.length > 0 && (
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-900 border-b border-slate-100 pb-3">
                  Certifications
                </h3>
                <ul className="flex flex-col gap-3">
                  {product.complianceNotes.map((note) => (
                    <li
                      key={note}
                      className="flex gap-3 text-sm font-medium text-slate-600 leading-relaxed"
                    >
                      <span className="text-amber-500 mt-0.5">▪</span> {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reading Column */}
          <div className="order-1 flex w-full max-w-4xl flex-col gap-16 xl:order-2">
            {article && (
              <article className="w-full">
                <ProductArticleLayout
                  frontmatter={article.frontmatter}
                  headings={article.headings}
                >
                  {article.content}
                </ProductArticleLayout>
              </article>
            )}

            {/* Specifications Matrix - Clean & Wide */}
            {product?.specs && product.specs.length > 0 && (
              <section id="specs" className="w-full scroll-mt-32">
                <div className="mb-8 border-b-2 border-slate-900 pb-4 text-center">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Technical Data
                  </h2>
                </div>
                <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white">
                  <table className="w-full text-left text-sm sm:text-base">
                    <tbody className="divide-y divide-slate-100">
                      {product.specs.map((spec) => (
                        <tr
                          key={spec.label}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <th
                            scope="row"
                            className="w-[40%] bg-slate-50/50 px-6 py-5 font-bold text-slate-800 border-r border-slate-100 sm:w-1/3 sm:px-8"
                          >
                            {spec.label}
                          </th>
                          <td className="px-6 py-5 text-slate-700 font-medium sm:px-8">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* FAQs Component - Centered Accordions */}
            {product.faq.length > 0 && (
              <section id="faqs" className="w-full scroll-mt-32">
                <div className="mb-8 border-b-2 border-slate-900 pb-4 text-center">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Frequent Questions
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  {product.faq.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition-all open:border-slate-900 open:bg-white open:shadow-md"
                    >
                      <summary className="cursor-pointer list-none px-6 py-6 font-bold text-slate-900 transition hover:text-amber-600 sm:px-8">
                        <div className="flex items-center justify-between gap-6">
                          <span className="text-lg leading-tight sm:text-xl">
                            {faq.question}
                          </span>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 transition group-open:rotate-180 group-open:border-slate-900 group-open:bg-slate-900 group-open:text-white">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5"
                              aria-hidden="true"
                            >
                              <path
                                d="M19 9l-7 7-7-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </summary>
                      <div className="border-t border-slate-100 px-6 py-6 text-base leading-relaxed text-slate-600 sm:px-8">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      {/* Related Systems - Moved to bottom full width */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 w-full border-t border-slate-200 bg-slate-50 py-16 lg:mt-24 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Related Products
              </h2>
              <p className="mt-3 text-slate-600">
                Alternative configurations and complementary systems.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/products/${entry.categorySlug}/${entry.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-500 hover:shadow-md"
                >
                  <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                    {entry.heroImages?.[0] ? (
                      <Image
                        src={entry.heroImages[0].src}
                        alt={entry.heroImages[0].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-base font-bold text-slate-900 transition group-hover:text-amber-600">
                      {entry.name}
                    </h3>
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {entry.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Attached Enquiry Form - Clean & Integrated */}
      <section
        id="enquiry"
        className="w-full border-t border-slate-200 bg-white pb-24 pt-20 lg:pt-24"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Request Technical Specs
            </h2>
            <p className="mx-auto max-w-[46ch] text-base text-slate-600 sm:text-lg">
              Contact our engineering team to discuss customizations and
              required specifications for the {product.name}.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] sm:p-10">
            <EnquiryForm
              title={product?.ctaLabel ?? "Request Specs"}
              sourcePath={`/products/${category?.slug || ""}/${product?.slug || ""}`}
              defaultProduct={product?.name || ""}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
