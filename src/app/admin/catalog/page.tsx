import Link from "next/link"

const catalogSections = [
	{
		title: "Categories",
		description: "Manage product families and category-level publishing details.",
		href: "/admin/catalog/categories",
	},
	{
		title: "Products",
		description: "Manage product records, specifications, and page content.",
		href: "/admin/catalog/products",
	},
	{
		title: "Media",
		description: "Manage product hero images and galleries.",
		href: "/admin/catalog/media",
	},
]

export default function AdminCatalogPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight text-slate-950">Catalog</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Manage product categories, product records, and image assets.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				{catalogSections.map((section) => (
					<Link
						key={section.href}
						href={section.href}
						className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
					>
						<h2 className="text-base font-semibold text-slate-950">{section.title}</h2>
						<p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
					</Link>
				))}
			</div>
		</div>
	)
}
