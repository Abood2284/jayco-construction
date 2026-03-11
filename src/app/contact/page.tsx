import { EnquiryForm } from "@/components/sections/enquiry-form";
import { JsonLd } from "@/components/ui/json-ld";
import { getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildLocalBusinessSchema } from "@/lib/seo/schema";
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react";

export async function generateMetadata() {
	return buildMetadata({
		title: "Contact Us",
		description: "Contact Jayco Hoist & Cranes Mfg. Co. for project enquiries, support, and quote requests.",
		path: "/contact",
	});
}

export default async function ContactPage() {
	const settings = await getSiteSettings();

	return (
		<main className="bg-slate-50 min-h-screen">
			<JsonLd data={buildLocalBusinessSchema(settings)} />

			{/* Hero Section */}
			<section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-950">
				{/* Grid Texture */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.05]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
					}}
				/>
				<div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] bg-amber-500 opacity-10 blur-[120px]" />

				<div className="relative mx-auto max-w-6xl px-4 lg:px-6">
					<div className="max-w-3xl">
						<p className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-amber-500">
							<span className="block h-[2px] w-6 bg-amber-500" />
							Get In Touch
						</p>
						<h1 className="mb-6 text-[clamp(3rem,7vw,6rem)] font-black leading-[1.0] tracking-tighter text-white uppercase">
							Contact <span className="text-amber-500">Us.</span>
						</h1>
						<p className="max-w-[54ch] text-base font-medium text-slate-400 lg:text-lg lg:leading-relaxed">
							Whether you need a custom quote, technical support, or have a general enquiry about our manufacturing capabilities, our engineering team is ready to assist.
						</p>
					</div>
				</div>

				{/* Heavy Hazard Stripe */}
				<div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_10px,#0f172a_10px,#0f172a_20px)]" />
			</section>

			{/* Main Content Area */}
			<section className="py-16 lg:py-24">
				<div className="mx-auto max-w-6xl px-4 lg:px-6">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

						{/* Left Pane - Contact Details */}
						<div className="lg:col-span-5 space-y-8">
							<div>
								<h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-900 pb-4 mb-8">
									Direct Contact
								</h2>

								{/* Contact info as a stacked steel plate */}
								<div className="flex flex-col divide-y-2 divide-slate-900 border-2 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
									{/* Phones */}
									{settings.phones.length > 0 && (
										<div className="flex items-start gap-5 p-5 bg-white">
											<div className="w-11 h-11 border-2 border-slate-900 bg-amber-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
												<Phone className="w-5 h-5 text-slate-950" />
											</div>
											<div>
												<p className="text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.18em] mb-2">Call Us</p>
												{settings.phones.map((phone) => (
													<a
														key={phone}
														href={`tel:${phone.replace(/[^+\d]/g, "")}`}
														className="block text-lg font-black text-slate-900 hover:text-amber-600 transition-colors tracking-tight"
													>
														{phone}
													</a>
												))}
											</div>
										</div>
									)}

								{/* Emails */}
								{settings.emails.length > 0 && (
									<div className="flex items-start gap-5 p-5 bg-slate-50">
										<div className="w-11 h-11 border-2 border-slate-900 bg-amber-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
											<Mail className="w-5 h-5 text-slate-950" />
										</div>
										<div>
											<p className="text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.18em] mb-2">Email Us</p>
											{settings.emails.map((email) => (
												<a
													key={email}
													href={`mailto:${email}`}
													className="block text-base font-black text-slate-900 hover:text-amber-600 transition-colors tracking-tight break-all"
												>
													{email}
												</a>
											))}
										</div>
									</div>
								)}

								{/* Website */}
								<div className="flex items-start gap-5 p-5 bg-white">
									<div className="w-11 h-11 border-2 border-slate-900 bg-amber-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
										<Globe className="w-5 h-5 text-slate-950" />
									</div>
									<div>
										<p className="text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.18em] mb-2">Website</p>
										<a
											href={`https://${settings.website}`}
											target="_blank"
											rel="noopener noreferrer"
											className="block text-base font-black text-slate-900 hover:text-amber-600 transition-colors tracking-tight"
										>
											{settings.website}
										</a>
									</div>
								</div>

								{/* Address */}
									<div className="flex items-start gap-5 p-5 bg-white">
										<div className="w-11 h-11 border-2 border-slate-900 bg-amber-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
											<MapPin className="w-5 h-5 text-slate-950" />
										</div>
										<div>
											<p className="text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.18em] mb-2">Headquarters</p>
											<p className="text-base font-black text-slate-900 leading-snug tracking-tight max-w-[240px]">
												{settings.address}
											</p>
										</div>
									</div>

									{/* Hours */}
									<div className="flex items-start gap-5 p-5 bg-slate-50">
										<div className="w-11 h-11 border-2 border-slate-900 bg-amber-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
											<Clock className="w-5 h-5 text-slate-950" />
										</div>
										<div>
											<p className="text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.18em] mb-2">Operating Hours</p>
											<p className="text-base font-black text-slate-900 tracking-tight">Mon – Fri, 8:00am – 5:00pm</p>
											<p className="text-sm font-medium text-slate-500 mt-1">Closed Weekends &amp; Public Holidays</p>
										</div>
									</div>
								</div>
							</div>

							{/* Industrial Map Placeholder */}
							<div className="relative h-[260px] w-full border-2 border-slate-900 bg-slate-200 overflow-hidden shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
								{/* Grid texture overlay */}
								<div
									className="absolute inset-0 opacity-[0.15]"
									style={{
										backgroundImage:
											"repeating-linear-gradient(0deg,transparent,transparent 20px,#0f172a 20px,#0f172a 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,#0f172a 20px,#0f172a 21px)",
									}}
								/>
								<div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
									<div className="w-12 h-12 border-2 border-slate-900 bg-amber-500 flex items-center justify-center shadow-[3px_3px_0_0_rgba(15,23,42,1)]">
										<MapPin className="w-6 h-6 text-slate-950" />
									</div>
									<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Jayco HQ</p>
									<p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest text-center px-4">{settings.address}</p>
								</div>
							</div>
						</div>

						{/* Right Pane - Form */}
						<div className="lg:col-span-7">
							<div className="-mt-24 lg:-mt-40 relative z-20">
								<div className="border-2 border-slate-900 bg-white shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
									{/* Form Header */}
									<div className="border-b-2 border-slate-900 bg-slate-900 px-8 py-5">
										<p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-amber-500 mb-1">Project Enquiry</p>
										<h2 className="text-xl font-black uppercase tracking-tight text-white">Start Your Enquiry</h2>
									</div>
									<div className="p-6 sm:p-8">
										<EnquiryForm sourcePath="/contact" title="Start Your Enquiry" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
