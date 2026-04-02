"use client";

import { useState } from "react";
import { ContactFormFields } from "@/components/contact/contact-form-fields";
import { ContactSubmissionState } from "@/components/contact/contact-submission-state";
import { ContactSubmitButton } from "@/components/contact/contact-submit-button";
import type { ContactIntent } from "@/lib/content/contact";

type FormStatus = "idle" | "loading" | "success" | "error";

interface ContactFormPanelProps {
	intent: ContactIntent;
}

export function ContactFormPanel({ intent }: ContactFormPanelProps) {
	const [status, setStatus] = useState<FormStatus>("idle");
	const [message, setMessage] = useState("");

	return (
		<section
			id={`contact-intent-panel-${intent.key}`}
			aria-labelledby={`contact-form-title-${intent.key}`}
			className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-9"
		>
			<div className="border-b border-slate-100 pb-6 sm:pb-7">
				<p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-red-700">{intent.panelEyebrow}</p>
				<h2
					id={`contact-form-title-${intent.key}`}
					className="mb-3 text-[clamp(1.75rem,3vw,2.4rem)] font-semibold tracking-[-0.03em] text-slate-950"
				>
					{intent.panelTitle}
				</h2>
				<p className="m-0 max-w-[60ch] text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">{intent.panelDescription}</p>
			</div>

			<form
				key={intent.key}
				className="mt-6"
				onSubmit={async (event) => {
					event.preventDefault();
					setStatus("loading");
					setMessage("");

					const formData = new FormData(event.currentTarget);
					formData.set("sourcePath", intent.sourcePath);
					formData.set("intent", intent.key);
					formData.set("intentLabel", intent.label);

					try {
						const response = await fetch(intent.submitEndpoint, {
							method: "POST",
							body: formData,
						});
						const payload = (await response.json().catch(() => null)) as { error?: string } | null;

						if (response.ok) {
							setStatus("success");
							setMessage(intent.successMessage);
							event.currentTarget.reset();
							return;
						}

						setStatus("error");
						setMessage(payload?.error ?? "We could not submit your request right now. Please try again or use the direct contact options.");
					} catch {
						setStatus("error");
						setMessage("We could not submit your request right now. Please try again or use the direct contact options.");
					}
				}}
			>
				<input type="hidden" name="sourcePath" value={intent.sourcePath} />
				<input type="hidden" name="intent" value={intent.key} />
				<input type="hidden" name="intentLabel" value={intent.label} />
				<input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" className="sr-only" />

				<ContactFormFields intentKey={intent.key} fields={intent.fields} />

				<div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
					<p className="m-0 text-sm leading-relaxed text-slate-600">{intent.formSupportCopy}</p>
				</div>

				<div className="mt-5">
					<ContactSubmissionState status={status} message={message} />
				</div>

				<div className="mt-6">
					<ContactSubmitButton label={status === "success" ? "Sent successfully" : intent.ctaLabel} status={status} />
				</div>
			</form>
		</section>
	);
}
