"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface ProductStickyCtaProps {
	label: string
	enquiryHref: string
}

export function ProductStickyCta({ label, enquiryHref }: ProductStickyCtaProps) {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		function onScroll() {
			setVisible(window.scrollY > 280)
		}
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	if (!visible) return null

	return (
		<div
			className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-white/90"
			role="region"
			aria-label="Quick enquiry"
		>
			<div className="mx-auto flex max-w-7xl flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
				<p className="hidden text-sm font-medium text-slate-600 sm:block sm:max-w-md sm:truncate">
					Ready to specify this system for your facility?
				</p>
				<Link
					href={enquiryHref}
					className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-amber-600 px-6 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-amber-700 sm:max-w-xs sm:flex-none"
				>
					{label}
				</Link>
			</div>
		</div>
	)
}
