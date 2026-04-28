import Link from "next/link"

const adminSections = [
	{
		title: "Catalog",
		description: "Review the catalog management workspace.",
		href: "/admin/catalog",
	},
	{
		title: "Categories",
		description: "Prepare product family editing workflows.",
		href: "/admin/catalog/categories",
	},
	{
		title: "Products",
		description: "Prepare product record editing workflows.",
		href: "/admin/catalog/products",
	},
	{
		title: "Media",
		description: "Prepare product image and Blob media workflows.",
		href: "/admin/catalog/media",
	},
]

export default function AdminPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight text-slate-950">Admin</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Manage catalog content, product media, and publishing workflows.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				{adminSections.map((section) => (
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
