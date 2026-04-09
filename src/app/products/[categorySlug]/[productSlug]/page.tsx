import matter from "gray-matter";
import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/products/product-detail-template";
import { ProductEditorShell } from "@/components/products/product-editor-shell";
import { JsonLd } from "@/components/ui/json-ld";
import {
  getProductByCategoryAndSlug,
  getProductCategoryBySlug,
  getProducts,
  getRelatedProducts,
  getSiteSettings,
} from "@/lib/cms";
import { getProductMdxSource } from "@/lib/content/get-product-mdx-source";
import { getProductArticle } from "@/lib/content/product-articles";
import { isProductEditorUiEnabled } from "@/lib/content/product-editor-config";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildProductSchema } from "@/lib/seo/schema";

type ProductPageProps = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

/** Always resolve MDX from Mongo (when configured) on each request — avoids stale SSG HTML from build-time filesystem. */
export const dynamic = "force-dynamic";

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
  const [product, category, article, siteSettings, resolvedSource] = await Promise.all([
    getProductByCategoryAndSlug(categorySlug, productSlug),
    getProductCategoryBySlug(categorySlug),
    getProductArticle({ categorySlug, productSlug }),
    getSiteSettings(),
    getProductMdxSource(categorySlug, productSlug),
  ]);

  if (!product || !category || !resolvedSource) {
    notFound();
  }

  const parsedMdx = matter(resolvedSource.source);
  const editorConfig = isProductEditorUiEnabled()
    ? {
        categorySlug,
        productSlug,
        initialFrontmatter: parsedMdx.data as Record<string, unknown>,
        initialBody: parsedMdx.content,
        sourceOrigin: resolvedSource.origin,
        requireEditorPassphrase: Boolean(process.env.PRODUCT_EDITOR_SECRET?.trim()),
      }
    : null;

  const relatedProducts = await getRelatedProducts(product, 4);
  const whatsAppPhone = siteSettings.phones[0]?.replace(/[^+\d]/g, "") ?? "";
  const whatsAppMessage = `Hi Jayco, I need details for ${product.name}.`;
  const whatsAppHref = whatsAppPhone
    ? `https://wa.me/${whatsAppPhone.replace(/^\+/, "")}?text=${encodeURIComponent(whatsAppMessage)}`
    : "/contact";

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
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={buildProductSchema(product, category.name)} />
      <ProductEditorShell editorConfig={editorConfig}>
        <ProductDetailTemplate
          product={product}
          category={category}
          article={article}
          relatedProducts={relatedProducts}
          whatsAppHref={whatsAppHref}
        />
      </ProductEditorShell>
    </>
  );
}
