import type { Metadata } from "next";
import Image from "next/image";
import { getClients, getSiteSettings } from "@/lib/cms";
import { EnquiryForm } from "@/components/sections/enquiry-form";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Clients",
    description:
      "Meet the organizations that run Jayco hoists, cranes, and material-handling equipment where performance and support matter.",
    path: "/clients",
  });
}

export default async function ClientsPage() {
  const clients = await getClients();
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b-4 border-slate-900 bg-slate-50 px-4 pb-12 pt-8 lg:px-6 lg:pb-16 lg:pt-12">
        {/* Industrial Background Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,#0f172a 40px,#0f172a 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#0f172a 40px,#0f172a 41px)",
          }}
        />
        {/* Accent Blur */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] bg-red-600 opacity-[0.12] blur-[100px]" />

        <div className="relative mx-auto max-w-6xl text-left">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-red-700">
            <span className="block h-px w-8 shrink-0 bg-red-600" aria-hidden />
            Who works with Jayco
          </p>
          <h1 className="mb-4 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.12] tracking-tight text-slate-900">
            Built by Jayco for{" "}
            <span className="text-slate-500">plants that move real loads.</span>
          </h1>
          <p className="max-w-[54ch] text-sm leading-relaxed text-slate-600 lg:text-base">
            These are the teams and brands we are honoured to equip—across oil &
            gas, infrastructure, power, and manufacturing. When you choose Jayco
            hoists, cranes, lifts, and handling systems, you get application-fit
            engineering and support that stays with you after commissioning, not
            just a catalogue line item.
          </p>
        </div>

        {/* Heavy Hazard Stripe Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-700/80" aria-hidden />
      </section>

      {/* Clients Grid Section */}
      <section className="bg-slate-50 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          {/* Stats header */}
          <div className="mb-8 grid grid-cols-3 gap-2 divide-x divide-slate-200 border-b border-slate-300 pb-8 sm:gap-4">
            <div className="px-2 text-center sm:px-4">
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {clients.length}+
              </p>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Active partners
              </p>
            </div>
            <div className="px-2 text-center sm:px-4">
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {settings.yearsInBusiness}
              </p>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Years of trust
              </p>
            </div>
            <div className="px-2 text-center sm:px-4">
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {settings.industriesServed.length}
              </p>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Core industries
              </p>
            </div>
          </div>

          {/* The Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {clients.map((client, idx) => (
              <div
                key={`${client.name}-${idx}`}
                className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5"
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
      <section className="border-t-4 border-red-600 bg-slate-900 py-12 lg:py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              Ready to build?
            </h2>
            <p className="mx-auto max-w-[46ch] text-sm leading-relaxed text-slate-400 lg:text-base">
              Contact our engineering team to discuss your next high-capacity
              project requirements.
            </p>
          </div>
          <EnquiryForm sourcePath="/clients" accent="red" />
        </div>
      </section>
    </main>
  );
}
