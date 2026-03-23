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

          <h1 className="mb-6 text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_24px_rgba(2,6,23,0.65)]">
            Industrial Lifting
            <br />
            <span className="text-amber-400">&amp; Material Handling</span>
            <br />
            Equipments.
          </h1>

          <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-white sm:text-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_2px_14px_rgba(2,6,23,0.9)]">
            With over four decades of expertise, JAYCO designs and manufactures robust electric hoists, cranes, and custom lifts to ensure safe and efficient operations across all core industries.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="hidden h-14 items-center justify-center gap-2 bg-amber-500 px-8 text-sm font-bold uppercase tracking-wider text-slate-950 shadow-[4px_4px_0px_0px_rgba(2,6,23,0.75)] transition-all hover:-translate-y-1 hover:bg-amber-400 hover:shadow-[6px_6px_0px_0px_rgba(2,6,23,0.9)] md:inline-flex"
            >
              Explore Our Solutions
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 w-full items-center justify-center gap-2 border-2 border-white/80 bg-white/10 px-8 text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(2,6,23,0.65)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-[6px_6px_0px_0px_rgba(2,6,23,0.85)] md:w-auto"
            >
              Request a Quote
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-l-4 border-amber-400 pl-4 text-xs font-semibold text-white sm:mt-12 sm:flex-row sm:items-center sm:gap-6 sm:border-0 sm:pl-0 sm:text-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_10px_rgba(2,6,23,0.8)]">
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
              Trusted for <span className="font-bold text-amber-300">Heavy Duty</span> applications across key sectors.
            </p>
          </div>
        </div>

        {/* Right — Heavy Angular Image / Banner panel */}
        <div className="mt-16 lg:mt-0 lg:w-[45%]">
          <div className="relative border-4 border-slate-900 bg-slate-900 p-2 shadow-[8px_8px_0px_0px_rgba(245,158,11,1)]">
            {/* Auto Scrolling Banner */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-800">
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
              <div className="absolute bottom-0 left-0 hidden border-r-4 border-t-4 border-slate-900 bg-white p-5 md:block lg:p-6">
                <div className="mb-4 flex items-center gap-3">
                   <div className="h-6 w-2 bg-amber-500" />
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                     Why Choose Jayco
                   </h3>
                </div>
                <ul className="space-y-3">
                  {values.map((value, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm font-bold text-slate-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={3} />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Decorative Hazard Stripe */}
            <div className="absolute -left-4 -top-4 h-8 w-24 bg-[repeating-linear-gradient(-45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] border-2 border-slate-900" />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slide {
             0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

