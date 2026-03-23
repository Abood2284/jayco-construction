import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { EnquiryForm } from "@/components/sections/enquiry-form";
import { JsonLd } from "@/components/ui/json-ld";
import { getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildLocalBusinessSchema } from "@/lib/seo/schema";
import { Mail, Phone, MapPin, Clock, Globe, ExternalLink } from "lucide-react";

export async function generateMetadata() {
	return buildMetadata({
		title: "Contact Us",
		description: "Contact Jayco Hoist & Cranes Mfg. Co. for project enquiries, support, and quote requests.",
		path: "/contact",
	});
}

function ContactRow({
	icon: Icon,
	label,
	children,
}: {
	icon: LucideIcon;
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
			<div className="mt-0.5 shrink-0 text-slate-400">
				<Icon className="h-5 w-5" aria-hidden />
			</div>
			<div className="min-w-0">
				<p className="text-sm font-medium text-slate-500">{label}</p>
				<div className="mt-1 text-slate-900">{children}</div>
			</div>
		</div>
	);
}

export default async function ContactPage() {
	const settings = await getSiteSettings();
	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

	return (
		<main className="min-h-screen bg-slate-50">
			<JsonLd data={buildLocalBusinessSchema(settings)} />

			<section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 lg:pt-36 lg:pb-20">
				<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/40 to-transparent" />
				<div className="relative mx-auto max-w-6xl px-4 lg:px-6">
					<div className="max-w-2xl">
						<p className="mb-3 text-sm font-medium text-amber-400/90">Get in touch</p>
						<h1 className="mb-4 text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-tight tracking-tight text-white">
							Contact us
						</h1>
						<p className="max-w-[54ch] text-base leading-relaxed text-slate-400 lg:text-lg">
							Whether you need a custom quote, technical support, or a general enquiry about our manufacturing capabilities, our
							team is ready to help.
						</p>
					</div>
				</div>
			</section>

			<section className="py-12 lg:py-16">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 lg:items-start">
						{/* Form first in DOM: primary on mobile, right column on lg */}
						<div className="lg:col-span-7 lg:col-start-6">
							<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
								<div className="mb-8 border-b border-slate-100 pb-8">
									<h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Project enquiry</h2>
									<p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
										Send us a message and we will respond as soon as we can.
									</p>
								</div>
								<EnquiryForm variant="quiet" hideTitle sourcePath="/contact" />
							</div>
						</div>

						{/* Contact details: left column on lg */}
						<div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
							<h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">Direct contact</h2>
							<p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600">
								Call, email, or visit during business hours.
							</p>

							<div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
								{settings.phones.length > 0 && (
									<ContactRow icon={Phone} label="Phone">
										<div className="space-y-1">
											{settings.phones.map((phone) => (
												<a
													key={phone}
													href={`tel:${phone.replace(/[^+\d]/g, "")}`}
													className="block text-base font-medium text-slate-900 underline-offset-4 hover:text-amber-700 hover:underline"
												>
													{phone}
												</a>
											))}
										</div>
									</ContactRow>
								)}

								{settings.emails.length > 0 && (
									<ContactRow icon={Mail} label="Email">
										<div className="space-y-1">
											{settings.emails.map((email) => (
												<a
													key={email}
													href={`mailto:${email}`}
													className="block break-all text-base font-medium text-slate-900 underline-offset-4 hover:text-amber-700 hover:underline"
												>
													{email}
												</a>
											))}
										</div>
									</ContactRow>
								)}

								<ContactRow icon={Globe} label="Website">
									<a
										href={`https://${settings.website}`}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 text-base font-medium text-slate-900 underline-offset-4 hover:text-amber-700 hover:underline"
									>
										{settings.website}
										<ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
									</a>
								</ContactRow>

								<ContactRow icon={MapPin} label="Address">
									<p className="text-base font-medium leading-snug text-slate-900">{settings.address}</p>
									<a
										href={mapsUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
									>
										Open in Google Maps
										<ExternalLink className="h-3.5 w-3.5" aria-hidden />
									</a>
								</ContactRow>

								<ContactRow icon={Clock} label="Hours">
									<p className="text-base font-medium text-slate-900">Mon – Fri, 8:00am – 5:00pm</p>
									<p className="mt-1 text-sm text-slate-600">Closed weekends and public holidays</p>
								</ContactRow>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
