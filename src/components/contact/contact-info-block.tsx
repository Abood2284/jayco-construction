import { ExternalLink, Globe, Mail, Phone } from "lucide-react";
import { ContactInfoActions } from "@/components/contact/contact-info-actions";
import type { SiteSettings } from "@/lib/cms/types";

interface ContactInfoBlockProps {
	settings: SiteSettings;
	mapsUrl: string;
}

const toTelHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

export function ContactInfoBlock({ settings, mapsUrl }: ContactInfoBlockProps) {
	return (
		<div className="space-y-5">
			<section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-7">
				<p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">Direct contact</p>
				<h2 className="mb-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Prefer to call or email?</h2>
				<p className="m-0 text-sm leading-relaxed text-slate-600">
					Use the fastest direct route for urgent requirements, existing equipment support, or when you already know who you need to reach.
				</p>

				<div className="mt-6">
					<ContactInfoActions phone={settings.phones[0]} email={settings.emails[0]} mapsUrl={mapsUrl} />
				</div>
			</section>

			<section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-7">
				<div className="space-y-5">
					{settings.phones.length > 0 ? (
						<div>
							<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
								<Phone className="h-4 w-4 text-amber-700" aria-hidden />
								Phone numbers
							</div>
							<div className="space-y-2">
								{settings.phones.map((phone) => (
									<a
										key={phone}
										href={toTelHref(phone)}
										className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-slate-950"
									>
										<span>{phone}</span>
										<span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tap to call</span>
									</a>
								))}
							</div>
						</div>
					) : null}

					{settings.emails.length > 0 ? (
						<div>
							<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
								<Mail className="h-4 w-4 text-amber-700" aria-hidden />
								Email addresses
							</div>
							<div className="space-y-2">
								{settings.emails.map((email) => (
									<a
										key={email}
										href={`mailto:${email}`}
										className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-slate-950"
									>
										<span className="break-all">{email}</span>
										<span className="pl-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tap to email</span>
									</a>
								))}
							</div>
						</div>
					) : null}

					<div>
						<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
							<Globe className="h-4 w-4 text-amber-700" aria-hidden />
							Website
						</div>
						<a
							href={`https://${settings.website}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-slate-950"
						>
							<span>{settings.website}</span>
							<ExternalLink className="h-4 w-4 text-slate-400" aria-hidden />
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
