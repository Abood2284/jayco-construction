import { ExternalLink, Globe, Mail, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/cms/types";

interface ContactInfoBlockProps {
	settings: SiteSettings;
}

const toTelHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

const segmentCardClass =
	"rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm sm:rounded-[1.25rem] sm:p-5";

const linkRowClass =
	"flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-slate-950 sm:flex-row sm:items-center sm:justify-between";

export function ContactInfoBlock({ settings }: ContactInfoBlockProps) {
	return (
		<section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-7">
			<div className="flex flex-col gap-4 sm:gap-5">
				{settings.phones.length > 0 ? (
					<div className={segmentCardClass}>
						<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
							<Phone className="h-4 w-4 shrink-0 text-red-700" aria-hidden />
							Phone numbers
						</div>
						<div className="flex flex-col gap-2">
							{settings.phones.map((phone) => (
								<a key={phone} href={toTelHref(phone)} className={linkRowClass}>
									<span className="break-words">{phone}</span>
									<span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-right">
										Tap to call
									</span>
								</a>
							))}
						</div>
					</div>
				) : null}

				{settings.emails.length > 0 ? (
					<div className={segmentCardClass}>
						<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
							<Mail className="h-4 w-4 shrink-0 text-red-700" aria-hidden />
							Email addresses
						</div>
						<div className="flex flex-col gap-2">
							{settings.emails.map((email) => (
								<a key={email} href={`mailto:${email}`} className={linkRowClass}>
									<span className="break-all">{email}</span>
									<span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-right">
										Tap to email
									</span>
								</a>
							))}
						</div>
					</div>
				) : null}

				<div className={segmentCardClass}>
					<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Globe className="h-4 w-4 shrink-0 text-red-700" aria-hidden />
						Website
					</div>
					<a
						href={`https://${settings.website}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-slate-950 sm:flex-row sm:items-center sm:justify-between"
					>
						<span className="break-all">{settings.website}</span>
						<ExternalLink className="h-4 w-4 shrink-0 text-slate-400 sm:ml-4" aria-hidden />
					</a>
				</div>
			</div>
		</section>
	);
}
