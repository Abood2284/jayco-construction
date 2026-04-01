import { ExternalLink, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/cms/types";

interface ContactMapBlockProps {
	settings: SiteSettings;
	mapsUrl: string;
}

export function ContactMapBlock({ settings, mapsUrl }: ContactMapBlockProps) {
	return (
		<section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-7">
			<div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
				<MapPin className="h-4 w-4 text-amber-700" aria-hidden />
				Address
			</div>

			<div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
				<p className="mb-4 text-sm font-medium leading-relaxed text-slate-700">{settings.address}</p>
				<a
					href={mapsUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800"
				>
					Open in Google Maps
					<ExternalLink className="h-4 w-4" aria-hidden />
				</a>
			</div>
		</section>
	);
}
