import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/products/product-detail-template";
import { JsonLd } from "@/components/ui/json-ld";
import {
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

  const relatedProducts = await getRelatedProducts(product, 4);

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
      <ProductDetailTemplate
        product={product}
        category={category}
        article={article}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
