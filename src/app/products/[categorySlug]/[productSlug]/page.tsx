import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/products/product-detail-template";
import { JsonLd } from "@/components/ui/json-ld";
import {
  getProductByCategoryAndSlug,
  getProductCategoryBySlug,
  getProducts,
  getRelatedProducts,
  getSiteSettings,
} from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildProductSchema } from "@/lib/seo/schema";

type ProductPageProps = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

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
  const product = await getProductByCategoryAndSlug(categorySlug, productSlug);
  if (!product) {
    return buildMetadata({
      title: "Product",
      description: "Industrial product detail.",
      path: "/products",
      indexable: false,
    });
  }

  const title = product.seo?.title ?? product.name;
  const description = product.seo?.description ?? product.description;
  const imagePath = product.heroImages[0]?.src;

  return buildMetadata({
    title,
    description,
    path: `/products/${categorySlug}/${product.slug}`,
    imagePath,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const [product, category, siteSettings] = await Promise.all([
    getProductByCategoryAndSlug(categorySlug, productSlug),
    getProductCategoryBySlug(categorySlug),
    getSiteSettings(),
  ]);

  if (!product || !category) {
    notFound();
  }

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
      <ProductDetailTemplate
        product={product}
        category={category}
        article={null}
        relatedProducts={relatedProducts}
        whatsAppHref={whatsAppHref}
      />
    </>
  );
}
