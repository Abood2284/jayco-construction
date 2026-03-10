import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/cms/types";
import { Check, ArrowRight, Factory, Zap, HardHat, Building2, Beaker } from "lucide-react";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
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
    <section className="relative min-h-screen overflow-hidden bg-[var(--bg)] pt-28">
      {/* Subtle texture grid for light mode */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 40px,#000 40px,#000 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#000 40px,#000 41px)",
        }}
      />
      {/* Accent glow top-right */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] bg-amber-500 opacity-10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col px-4 pb-16 lg:flex-row lg:items-center lg:gap-12 lg:px-6">
        {/* Left — editorial copy */}
        <div className="lg:w-[55%] pt-8 lg:pt-0">

          <h1 className="mb-6 text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-slate-900">
            Industrial Lifting
            <br />
            <span className="text-amber-600">&amp; Material Handling</span>
            <br />
            Equipments.
          </h1>

          <p className="mb-8 max-w-xl text-base sm:text-lg font-medium text-slate-600">
            With over four decades of expertise, JAYCO designs and manufactures robust electric hoists, cranes, and custom lifts to ensure safe and efficient operations across all core industries.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="hidden md:inline-flex h-14 items-center justify-center gap-2 bg-amber-600 px-8 text-sm font-bold uppercase tracking-wider text-slate-900 transition-all hover:-translate-y-1 hover:bg-amber-500 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
            >
              Explore Our Solutions
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 w-full md:w-auto items-center justify-center gap-2 border-2 border-slate-900 bg-white px-8 text-sm font-bold uppercase tracking-wider text-slate-900 transition-all hover:-translate-y-1 hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
            >
              Request a Quote
            </Link>
          </div>

          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-500/80 border-l-4 border-amber-500 pl-4 sm:border-0 sm:pl-0">
            <div className="flex -space-x-1 sm:-space-x-2">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-[var(--bg)] bg-slate-100 text-slate-600 shadow-sm" title="Heavy Engineering / Steel">
                  <Factory className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-[var(--bg)] bg-slate-100 text-slate-600 shadow-sm" title="Construction">
                  <HardHat className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-[var(--bg)] bg-slate-100 text-slate-600 shadow-sm" title="Power">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-[var(--bg)] bg-slate-100 text-slate-600 shadow-sm" title="Pharma / Chemical">
                  <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <p className="max-w-[30ch] sm:max-w-none">
              Trusted for <span className="font-bold text-slate-900">Heavy Duty</span> applications across key sectors.
            </p>
          </div>
        </div>

        {/* Right — Heavy Angular Image / Banner panel */}
        <div className="mt-16 lg:mt-0 lg:w-[45%]">
          <div className="relative border-4 border-slate-900 bg-slate-900 p-2 shadow-[8px_8px_0px_0px_rgba(245,158,11,1)]">
            {/* Auto Scrolling Banner */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
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

              {/* Solid Angular Value Prop Box over Image */}
              <div className="absolute bottom-0 left-0 border-r-4 border-t-4 border-slate-900 bg-white p-5 lg:p-6">
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

