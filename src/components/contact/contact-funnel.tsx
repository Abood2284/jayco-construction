"use client";

import { useState } from "react";
import { ContactFormPanel } from "@/components/contact/contact-form-panel";
import { ContactIntentSelector } from "@/components/contact/contact-intent-selector";
import { contactIntents, contactPageContent, type ContactIntentKey } from "@/lib/content/contact";

interface ContactFunnelProps {
	phone?: string;
	email?: string;
	mapsUrl?: string;
}

export function ContactFunnel({ phone, email, mapsUrl }: ContactFunnelProps) {
	const [activeIntent, setActiveIntent] = useState<ContactIntentKey>("quote");
	const intent = contactIntents.find((entry) => entry.key === activeIntent) ?? contactIntents[0];

	return (
		<div className="space-y-6">
			<section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-7">
				<p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
					{contactPageContent.intentHeading}
				</p>
				<h2 className="mb-3 text-[clamp(1.7rem,3vw,2.3rem)] font-semibold tracking-[-0.03em] text-slate-950">
					Choose the route that matches your requirement
				</h2>
				<p className="m-0 max-w-[65ch] text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
					{contactPageContent.intentDescription}
				</p>

				<div className="mt-6">
					<ContactIntentSelector intents={contactIntents} activeIntent={activeIntent} onChange={setActiveIntent} />
				</div>
			</section>

			<ContactFormPanel key={intent.key} intent={intent} phone={phone} email={email} mapsUrl={mapsUrl} />
		</div>
	);
}
