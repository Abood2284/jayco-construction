import type { Metadata } from "next";
import Image from "next/image";
import { getClients, getSiteSettings } from "@/lib/cms";
import { EnquiryForm } from "@/components/sections/enquiry-form";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Clients",
    description:
      "Discover the industry leaders who trust our engineered heavy-industrial systems.",
    path: "/clients",
  });
}

export default async function ClientsPage() {
  const clients = await getClients();
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b-4 border-slate-900 bg-slate-50 px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40">
        {/* Industrial Background Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,#0f172a 40px,#0f172a 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#0f172a 40px,#0f172a 41px)",
          }}
        />
        {/* Accent Blur */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] bg-amber-500 opacity-10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-amber-600">
            <span className="block h-px w-6 bg-amber-500" />
            Trusted Partners
            <span className="block h-px w-6 bg-amber-500" />
          </p>
          <h1 className="mb-6 text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.1] tracking-tighter text-slate-900">
            Built For <span className="text-slate-400">Industry.</span>
            <br />
            Trusted By <span className="text-amber-600">Leaders.</span>
          </h1>
          <p className="mx-auto max-w-[54ch] text-sm font-medium text-slate-600 lg:text-base">
            We are proud to partner with top organizations across oil & gas,
            infrastructure, power, and manufacturing to deliver heavy-industrial
            systems that hold up under real load.
          </p>
        </div>

        {/* Heavy Hazard Stripe Border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)]" />
      </section>

      {/* Clients Grid Section */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          {/* Stats header */}
          <div className="mb-16 grid grid-cols-3 gap-2 border-b-2 border-slate-900 pb-12 divide-x-2 divide-slate-200 sm:gap-6">
            <div className="text-center px-2 sm:px-4">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">
                {clients.length}+
              </p>
              <p className="mt-1 text-[0.55rem] sm:text-xs font-black uppercase tracking-wider sm:tracking-[0.2em] text-slate-500">
                Active Partners
              </p>
            </div>
            <div className="text-center px-2 sm:px-4">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">
                {settings.yearsInBusiness}
              </p>
              <p className="mt-1 text-[0.55rem] sm:text-xs font-black uppercase tracking-wider sm:tracking-[0.2em] text-slate-500">
                Years of Trust
              </p>
            </div>
            <div className="text-center px-2 sm:px-4">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">
                {settings.industriesServed.length}
              </p>
              <p className="mt-1 text-[0.55rem] sm:text-xs font-black uppercase tracking-wider sm:tracking-[0.2em] text-slate-500">
                Core Industries
              </p>
            </div>
          </div>

          {/* The Grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {clients.map((client, idx) => (
              <div
                key={`${client.name}-${idx}`}
                className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden border-2 border-slate-900 bg-white p-6 shadow-[2px_2px_0_0_rgba(15,23,42,1)] transition-all hover:-translate-y-1 hover:border-amber-500 hover:shadow-[4px_4px_0_0_rgba(245,158,11,1)]"
              >
                {/* Image Container */}
                <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={client.logo.src}
                    alt={client.logo.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-slate-900 pb-20 pt-20 border-t-4 border-amber-600">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
              Ready to build?
            </h2>
            <p className="mx-auto max-w-[46ch] font-medium text-slate-400">
              Contact our engineering team to discuss your next high-capacity
              project requirements.
            </p>
          </div>
          <EnquiryForm sourcePath="/clients" />
        </div>
      </section>
    </main>
  );
}
