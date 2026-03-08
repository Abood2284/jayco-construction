import Image from "next/image"
import Link from "next/link"
import type { SiteSettings } from "@/lib/cms/types"

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
		<footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
			<div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
				<div className="grid gap-10 lg:grid-cols-4">
					{/* Brand */}
					<div className="lg:col-span-1">
						<Link href="/" aria-label={settings.companyName} className="mb-4 group flex items-center gap-3">
							<div className="flex h-5 w-4 gap-0.5">
								<div className="h-full w-1.5 bg-amber-500" />
								<div className="h-full w-1.5 bg-orange-500" />
							</div>
							<span
								className="text-sm font-bold uppercase tracking-[0.16em] text-slate-50 lg:text-base lg:tracking-[0.2em]"
							>
								Jayco Industrial
							</span>
						</Link>
						<p className="mt-3 max-w-[28ch] text-[0.78rem] leading-relaxed text-slate-400">
							Heavy-industrial manufacturing systems with engineered quality and field-ready support.
						</p>
						<p className="mt-3 text-[0.72rem] text-slate-500">{settings.address}</p>
					</div>

					{/* Products nav */}
					<div>
						<h3 className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-300">
							Products
						</h3>
						<ul className="space-y-2.5">
							{productLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-[0.78rem] text-slate-400 transition hover:text-amber-400"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company nav */}
					<div>
						<h3 className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-300">
							Company
						</h3>
						<ul className="space-y-2.5">
							{companyLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-[0.78rem] text-slate-400 transition hover:text-amber-400"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-300">
							Contact
						</h3>
						<ul className="space-y-2.5">
							{settings.phones.map((phone) => (
								<li key={phone}>
									<a
										href={`tel:${phone.replace(/[^+\d]/g, "")}`}
										className="text-[0.78rem] text-slate-400 transition hover:text-amber-400"
									>
										{phone}
									</a>
								</li>
							))}
							{settings.emails.map((email) => (
								<li key={email}>
									<a
										href={`mailto:${email}`}
										className="text-[0.78rem] text-slate-400 transition hover:text-amber-400"
									>
										{email}
									</a>
								</li>
							))}
						</ul>

						<Link
							href="/contact"
							className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400"
						>
							Request Quote
						</Link>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row">
					<p className="text-[0.68rem] text-slate-500">
						&copy; {year} {settings.companyName}. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<span className="text-[0.68rem] text-slate-500">Privacy Policy</span>
						<span className="text-[0.68rem] text-slate-500">Terms</span>
						{/* LinkedIn */}
						<a
							href="#"
							aria-label="LinkedIn"
							className="h-7 w-7 text-slate-500 transition hover:text-amber-400"
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
