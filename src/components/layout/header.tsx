"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product, ProductCategory, SiteSettings } from "@/lib/cms/types";
import { NavMegaMenu } from "./nav-mega-menu";

interface HeaderProps {
  settings: SiteSettings;
  categories: ProductCategory[];
  featuredProducts: Product[];
}

function Header({ settings, categories, featuredProducts }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        if (!isScrolled) setIsScrolled(true);
      } else if (isScrolled) setIsScrolled(false);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const headerBackgroundClass = isScrolled
    ? "bg-white/95 text-slate-900 shadow-sm border-b border-slate-200"
    : "bg-transparent text-slate-50";

  const toggleMobile = () => {
    setIsMobileOpen((open) => !open);
    if (isProductsOpen) setIsProductsOpen(false);
  };

  const closeMobile = () => setIsMobileOpen(false);

  const toggleProducts = () => setIsProductsOpen((open) => !open);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 backdrop-blur-lg ${headerBackgroundClass}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
          <Link href="/" className="group flex items-center gap-3" aria-label={settings.companyName}>
            <div className="flex h-5 w-4 gap-0.5">
              <div className="h-full w-1.5 bg-amber-500" />
              <div className="h-full w-1.5 bg-orange-500" />
            </div>
            <span
              className="text-sm font-bold uppercase tracking-[0.16em] text-slate-50 transition group-hover:text-amber-400 data-[scrolled=true]:text-slate-900 lg:text-base lg:tracking-[0.2em]"
              data-scrolled={isScrolled}
            >
              Jayco Industrial
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 lg:flex"
          >
            <Link
              href="/about"
              className="text-xs font-medium uppercase tracking-[0.16em] text-slate-200 transition hover:text-amber-400 data-[scrolled=true]:text-slate-700"
              data-scrolled={isScrolled}
            >
              About
            </Link>
            <div
              className="relative block py-4 -my-4"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button
                type="button"
                onClick={toggleProducts}
                className="inline-flex h-full items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:text-amber-400 data-[scrolled=true]:text-slate-700"
                data-scrolled={isScrolled}
                aria-expanded={isProductsOpen}
                aria-haspopup="true"
              >
                <span>Products</span>
                <span
                  className={`inline-block h-4 w-4 transition-transform ${
                    isProductsOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <NavMegaMenu
                open={isProductsOpen}
                onClose={() => setIsProductsOpen(false)}
                categories={categories}
                featuredProducts={featuredProducts}
              />
            </div>
            <Link
              href="/gallery"
              className="text-xs font-medium uppercase tracking-[0.16em] text-slate-200 transition hover:text-amber-400 data-[scrolled=true]:text-slate-700"
              data-scrolled={isScrolled}
            >
              Gallery
            </Link>
            <Link
              href="/clients"
              className="text-xs font-medium uppercase tracking-[0.16em] text-slate-200 transition hover:text-amber-400 data-[scrolled=true]:text-slate-700"
              data-scrolled={isScrolled}
            >
              Clients
            </Link>
            <Link
              href="/careers"
              className="text-xs font-medium uppercase tracking-[0.16em] text-slate-200 transition hover:text-amber-400 data-[scrolled=true]:text-slate-700"
              data-scrolled={isScrolled}
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className="text-xs font-medium uppercase tracking-[0.16em] text-slate-200 transition hover:text-amber-400 data-[scrolled=true]:text-slate-700"
              data-scrolled={isScrolled}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-sm transition hover:bg-amber-400 lg:inline-flex"
            >
              Request Quote
            </Link>
            <button
              type="button"
              onClick={toggleMobile}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-500/40 text-slate-100 transition hover:border-amber-400 hover:text-amber-400 lg:hidden"
              aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileOpen}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full origin-center bg-current transition-transform ${
                    isMobileOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity ${
                    isMobileOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-full origin-center bg-current transition-transform ${
                    isMobileOpen ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {isMobileOpen ? (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
          <div className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-slate-950 text-slate-50 shadow-xl lg:hidden">
            <div className="flex h-full flex-col px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 text-slate-200"
                  aria-label="Close navigation"
                >
                  <span className="relative block h-3 w-3">
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 bg-current" />
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 bg-current" />
                  </span>
                </button>
              </div>

              <nav
                className="flex-1 space-y-2 overflow-y-auto py-2"
                aria-label="Mobile navigation"
              >
                <Link
                  href="/about"
                  onClick={closeMobile}
                  className="block rounded-lg px-2 py-2 text-sm font-medium tracking-wide hover:bg-slate-800"
                >
                  About
                </Link>
                <div className="rounded-lg bg-slate-900/70 px-2 py-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Products
                  </div>
                  <ul className="space-y-1 text-sm">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/products/${category.slug}`}
                          onClick={closeMobile}
                          className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-800"
                        >
                          <span className="font-medium">{category.name}</span>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-amber-400">
                            View
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/gallery"
                  onClick={closeMobile}
                  className="block rounded-lg px-2 py-2 text-sm font-medium tracking-wide hover:bg-slate-800"
                >
                  Gallery
                </Link>
                <Link
                  href="/clients"
                  onClick={closeMobile}
                  className="block rounded-lg px-2 py-2 text-sm font-medium tracking-wide hover:bg-slate-800"
                >
                  Clients
                </Link>
                <Link
                  href="/careers"
                  onClick={closeMobile}
                  className="block rounded-lg px-2 py-2 text-sm font-medium tracking-wide hover:bg-slate-800"
                >
                  Careers
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="block rounded-lg px-2 py-2 text-sm font-medium tracking-wide hover:bg-slate-800"
                >
                  Contact
                </Link>
              </nav>

              <div className="border-t border-slate-800 pt-3">
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="flex w-full items-center justify-center rounded-full bg-amber-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-sm transition hover:bg-amber-400"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export { Header };
