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
    : "bg-transparent text-slate-900"; // Changed to slate-900 for light theme visibility

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
              <div className="h-full w-1.5 bg-amber-700" />
            </div>
            <span
              className="text-sm font-bold uppercase tracking-[0.16em] text-slate-900 transition group-hover:text-amber-600 lg:text-base lg:tracking-[0.2em]"
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
              className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:text-amber-600"
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
                className="inline-flex h-full items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:text-amber-600"
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
                      strokeWidth="2"
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
              className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:text-amber-600"
            >
              Gallery
            </Link>
            <Link
              href="/clients"
              className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:text-amber-600"
            >
              Clients
            </Link>
            <Link
              href="/careers"
              className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:text-amber-600"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:text-amber-600"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden items-center justify-center bg-amber-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-amber-500 lg:inline-flex"
            >
              Request Quote
            </Link>
            <button
              type="button"
              onClick={toggleMobile}
              className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 text-slate-900 transition hover:border-amber-500 hover:text-amber-600 lg:hidden"
              aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileOpen}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-[2px] w-full origin-center bg-current transition-transform ${
                    isMobileOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-current transition-opacity ${
                    isMobileOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] w-full origin-center bg-current transition-transform ${
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
            className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
          <div className="fixed inset-y-0 right-0 z-40 w-full max-w-sm border-l-4 border-slate-900 bg-white text-slate-900 shadow-xl lg:hidden">
            <div className="flex h-full flex-col px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="inline-flex h-8 w-8 items-center justify-center border-2 border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900"
                  aria-label="Close navigation"
                >
                  <span className="relative block h-3 w-3">
                    <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 bg-current" />
                    <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 bg-current" />
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
                  className="block px-2 py-3 text-sm font-bold uppercase tracking-wide border-b border-slate-100 hover:text-amber-600"
                >
                  About
                </Link>
                <div className="bg-slate-50 px-2 py-3 border-b border-slate-100">
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Products
                  </div>
                  <ul className="space-y-1 text-sm">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/products/${category.slug}`}
                          onClick={closeMobile}
                          className="flex items-center justify-between py-2 font-bold text-slate-700 hover:text-amber-600"
                        >
                          <span>{category.name}</span>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-amber-500">
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
                  className="block px-2 py-3 text-sm font-bold uppercase tracking-wide border-b border-slate-100 hover:text-amber-600"
                >
                  Gallery
                </Link>
                <Link
                  href="/clients"
                  onClick={closeMobile}
                  className="block px-2 py-3 text-sm font-bold uppercase tracking-wide border-b border-slate-100 hover:text-amber-600"
                >
                  Clients
                </Link>
                <Link
                  href="/careers"
                  onClick={closeMobile}
                  className="block px-2 py-3 text-sm font-bold uppercase tracking-wide border-b border-slate-100 hover:text-amber-600"
                >
                  Careers
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="block px-2 py-3 text-sm font-bold uppercase tracking-wide hover:text-amber-600"
                >
                  Contact
                </Link>
              </nav>

              <div className="border-t-4 border-slate-900 pt-4">
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="flex w-full items-center justify-center bg-amber-600 px-4 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-1 hover:bg-amber-500"
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
