"use client";

import { useMemo, useState } from "react";
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";

interface EnquiryFormProps {
	defaultProduct?: string;
	sourcePath: string;
	title?: string;
	variant?: "elevated" | "quiet";
	hideTitle?: boolean;
	/** Primary accent for focus rings and submit button */
	accent?: "amber" | "red";
}

export function EnquiryForm({
	defaultProduct,
	sourcePath,
	title = "Send us a message",
	variant = "elevated",
	hideTitle = false,
	accent = "amber",
}: EnquiryFormProps) {
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");
	const product = useMemo(() => defaultProduct ?? "", [defaultProduct]);

	const isQuiet = variant === "quiet";
	const isRed = accent === "red";
	const btnBg = isRed ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700";
	const btnRing = isRed
		? "focus-visible:ring-red-500"
		: "focus-visible:ring-amber-500";

	const fieldClassQuiet = isRed
		? "w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
		: "w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

	const fieldClassElevated = isRed
		? "w-full rounded-md border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-0"
		: "w-full rounded-md border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-0";

	const formClassName = isQuiet
		? "relative overflow-hidden"
		: "relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8";

	const labelClassName = isQuiet
		? "text-sm font-medium text-slate-700"
		: "text-sm font-medium text-slate-600";

	const fieldClassName = isQuiet ? fieldClassQuiet : fieldClassElevated;

	const titleClassName = isQuiet
		? "mb-8 text-2xl font-semibold tracking-tight text-slate-900"
		: "mb-6 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl";

	const successBoxClassName = isQuiet
		? "flex items-start gap-3 rounded-lg p-4 bg-emerald-50 text-emerald-800 border border-emerald-200"
		: "flex items-start gap-3 p-4 bg-emerald-50 text-emerald-800 border-2 border-emerald-200";

	const errorBoxClassName = isQuiet
		? "flex items-start gap-3 rounded-lg p-4 bg-red-50 text-red-800 border border-red-200"
		: "flex items-start gap-3 p-4 bg-red-50 text-red-800 border-2 border-red-200";

	const buttonClassName = [
		"mt-6 flex w-full items-center justify-center gap-2 rounded-md px-8 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
		isQuiet ? "py-3.5" : "py-4 shadow-sm",
		btnBg,
		btnRing,
	].join(" ");

	return (
		<form
			className={formClassName}
			onSubmit={async (event) => {
				event.preventDefault();
				setStatus("loading");
				setMessage("");
				const formData = new FormData(event.currentTarget);
				const response = await fetch("/api/forms/contact", {
					method: "POST",
					body: formData,
				});
				if (response.ok) {
					setStatus("success");
					setMessage("We've received your message and will be in touch shortly.");
					event.currentTarget.reset();
					return;
				}
				setStatus("error");
				setMessage("Something went wrong. Please try again or call us directly.");
			}}
		>
			{!hideTitle && <h2 className={titleClassName}>{title}</h2>}

			<input type="hidden" name="sourcePath" value={sourcePath} />
			<input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" />

			<div className="space-y-5">
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div className="space-y-2">
						<label htmlFor="name" className={labelClassName}>
							Full name
						</label>
						<input
							id="name"
							required
							name="name"
							type="text"
							className={fieldClassName}
							placeholder="Your name"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="email" className={labelClassName}>
							Email address
						</label>
						<input
							id="email"
							required
							name="email"
							type="email"
							className={fieldClassName}
							placeholder="you@company.com"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div className="space-y-2">
						<label htmlFor="company" className={labelClassName}>
							Company / organization
						</label>
						<input
							id="company"
							name="company"
							type="text"
							className={fieldClassName}
							placeholder="Company name"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="phone" className={labelClassName}>
							Phone number
						</label>
						<input
							id="phone"
							required
							name="phone"
							type="tel"
							className={fieldClassName}
							placeholder="+91 98765 43210"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label htmlFor="product" className={labelClassName}>
						Related product or enquiry subject
					</label>
					<input
						id="product"
						name="product"
						type="text"
						defaultValue={product}
						className={fieldClassName}
						placeholder="e.g. Electric wire rope hoist"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="message" className={labelClassName}>
						Message
					</label>
					<textarea
						id="message"
						required
						name="message"
						rows={5}
						className={`${fieldClassName} min-h-[120px] resize-y`}
						placeholder="Please share details about your project or enquiry..."
					/>
				</div>

				{status === "success" && (
					<div className={successBoxClassName}>
						<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
						<p className="text-sm font-medium">{message}</p>
					</div>
				)}

				{status === "error" && (
					<div className={errorBoxClassName}>
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
						<p className="text-sm font-medium">{message}</p>
					</div>
				)}

				<button type="submit" disabled={status === "loading" || status === "success"} className={buttonClassName}>
					{status === "loading" ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
							Sending…
						</>
					) : status === "success" ? (
						<>
							<CheckCircle className="h-5 w-5" />
							Sent successfully
						</>
					) : (
						<>
							<Send className="h-5 w-5" />
							Send message
						</>
					)}
				</button>
			</div>
		</form>
	);
}
