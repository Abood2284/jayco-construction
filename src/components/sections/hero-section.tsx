import Link from "next/link";
import type { SiteSettings } from "@/lib/cms/types";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const ticker = [
    "ISO 9001",
    "ASME Certified",
    "AWS D1.1",
    "OSHA Compliant",
    "ISO 9001",
    "ASME Certified",
    "AWS D1.1",
    "OSHA Compliant",
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Subtle texture grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
        }}
      />
      {/* Amber glow top-right */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-amber-500 opacity-[0.06] blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-28 lg:flex-row lg:items-center lg:gap-12 lg:px-6 lg:pb-20 lg:pt-28">
        {/* Left — editorial copy */}
        <div className="text-white lg:w-[55%]">
          <p className="mb-5 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-400">
            <span className="block h-px w-6 bg-amber-400" />
            Premium Heavy-Industrial
          </p>

          <h1 className="mb-6 text-[clamp(2rem,4.5vw,4rem)] font-bold leading-[1.1] tracking-tight text-white">
            Engineered Systems
            <br />
            <span className="text-amber-400">That Hold Up</span>
            <br />
            Under Real Load.
          </h1>

          {/* Animated amber rule */}
          <div
            className="mb-8 h-0.5 w-24 bg-amber-500"
            style={{ animation: "grow-right 0.8s ease 0.4s both" }}
          />

          <div className="flex flex-wrap gap-4">
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5 hover:bg-amber-400"
            >
              Explore Products
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-600 px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-amber-400 hover:text-amber-400"
            >
              Request Quote
            </a>
          </div>
        </div>

        {/* Right — dark stat panel */}
        <div className="mt-12 lg:mt-0 lg:w-[45%]">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            {/* Decorative rings */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-2xl border border-amber-500/20" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-2xl border border-slate-700/60" />

            {/* Stat grid */}
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-800">
              <div className="p-6">
                <p className="mb-1 text-4xl font-bold text-amber-400">
                  {settings.yearsInBusiness}+
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Years in business
                </p>
              </div>
              <div className="p-6">
                <p className="mb-1 text-4xl font-bold text-amber-400">
                  {settings.industriesServed.length}
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Industries served
                </p>
              </div>
              <div className="col-span-2 p-6">
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Standards &amp; Compliance
                </p>
                <div className="flex flex-wrap gap-2">
                  {settings.standards.map((std) => (
                    <span
                      key={std}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-slate-300"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrolling ticker */}
            <div className="overflow-hidden border-t border-slate-800 bg-slate-950 py-3">
              <div
                className="flex w-max gap-8 whitespace-nowrap"
                style={{ animation: "marquee 18s linear infinite" }}
              >
                {ticker.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-slate-500"
                  >
                    {item}
                    <span className="ml-8 text-amber-600">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Industries list */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {settings.industriesServed.map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-[0.7rem] font-medium text-slate-300">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
				@keyframes grow-right {
					from { width: 0; opacity: 0; }
					to { width: 6rem; opacity: 1; }
				}
				@keyframes marquee {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
			`}</style>
    </section>
  );
}
