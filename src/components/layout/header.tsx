"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, FileText, LayoutGrid, Menu, Phone, X } from "lucide-react";
import type { ProductCategory, SiteSettings } from "@/lib/cms/types";
import { buildPhoneHref, headerNavConfig } from "@/lib/content/navigation";

interface HeaderProps {
	settings: SiteSettings;
	categories: ProductCategory[];
}

function isActivePath(pathname: string, href: string, match: "exact" | "prefix") {
	if (match === "exact") {
		return pathname === href;
	}

	return pathname === href || pathname.startsWith(`${href}/`);
}

function Header({ settings, categories }: HeaderProps) {
	const pathname = usePathname();
	const firstPhone = settings.phones[0] ?? "";
	const phoneHref = firstPhone ? buildPhoneHref(firstPhone) : "/contact";
	const drawerId = useId();
	const productsPanelId = useId();
	const productsMenuRef = useRef<HTMLDivElement | null>(null);

	const [isScrolled, setIsScrolled] = useState(false);
	const [showMobileActionBar, setShowMobileActionBar] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isProductsOpen, setIsProductsOpen] = useState(false);
	const scrollRafRef = useRef<number | null>(null);
	const lastScrolledRef = useRef<boolean | null>(null);
	const lastShowBarRef = useRef<boolean | null>(null);

	useEffect(() => {
		function onScroll() {
			if (scrollRafRef.current !== null) return;
			scrollRafRef.current = window.requestAnimationFrame(() => {
				scrollRafRef.current = null;
				const y = window.scrollY;
				const scrolled = y > 12;
				const showBar = y > 220;
				if (lastScrolledRef.current !== scrolled) {
					lastScrolledRef.current = scrolled;
					setIsScrolled(scrolled);
				}
				if (lastShowBarRef.current !== showBar) {
					lastShowBarRef.current = showBar;
					setShowMobileActionBar(showBar);
				}
			});
		}

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", onScroll);
			if (scrollRafRef.current !== null) window.cancelAnimationFrame(scrollRafRef.current);
		};
	}, []);

	useEffect(() => {
		setIsDrawerOpen(false);
		setIsProductsOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (!isDrawerOpen) {
			document.body.style.overflow = "";
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isDrawerOpen]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;

			setIsDrawerOpen(false);
			setIsProductsOpen(false);
		};

		window.addEventListener("keydown", onKeyDown);

		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	useEffect(() => {
		if (!isProductsOpen) return;

		const onPointerDown = (event: PointerEvent) => {
			if (!productsMenuRef.current?.contains(event.target as Node)) {
				setIsProductsOpen(false);
			}
		};

		window.addEventListener("pointerdown", onPointerDown);

		return () => window.removeEventListener("pointerdown", onPointerDown);
	}, [isProductsOpen]);

	return (
		<>
			<header
				className={`fixed inset-x-0 top-0 z-50 border-b border-slate-900/10 bg-white/96 pt-[env(safe-area-inset-top,0px)] transition-all duration-200 supports-backdrop-filter:backdrop-blur-md max-lg:supports-[backdrop-filter]:backdrop-blur-sm ${
					isScrolled ? "shadow-[0_18px_40px_rgba(15,23,42,0.08)]" : ""
				}`}
			>
				<div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:h-[84px] lg:px-8">
					<Link href="/" aria-label={settings.companyName} className="min-w-0 shrink">
						<Image
							src="/images/jayco-logo.png"
							alt={settings.companyName}
							width={280}
							height={58}
							priority
							className="h-8 w-auto max-w-[min(52vw,200px)] object-contain sm:h-10 sm:max-w-none lg:h-11"
						/>
					</Link>

					<nav aria-label="Primary navigation" className="ml-6 hidden items-center gap-1 lg:flex">
						<div
							ref={productsMenuRef}
							className="relative"
							onMouseEnter={() => setIsProductsOpen(true)}
							onMouseLeave={() => setIsProductsOpen(false)}
							onFocus={() => setIsProductsOpen(true)}
							onBlur={(event) => {
								if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
									setIsProductsOpen(false);
								}
							}}
						>
							<button
								type="button"
								aria-expanded={isProductsOpen}
								aria-controls={productsPanelId}
								className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-[0.92rem] font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none ${
									isActivePath(pathname, "/products", "prefix") || isProductsOpen
										? "border-rose-700 text-slate-950"
										: "border-transparent text-slate-600 hover:text-slate-950"
								}`}
								onClick={() => setIsProductsOpen((open) => !open)}
							>
								<span>Products</span>
								<ChevronDown
									className={`h-4 w-4 transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
									aria-hidden="true"
								/>
							</button>

							<div
								id={productsPanelId}
								className={`absolute left-0 top-full z-20 w-[min(760px,calc(100vw-6rem))] pt-4 transition-all duration-150 ${
									isProductsOpen
										? "pointer-events-auto translate-y-0 opacity-100"
										: "pointer-events-none -translate-y-1 opacity-0"
								}`}
							>
								<div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
									<div className="grid gap-0 border-b border-slate-200 bg-slate-50/80 md:grid-cols-[220px_minmax(0,1fr)]">
										<div className="border-b border-slate-200 px-6 py-5 md:border-b-0 md:border-r">
											<p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-slate-500">
												Product Access
											</p>
											<p className="mt-3 text-sm leading-relaxed text-slate-600">
												Start with the category that matches your lifting, handling, or access requirement.
											</p>
										</div>
										<div className="grid gap-px bg-slate-200 md:grid-cols-2">
											{categories.map((category) => (
												<Link
													key={category.slug}
													href={`/products/${category.slug}`}
													className="group min-h-[112px] bg-white px-6 py-5 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50"
												>
													<div className="flex items-start justify-between gap-4">
														<div>
															<p className="text-base font-semibold text-slate-950">{category.name}</p>
															<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
																{category.intro}
															</p>
														</div>
														<ArrowRight className="mt-1 h-4 w-4 shrink-0 text-rose-700 transition-transform group-hover:translate-x-1" aria-hidden="true" />
													</div>
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
										<p className="text-sm text-slate-600">{headerNavConfig.primaryLinks[0]?.description}</p>
										<div className="flex items-center gap-3">
											<a
												href={phoneHref}
												className="inline-flex min-h-11 items-center gap-2 border border-slate-300 px-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
											>
												<Phone className="h-4 w-4" aria-hidden="true" />
												Call Now
											</a>
											<Link
												href="/products"
												className="inline-flex min-h-11 items-center gap-2 bg-slate-950 px-5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-slate-800"
											>
												View All Products
												<ArrowRight className="h-4 w-4" aria-hidden="true" />
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>

						{headerNavConfig.primaryLinks
							.filter((item) => item.href !== "/products")
							.map((item) => {
								const active = isActivePath(pathname, item.href, item.match);

								return (
									<Link
										key={item.href}
										href={item.href}
										aria-current={active ? "page" : undefined}
										className={`inline-flex min-h-11 items-center border-b-2 px-4 text-[0.92rem] font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none ${
											active
												? "border-rose-700 text-slate-950"
												: "border-transparent text-slate-600 hover:text-slate-950"
										}`}
									>
										{item.label}
									</Link>
								);
							})}
					</nav>

					<div className="ml-auto hidden items-center gap-3 lg:flex">
						<a
							href={phoneHref}
							className="inline-flex min-h-11 items-center gap-2 border border-slate-300 px-4 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
						>
							<Phone className="h-4 w-4" aria-hidden="true" />
							Call Now
						</a>
						<Link
							href={headerNavConfig.ctaActions.quote.href}
							className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-700 px-5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_32px_rgba(190,24,93,0.18)] transition-colors hover:bg-rose-600"
						>
							{headerNavConfig.ctaActions.quote.label}
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</Link>
					</div>

					<div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
						<a
							href={phoneHref}
							className="font-heading inline-flex min-h-11 max-w-full items-center gap-1.5 whitespace-nowrap border border-slate-300 px-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-slate-800 sm:gap-2 sm:px-3 sm:text-[0.72rem] sm:tracking-widest"
						>
							<Phone className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
							<span>Call Now</span>
						</a>
						<button
							type="button"
							aria-label={isDrawerOpen ? "Close navigation" : "Open navigation"}
							aria-expanded={isDrawerOpen}
							aria-controls={drawerId}
							className="inline-flex min-h-11 min-w-11 items-center justify-center border border-slate-900 bg-slate-950 text-white"
							onClick={() => setIsDrawerOpen((open) => !open)}
						>
							{isDrawerOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
						</button>
					</div>
				</div>
			</header>

			{isDrawerOpen ? (
				<>
					<div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onClick={() => setIsDrawerOpen(false)} />
					<div
						id={drawerId}
						role="dialog"
						aria-modal="true"
						aria-label="Mobile navigation"
						className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] lg:hidden"
					>
						<div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
							<div>
								<p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-slate-500">Navigation</p>
								<p className="mt-1 text-sm font-semibold text-slate-950">{settings.shortName}</p>
							</div>
							<button
								type="button"
								onClick={() => setIsDrawerOpen(false)}
								className="inline-flex min-h-11 min-w-11 items-center justify-center border border-slate-300 text-slate-950"
								aria-label="Close navigation"
							>
								<X className="h-5 w-5" aria-hidden="true" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto">
							<div className="border-b border-slate-200 bg-slate-50 px-4 py-5">
								<p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-slate-500">Quick Actions</p>
								<div className="mt-4 grid grid-cols-2 gap-3">
									<a
										href={phoneHref}
										className="inline-flex min-h-12 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900"
									>
										<Phone className="h-4 w-4" aria-hidden="true" />
										Call Now
									</a>
									<Link
										href={headerNavConfig.ctaActions.quote.href}
										className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
									>
										Request Quote
										<ArrowRight className="h-4 w-4" aria-hidden="true" />
									</Link>
								</div>
							</div>

							<div className="border-b border-slate-200 px-4 py-5">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-slate-500">Products First</p>
										
									</div>
									<Link
										href="/products"
										className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-red-200 bg-red-50 px-4 shadow-sm transition-shadow hover:shadow-md text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-red-700"
									>
										All Products
									</Link>
								</div>
								<div className="mt-4 grid gap-3">
									{categories.map((category) => (
										<Link
											key={category.slug}
											href={`/products/${category.slug}`}
											className="block rounded-sm border border-slate-200 px-4 py-4 transition-colors hover:border-slate-900 hover:bg-slate-50 focus-visible:border-slate-900 focus-visible:bg-slate-50"
										>
											<p className="text-base font-semibold text-slate-950">{category.name}</p>
											<p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{category.intro}</p>
										</Link>
									))}
								</div>
							</div>

							<nav aria-label="Mobile navigation links" className="px-4 py-4">
								<ul className="space-y-1">
									{headerNavConfig.primaryLinks
										.filter((item) => item.href !== "/products")
										.map((item) => {
											const active = isActivePath(pathname, item.href, item.match);

											return (
												<li key={item.href}>
													<Link
														href={item.href}
														aria-current={active ? "page" : undefined}
														className={`flex min-h-14 items-center justify-between gap-4 border-b border-slate-200 px-1 py-3 transition-colors ${
															active ? "text-slate-950" : "text-slate-700 hover:text-slate-950"
														}`}
													>
														<div>
															<p className="text-base font-semibold">{item.label}</p>
															{item.description ? (
																<p className="mt-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
															) : null}
														</div>
														<ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
													</Link>
												</li>
											);
										})}
								</ul>
							</nav>

							<div className="border-t border-slate-200 bg-slate-50 px-4 py-5">
								<p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-slate-500">Direct Contact</p>
								<div className="mt-3 space-y-2">
									{settings.phones.slice(0, 2).map((phone) => (
										<a
											key={phone}
											href={buildPhoneHref(phone)}
											className="flex min-h-11 items-center text-base font-semibold text-slate-950"
										>
											{phone}
										</a>
									))}
								</div>
							</div>
						</div>
					</div>
				</>
			) : null}

			<div
				className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-200 ease-out lg:hidden ${
					showMobileActionBar && !isDrawerOpen
						? "pointer-events-auto translate-y-0 opacity-100"
						: "pointer-events-none translate-y-full opacity-0"
				}`}
			>
				<nav
					className="mx-auto max-w-md px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
					aria-label="Quick actions"
				>
					<div className="flex gap-1.5 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-[0_8px_32px_rgba(15,23,42,0.1)] supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-white/88">
						<a
							href={phoneHref}
							className="flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl border border-slate-200/80 bg-slate-50/90 px-2 py-2 text-center text-[0.65rem] font-normal leading-tight text-slate-600 transition-colors active:bg-slate-100"
						>
							<Phone className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} aria-hidden="true" />
							<span>Call</span>
						</a>
						<Link
							href={headerNavConfig.ctaActions.quote.href}
							className="flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl bg-red-600 px-2 py-2 text-center text-[0.65rem] font-normal leading-tight text-white transition-colors hover:bg-red-500 active:bg-red-700"
						>
							<FileText className="h-3.5 w-3.5 opacity-90" strokeWidth={1.75} aria-hidden="true" />
							<span>Request quote</span>
						</Link>
						<Link
							href="/products"
							className="flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl border border-slate-200/80 bg-white px-2 py-2 text-center text-[0.65rem] font-normal leading-tight text-slate-600 transition-colors hover:bg-slate-50 active:bg-slate-100"
						>
							<LayoutGrid className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} aria-hidden="true" />
							<span>Products</span>
						</Link>
					</div>
				</nav>
			</div>
		</>
	);
}

export { Header };
