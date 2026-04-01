import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

interface ContactInfoActionsProps {
	phone?: string;
	email?: string;
	mapsUrl?: string;
}

const toTelHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

export function ContactInfoActions({ phone, email, mapsUrl }: ContactInfoActionsProps) {
	return (
		<div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
			{phone ? (
				<a
					href={toTelHref(phone)}
					className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50"
				>
					<span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
						<Phone className="h-4 w-4" aria-hidden />
					</span>
					<span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Call now</span>
					<span className="mt-2 block text-sm font-semibold text-slate-950">{phone}</span>
				</a>
			) : null}

			{email ? (
				<a
					href={`mailto:${email}`}
					className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50"
				>
					<span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
						<Mail className="h-4 w-4" aria-hidden />
					</span>
					<span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</span>
					<span className="mt-2 block break-all text-sm font-semibold text-slate-950">{email}</span>
				</a>
			) : null}

			{mapsUrl ? (
				<a
					href={mapsUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50"
				>
					<span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
						<MapPin className="h-4 w-4" aria-hidden />
					</span>
					<span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Open maps</span>
					<span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950">
						Get directions
						<ExternalLink className="h-4 w-4 text-slate-400" aria-hidden />
					</span>
				</a>
			) : null}
		</div>
	);
}
