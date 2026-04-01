"use client";

import { ArrowRight } from "lucide-react";
import type { ContactIntent, ContactIntentKey } from "@/lib/content/contact";

interface ContactIntentSelectorProps {
	intents: ContactIntent[];
	activeIntent: ContactIntentKey;
	onChange: (intent: ContactIntentKey) => void;
}

export function ContactIntentSelector({ intents, activeIntent, onChange }: ContactIntentSelectorProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4" aria-label="Contact intent options">
			{intents.map((intent) => {
				const isActive = intent.key === activeIntent;

				return (
					<button
						key={intent.key}
						id={`contact-intent-tab-${intent.key}`}
						type="button"
						aria-controls={`contact-intent-panel-${intent.key}`}
						aria-pressed={isActive}
						onClick={() => onChange(intent.key)}
						className={[
							"relative flex min-h-[148px] flex-col items-start rounded-3xl border px-5 py-5 text-left transition-all duration-200",
							"focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
							isActive
								? "border-amber-500 bg-slate-950 text-white shadow-[0_24px_48px_rgba(15,23,42,0.18)]"
								: "border-slate-200 bg-white text-slate-950 shadow-[0_16px_36px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.10)]",
						].join(" ")}
					>
						<div className="mb-4 flex w-full items-start justify-end gap-3">
							<span
								className={[
									"inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-transform duration-200",
									isActive
										? "border-white/10 bg-white/10 text-white"
										: "border-slate-200 bg-slate-50 text-slate-500",
								].join(" ")}
							>
								<ArrowRight className="h-4 w-4" aria-hidden />
							</span>
						</div>
						<span className="text-balance text-lg font-semibold tracking-tight">{intent.label}</span>
						<span className={["mt-2 text-sm leading-6", isActive ? "text-slate-300" : "text-slate-600"].join(" ")}>
							{intent.description}
						</span>
					</button>
				);
			})}
		</div>
	);
}
