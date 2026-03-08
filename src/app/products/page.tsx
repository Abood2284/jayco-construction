import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductsCatalog } from "@/components/products/products-catalog";
import { JsonLd } from "@/components/ui/json-ld";
import { getProducts, getProductCategories } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export async function generateMetadata() {
	return buildMetadata({
		title: "Products",
		description:
			"Browse industrial product categories including material handling systems, pressure vessels, and fabrication packages.",
		path: "/products",
	});
}

export default async function ProductsPage() {
	const [categories, allProducts] = await Promise.all([getProductCategories(), getProducts()]);

	return (
		<main className="flex min-h-screen flex-col">
			<JsonLd
				data={buildBreadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "Products", path: "/products" },
				])}
			/>
			
			{/* Page Hero */}
			<section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
					}}
				/>
				<div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-500 opacity-10 blur-[100px]" />

				<div className="relative mx-auto max-w-6xl">
					<div className="mb-6">
						<Breadcrumbs
							items={[
								{ name: "Home", path: "/" },
								{ name: "Products", path: "/products" },
							]}
						/>
					</div>
					
					<div className="max-w-2xl">
						<p className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-500">
							<span className="block h-px w-6 bg-amber-500" />
							Systems & Equipment
						</p>
						<h1 className="mb-6 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white">
							Heavy-Industrial <br />
							<span className="text-slate-400">Solutions.</span>
						</h1>
						<p className="text-sm text-slate-400 lg:text-base">
							Category-led product architecture for high-intensity industrial applications. Designed for uptime, built to code, and supported 24/7.
						</p>
					</div>
				</div>

				{/* Caution stripe decoration */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-60" />
			</section>

			{/* Interactive Catalog Layout */}
			<section className="bg-white py-12 lg:py-24">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<ProductsCatalog categories={categories} products={allProducts} />
				</div>
			</section>
		</main>
	);
}
