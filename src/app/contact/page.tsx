import { Mail, MapPin, Phone } from "lucide-react";
import { ContactFormPanel } from "@/components/contact/contact-form-panel";
import { ContactInfoBlock } from "@/components/contact/contact-info-block";
import { ContactMapBlock } from "@/components/contact/contact-map-block";
import { JsonLd } from "@/components/ui/json-ld";
import { getSiteSettings } from "@/lib/cms";
import { contactIntents, contactPageContent } from "@/lib/content/contact";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildLocalBusinessSchema } from "@/lib/seo/schema";

export async function generateMetadata() {
	return buildMetadata({
		title: "Contact Jayco for Quotes, Support & Service",
		description: "Call, email, or send an enquiry to Jayco Hoist & Cranes. Find phone numbers, email addresses, and directions.",
		path: "/contact",
	});
}

export default async function ContactPage() {
	const settings = await getSiteSettings();
	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
	const primaryPhone = settings.phones[0];
	const primaryEmail = settings.emails[0];
	const quoteIntent = contactIntents.find((entry) => entry.key === "quote") ?? contactIntents[0];

	return (
		<main className="min-h-screen bg-slate-50">
			<JsonLd data={buildLocalBusinessSchema(settings)} />

			<section className="relative overflow-hidden bg-slate-950 pb-16 pt-28 lg:pb-20 lg:pt-36">
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.12]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 42px,#fff 42px,#fff 43px),repeating-linear-gradient(90deg,transparent,transparent 42px,#fff 42px,#fff 43px)",
					}}
				/>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.16),transparent_32%)]" />

				<div className="relative mx-auto max-w-6xl px-4 lg:px-6">
					<div className="max-w-3xl">
						<p className="mb-4 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-red-400">
							<span className="block h-px w-8 bg-red-500" />
							{contactPageContent.pageEyebrow}
						</p>
						<h1 className="mb-5 text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
							{contactPageContent.pageTitle}
						</h1>
						<p className="max-w-[62ch] text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
							{contactPageContent.pageDescription}
						</p>

						<div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
							{primaryPhone ? (
								<a
									href={`tel:${primaryPhone.replace(/[^+\d]/g, "")}`}
									className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
								>
									<Phone className="h-4 w-4" aria-hidden />
									Call Jayco
								</a>
							) : null}

							{primaryEmail ? (
								<a
									href={`mailto:${primaryEmail}`}
									className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
								>
									<Mail className="h-4 w-4" aria-hidden />
									Email Jayco
								</a>
							) : null}

							<a
								href={mapsUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
							>
								<MapPin className="h-4 w-4" aria-hidden />
								Open Maps
							</a>
						</div>
					</div>
				</div>
			</section>

			<section className="py-10 lg:py-14">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] lg:items-start lg:gap-10">
						<div>
							<ContactFormPanel intent={quoteIntent} />
						</div>

						<div className="space-y-5 lg:sticky lg:top-28">
							<ContactInfoBlock settings={settings} />
							<ContactMapBlock settings={settings} mapsUrl={mapsUrl} />
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
