import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/cms/types";
import { Check, ArrowRight, Factory, Zap, HardHat, Beaker } from "lucide-react";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings: _settings }: HeroSectionProps) {
  void _settings
  const values = [
    "40+ Years of Proven Expertise",
    "Modular Construction & Robust Design",
    "Custom-Built for Core Industries",
    "Cost-Effective, Unmatched Safety",
  ];

  const banners = [
    "/images/banner-1.jpg",
    "/images/banner-2.jpg",
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 pt-28">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero.jpeg"
          alt="Construction equipment used for industrial lifting projects"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-[center_20%] opacity-[0.84] max-lg:object-[center_8%] max-lg:opacity-[0.70] lg:object-[center_28%] lg:opacity-90"
        />
      </div>
      {/* Darker scrim on mobile; left-heavy on lg so copy column sits on a stable read surface */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-950/90 to-slate-950/86 lg:bg-linear-to-r lg:from-slate-950/92 lg:via-slate-950/72 lg:to-slate-950/42" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-950/10 to-slate-950/28 lg:from-slate-950/45 lg:via-transparent lg:to-slate-950/12" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col px-4 pb-16 lg:flex-row lg:items-center lg:gap-12 lg:px-6">
        {/* Left — editorial copy */}
        <div className="lg:w-[55%] rounded-2xl border border-white/15 bg-slate-950/50 px-5 py-7 pt-8 backdrop-blur-md lg:border-white/10 lg:bg-slate-950/45 lg:px-6 lg:py-8 lg:pt-8">

          <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-200/90">
            Jayco Hoist &amp; Cranes
          </p>
          <h1 className="mb-6 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_24px_rgba(2,6,23,0.65)]">
            Industrial lifting and material handling equipment, engineered for duty
          </h1>

          <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-white/95 sm:text-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_2px_14px_rgba(2,6,23,0.9)]">
            With over four decades of expertise, JAYCO designs and manufactures robust electric hoists, cranes, and custom lifts to ensure safe and efficient operations across all core industries.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="hidden h-12 items-center justify-center gap-2 rounded-md bg-amber-500 px-7 text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-sm transition-colors hover:bg-amber-400 md:inline-flex"
            >
              Explore solutions
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/75 bg-white/10 px-7 text-sm font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 md:w-auto"
            >
              Request a quote
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-l-2 border-amber-500/80 pl-4 text-xs font-medium text-white sm:mt-12 sm:flex-row sm:items-center sm:gap-6 sm:border-0 sm:pl-0 sm:text-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_10px_rgba(2,6,23,0.8)]">
            <div className="flex -space-x-1 sm:-space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/45 bg-white/15 text-white shadow-sm backdrop-blur-sm sm:h-12 sm:w-12" title="Heavy Engineering / Steel">
                  <Factory className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/45 bg-white/15 text-white shadow-sm backdrop-blur-sm sm:h-12 sm:w-12" title="Construction">
                  <HardHat className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/45 bg-white/15 text-white shadow-sm backdrop-blur-sm sm:h-12 sm:w-12" title="Power">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/45 bg-white/15 text-white shadow-sm backdrop-blur-sm sm:h-12 sm:w-12" title="Pharma / Chemical">
                  <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <p className="max-w-[30ch] text-white sm:max-w-none">
              Trusted for <span className="font-semibold text-amber-200">heavy-duty</span> applications across key sectors.
            </p>
          </div>
        </div>

        {/* Mobile — same banner images as desktop panel (crossfade; no Why Choose card) */}
        <div
          className="relative mt-10 w-full md:hidden"
          role="region"
          aria-label="Featured facilities and equipment"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/20 bg-slate-900 shadow-xl ring-1 ring-white/10">
            {banners.map((src, idx) => (
              <div
                key={src}
                className={`absolute inset-0 ${idx === 0 ? "hero-mobile-car-0" : "hero-mobile-car-1"}`}
              >
                <Image
                  src={src}
                  alt={
                    idx === 0
                      ? "Jayco manufacturing and lifting equipment"
                      : "Industrial cranes and material handling"
                  }
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={idx === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-slate-900/15" />
              </div>
            ))}
          </div>
          <div
            className="mt-3 flex justify-center gap-2"
            aria-hidden="true"
          >
            <span className="hero-mobile-dot-0 h-2 w-2 rounded-full bg-amber-400" />
            <span className="hero-mobile-dot-1 h-2 w-2 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Right — Heavy Angular Image / Banner panel (tablet/desktop only) */}
        <div className="mt-16 hidden md:mt-16 md:block lg:mt-0 lg:w-[45%]">
          <div className="relative rounded-xl border border-white/15 bg-slate-900/50 p-1.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
            {/* Auto Scrolling Banner */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-800">
              <div 
                className="flex h-full w-[200%]"
                style={{ animation: "slide 20s linear infinite" }}
              >
                 {banners.map((src, idx) => (
                   <div key={idx} className="relative h-full w-1/2 shrink-0">
                     <Image
                        src={src}
                        alt={`Jayco banner ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                     />
                     <div className="absolute inset-0 bg-slate-900/20" />
                   </div>
                 ))}
                 {/* Duplicate for seamless looping */}
                 {banners.map((src, idx) => (
                   <div key={`dup-${idx}`} className="relative h-full w-1/2 shrink-0">
                     <Image
                        src={src}
                        alt={`Jayco banner clone ${idx + 1}`}
                        fill
                        className="object-cover"
                     />
                     <div className="absolute inset-0 bg-slate-900/20" />
                   </div>
                 ))}
              </div>

              {/* Solid Angular Value Prop Box over Image (hidden on small screens) */}
              <div className="absolute bottom-0 left-0 hidden max-w-[min(100%,26rem)] rounded-tr-lg border border-slate-200/90 bg-white/95 p-5 shadow-lg backdrop-blur-md md:block lg:p-6">
                <div className="mb-4 flex items-center gap-3">
                   <div className="h-5 w-1 rounded-full bg-amber-600" />
                   <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                     Why choose Jayco
                   </h3>
                </div>
                <ul className="space-y-3">
                  {values.map((value, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm font-medium text-slate-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" strokeWidth={2.5} />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slide {
             0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
        }
        @keyframes heroMobileFade0 {
          0%, 42% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes heroMobileFade1 {
          0%, 42% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }
        @keyframes heroMobileDot0 {
          0%, 42% { opacity: 1; transform: scale(1.15); }
          50%, 100% { opacity: 0.35; transform: scale(1); }
        }
        @keyframes heroMobileDot1 {
          0%, 42% { opacity: 0.35; transform: scale(1); }
          50%, 100% { opacity: 1; transform: scale(1.15); }
        }
        .hero-mobile-car-0 {
          animation: heroMobileFade0 9s ease-in-out infinite;
        }
        .hero-mobile-car-1 {
          animation: heroMobileFade1 9s ease-in-out infinite;
        }
        .hero-mobile-dot-0 {
          animation: heroMobileDot0 9s ease-in-out infinite;
        }
        .hero-mobile-dot-1 {
          animation: heroMobileDot1 9s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

