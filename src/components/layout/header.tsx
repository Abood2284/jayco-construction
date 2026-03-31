"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Globe, Menu, Search, X } from "lucide-react";
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("query") ?? "";

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>,
    shouldCloseMobile: boolean,
  ) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (shouldCloseMobile) {
      setIsMobileOpen(false);
    }

    if (!query) {
      router.push("/products");
      return;
    }

    router.push(`/products?query=${encodeURIComponent(query)}`);
  };

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-200 ${
          isScrolled ? "shadow-[0_12px_30px_rgba(15,23,42,0.08)]" : ""
        }`}
      >
        {/* Desktop header */}
        <div className="hidden lg:block">
          {/* Top row */}
          <div className="border-b border-black/10">
            <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-8 py-5">
              <Link
                href="/"
                aria-label={settings.companyName}
                className="shrink-0"
              >
                <Image
                  src="/images/jayco-logo.png"
                  alt={settings.companyName}
                  width={280}
                  height={58}
                  priority
                  className="h-12 w-auto object-contain"
                />
              </Link>

              <form
                role="search"
                aria-label="Search products"
                onSubmit={(e) => handleSearchSubmit(e, false)}
                className="flex min-w-0 flex-1 items-center"
              >
                <div className="flex h-14 w-full overflow-hidden rounded-none border border-black bg-white">
                  <label htmlFor="header-product-search" className="sr-only">
                    Search products
                  </label>
                  <input
                    id="header-product-search"
                    name="query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    autoComplete="off"
                    className="h-full flex-1 bg-transparent px-5 text-[0.95rem] text-slate-900 outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="flex h-full w-14 items-center justify-center bg-[#c62828] text-white transition hover:bg-[#b71c1c]"
                  >
                    <Search className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </form>

              <Link
                href="/contact"
                className="shrink-0 text-[0.95rem] font-medium text-slate-900 transition hover:text-[#b71c1c]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Bottom row */}
          <div className="border-b border-black/10 bg-white">
            <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-8">
              <nav
                aria-label="Main navigation"
                className="flex h-full items-center gap-10"
              >
                <Link
                  href="/about"
                  className="inline-flex h-full items-center text-[0.95rem] font-medium text-slate-900 transition hover:text-[#b71c1c]"
                >
                  <span className="mr-2">Company</span>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>

                <div
                  className="relative flex h-full items-center"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsProductsOpen((open) => !open)}
                    className="inline-flex h-full items-center text-[0.95rem] font-medium text-slate-900 transition hover:text-[#b71c1c]"
                    aria-expanded={isProductsOpen}
                    aria-haspopup="true"
                  >
                    <span className="mr-2">Brands</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        isProductsOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
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
                  className="inline-flex h-full items-center text-[0.95rem] font-medium text-slate-900 transition hover:text-[#b71c1c]"
                >
                  Gallery
                </Link>

                <Link
                  href="/clients"
                  className="inline-flex h-full items-center text-[0.95rem] font-medium text-slate-900 transition hover:text-[#b71c1c]"
                >
                  Clients
                </Link>

                <Link
                  href="/careers"
                  className="inline-flex h-full items-center text-[0.95rem] font-medium text-slate-900 transition hover:text-[#b71c1c]"
                >
                  <span className="mr-2">Careers</span>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </nav>

              <Link
                href="#"
                className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-slate-900 transition hover:text-[#b71c1c]"
              >
                <Globe className="h-4.5 w-4.5" aria-hidden="true" />
                <span>English</span>
              </Link>
            </div>
          </div>

          {/* Red accent strip */}
          <div className="w-full">
            <div className="h-[6px] bg-[#c62828]" />
            <div className="h-[2px] bg-[#a61d24]" />
            <div className="h-px bg-[#ef9a9a]" />
          </div>
        </div>

        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <Link href="/" aria-label={settings.companyName}>
              <Image
                src="/images/jayco-logo.png"
                alt={settings.companyName}
                width={220}
                height={50}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center border border-black text-black"
              aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="w-full">
            <div className="h-[5px] bg-[#c62828]" />
            <div className="h-[2px] bg-[#a61d24]" />
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={closeMobile}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl lg:hidden">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
                <span className="text-sm font-semibold tracking-wide text-slate-900">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="inline-flex h-10 w-10 items-center justify-center border border-black text-black"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <form
                  role="search"
                  aria-label="Search products"
                  onSubmit={(e) => handleSearchSubmit(e, true)}
                  className="mb-6"
                >
                  <div className="flex h-12 overflow-hidden border border-black bg-white">
                    <label htmlFor="mobile-product-search" className="sr-only">
                      Search products
                    </label>
                    <input
                      id="mobile-product-search"
                      name="query"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      autoComplete="off"
                      className="h-full flex-1 bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      aria-label="Search"
                      className="flex h-full w-12 items-center justify-center bg-[#c62828] text-white"
                    >
                      <Search className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </form>

                <nav aria-label="Mobile navigation" className="space-y-1">
                  <Link
                    href="/about"
                    onClick={closeMobile}
                    className="block border-b border-slate-200 py-3 text-base font-medium text-slate-900"
                  >
                    Company
                  </Link>

                  <div className="border-b border-slate-200 py-3">
                    <div className="mb-3 flex items-center justify-between text-base font-medium text-slate-900">
                      <span>Brands</span>
                    </div>

                    <ul className="space-y-2 pl-1">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/products/${category.slug}`}
                            onClick={closeMobile}
                            className="block text-sm text-slate-600 transition hover:text-[#b71c1c]"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/gallery"
                    onClick={closeMobile}
                    className="block border-b border-slate-200 py-3 text-base font-medium text-slate-900"
                  >
                    Gallery
                  </Link>

                  <Link
                    href="/clients"
                    onClick={closeMobile}
                    className="block border-b border-slate-200 py-3 text-base font-medium text-slate-900"
                  >
                    Clients
                  </Link>

                  <Link
                    href="/careers"
                    onClick={closeMobile}
                    className="block border-b border-slate-200 py-3 text-base font-medium text-slate-900"
                  >
                    Careers
                  </Link>

                  <Link
                    href="/contact"
                    onClick={closeMobile}
                    className="block py-3 text-base font-medium text-slate-900"
                  >
                    Contact Us
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export { Header };
