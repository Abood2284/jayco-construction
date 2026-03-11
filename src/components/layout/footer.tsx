import Link from "next/link"
import type { SiteSettings } from "@/lib/cms/types"
import { ArrowRight } from "lucide-react"

interface FooterProps {
	settings: SiteSettings
}

const productLinks = [
	{ href: "/products/material-handling-systems", label: "Material Handling" },
	{ href: "/products/pressure-vessels", label: "Pressure Vessels" },
	{ href: "/products/fabrication-services", label: "Fabrication Services" },
	{ href: "/products", label: "View all products" },
]

const companyLinks = [
	{ href: "/about", label: "About" },
	{ href: "/gallery", label: "Gallery" },
	{ href: "/clients", label: "Clients" },
	{ href: "/careers", label: "Careers" },
	{ href: "/contact", label: "Contact" },
]

export function Footer({ settings }: FooterProps) {
	const year = new Date().getFullYear()

	return (
		<footer className="border-t-4 border-amber-600 bg-slate-50 text-slate-600">
			<div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
					{/* Brand */}
					<div className="lg:col-span-1 border-b border-slate-200 pb-8 lg:border-none lg:pb-0">
						<Link href="/" aria-label={settings.companyName} className="mb-5 group flex items-center gap-3">
							<div className="flex h-5 w-4 gap-0.5">
								<div className="h-full w-1.5 bg-amber-500" />
								<div className="h-full w-1.5 bg-orange-500" />
							</div>
							<span
								className="text-sm font-black uppercase tracking-[0.16em] text-slate-900 lg:text-base lg:tracking-[0.2em]"
							>
								Jayco Cranes
							</span>
						</Link>
						<p className="mt-4 max-w-[32ch] text-[0.75rem] font-medium leading-relaxed text-slate-600">
							Engineering heavy-duty material handling solutions for over 4 decades. Built for extreme environments, designed for safety, and trusted by core industries worldwide.
						</p>
						<p className="mt-5 text-[0.7rem] font-bold tracking-wide text-amber-600">{settings.address}</p>
					</div>

					{/* Products nav */}
					<div>
						<h3 className="mb-5 flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-900">
                            <span className="block h-px w-3 bg-amber-500" />
							Products
						</h3>
						<ul className="space-y-3">
							{productLinks.map((link) => (
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

					{/* Company nav */}
					<div>
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
					<div>
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

						<Link
							href="/contact"
							className="mt-8 inline-flex h-10 items-center justify-center gap-2 bg-slate-900 px-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white shadow-[4px_4px_0_0_rgba(245,158,11,1)] transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-[6px_6px_0_0_rgba(245,158,11,1)] shrink-0"
						>
							Request Quote
                            <ArrowRight className="h-4 w-4" />
						</Link>
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
