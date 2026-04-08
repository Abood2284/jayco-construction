import Link from "next/link"
import Image from "next/image"
import type { Product, SiteSettings } from "@/lib/cms/types"
import { ArrowRight } from "lucide-react"

interface FooterProps {
	settings: SiteSettings
	products: Product[]
}

function sortProductsForFooter(products: Product[]) {
	return [...products].sort((a, b) => {
		const byCat = a.categorySlug.localeCompare(b.categorySlug)
		if (byCat !== 0) return byCat
		return a.name.localeCompare(b.name)
	})
}

const companyLinks = [
	{ href: "/about", label: "About" },
	{ href: "/gallery", label: "Gallery" },
	{ href: "/clients", label: "Clients" },
	{ href: "/careers", label: "Careers" },
	{ href: "/contact", label: "Contact" },
]

const MAX_PRODUCTS_IN_FOOTER = 10

export function Footer({ settings, products }: FooterProps) {
	const year = new Date().getFullYear()
	const productLinks = sortProductsForFooter(products)
		.slice(0, MAX_PRODUCTS_IN_FOOTER)
		.map((product) => ({
			href: `/products/${product.categorySlug}/${product.slug}`,
			label: product.name,
		}))

	return (
		<footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
			<div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-16">
				<div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
					{/* Brand */}
					<div className="flex h-full flex-col border-b border-slate-200 pb-8 lg:col-span-4 lg:border-none lg:pb-0">
						<Link href="/" className="group mb-5 flex items-center" aria-label={settings.companyName}>
							<Image
								src="/images/jayco-logo.png"
								alt={settings.companyName}
								width={280}
								height={58}
								className="h-9 w-auto transition-opacity group-hover:opacity-90 lg:h-10"
							/>
						</Link>
						<p className="mt-4 max-w-[32ch] text-[0.75rem] font-medium leading-relaxed text-slate-600">
							Engineering heavy-duty material handling solutions for over 4 decades. Built for extreme environments, designed for safety, and trusted by core industries worldwide.
						</p>
						<p className="mt-5 text-[0.7rem] font-bold tracking-wide text-amber-600">{settings.address}</p>
					</div>

					{/* Products nav */}
					<div className="flex h-full flex-col lg:col-span-4">
						<h3 className="mb-5 flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-900">
                            <span className="block h-px w-3 bg-amber-500" />
							Products
						</h3>
						<ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
							{productLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="group flex items-center gap-2 text-[0.75rem] font-medium text-slate-600 transition hover:text-amber-600"
									>
										<ArrowRight className="h-3 w-3 opacity-0 -ml-5 shrink-0 transition-all group-hover:opacity-100 group-hover:ml-0 group-hover:text-amber-600" />
										<span className="min-w-0 leading-snug">{link.label}</span>
									</Link>
								</li>
							))}
							<li className="col-span-full sm:col-span-2 pt-1">
								<Link
									href="/products"
									className="group inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-wide text-amber-600 transition hover:text-amber-500"
								>
									<ArrowRight className="h-3 w-3 opacity-0 -ml-5 shrink-0 transition-all group-hover:opacity-100 group-hover:ml-0" />
									View all products
								</Link>
							</li>
						</ul>
					</div>

					{/* Company nav */}
					<div className="flex h-full flex-col lg:col-span-2">
						<h3 className="mb-5 flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-900">
                            <span className="block h-px w-3 bg-amber-500" />
							Company
						</h3>
						<ul className="space-y-3">
							{companyLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="group flex items-center gap-2 text-[0.75rem] font-medium text-slate-600 transition hover:text-amber-600"
									>
                                        <ArrowRight className="h-3 w-3 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0 group-hover:text-amber-600" />
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div className="flex h-full flex-col lg:col-span-2">
						<h3 className="mb-5 flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-900">
                            <span className="block h-px w-3 bg-amber-500" />
							Contact
						</h3>
						<ul className="space-y-3">
							{settings.phones.map((phone) => (
								<li key={phone}>
									<a
										href={`tel:${phone.replace(/[^+\d]/g, "")}`}
										className="text-[0.78rem] font-medium text-slate-600 transition hover:text-amber-600"
									>
										{phone}
									</a>
								</li>
							))}
							{settings.emails.map((email) => (
								<li key={email}>
									<a
										href={`mailto:${email}`}
										className="text-[0.78rem] font-medium text-amber-600 transition hover:text-amber-500"
									>
										{email}
									</a>
								</li>
							))}
							<li>
								<a
									href={`https://${settings.website}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[0.78rem] font-medium text-slate-600 transition hover:text-amber-600"
								>
									{settings.website}
								</a>
							</li>
						</ul>

					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
					<p className="text-[0.65rem] font-medium uppercase tracking-wider text-slate-500">
						&copy; {year} {settings.companyName}. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<span className="cursor-pointer text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 transition hover:text-amber-600">Privacy Policy</span>
						<span className="cursor-pointer text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 transition hover:text-amber-600">Terms</span>
						{/* LinkedIn */}
						<a
							href="#"
							aria-label="LinkedIn"
							className="h-6 w-6 text-slate-500 transition hover:text-amber-600"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
