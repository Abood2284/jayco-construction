"use client";

import { useState } from "react";

type CareerFormProps = {
	sourcePath: string;
};

export function CareerForm({ sourcePath }: CareerFormProps) {
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	return (
		<form
			className="flex flex-col gap-5"
			onSubmit={async (event) => {
				event.preventDefault();
				setStatus("loading");
				setMessage("");
				const formData = new FormData(event.currentTarget);
				const response = await fetch("/api/forms/careers", {
					method: "POST",
					body: formData,
				});
				if (response.ok) {
					setStatus("success");
					setMessage("Application submitted successfully. We will be in touch shortly.");
					event.currentTarget.reset();
					return;
				}
				setStatus("error");
				setMessage("Unable to submit right now. Please try again or email us directly.");
			}}
		>
			<input type="hidden" name="sourcePath" value={sourcePath} />
			<input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" className="sr-only" />
			
			<div className="space-y-1">
				<label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
				<input 
					id="name"
					required 
					name="name" 
					type="text" 
					placeholder="John Doe"
					className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10"
				/>
			</div>
			
			<div className="grid gap-5 sm:grid-cols-2">
				<div className="space-y-1">
					<label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
					<input 
						id="email"
						required 
						name="email" 
						type="email" 
						placeholder="john@example.com"
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10"
					/>
				</div>
				<div className="space-y-1">
					<label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone</label>
					<input 
						id="phone"
						required 
						name="phone" 
						type="tel" 
						placeholder="(555) 123-4567"
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10"
					/>
				</div>
			</div>
			
			<div className="space-y-1">
				<label htmlFor="message" className="text-sm font-semibold text-slate-700">Cover Letter / Message</label>
				<textarea 
					id="message"
					required 
					name="message" 
					rows={4} 
					placeholder="Tell us about your experience..."
					className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10"
				/>
			</div>
			
			<div className="space-y-1">
				<label htmlFor="resume" className="text-sm font-semibold text-slate-700">Resume Setup (PDF, DOCX)</label>
				<div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10">
					<input 
						id="resume"
						name="resume" 
						type="file" 
						accept=".pdf,.doc,.docx" 
						className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
					<div className="pointer-events-none flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-slate-500">
						<svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
						Click to attach file
					</div>
				</div>
			</div>

			<button 
				type="submit" 
				disabled={status === "loading"}
				className="mt-2 flex w-full items-center justify-center rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-slate-950 transition-all hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-70"
			>
				{status === "loading" ? (
					<span className="flex items-center gap-2">
						<svg className="h-4 w-4 animate-spin text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Submitting...
					</span>
				) : (
					"Submit Application"
				)}
			</button>

			{message && (
				<div 
					className={`mt-2 rounded-2xl p-4 text-sm font-medium ${
						status === "success" 
							? "bg-green-50 text-green-700" 
							: "bg-red-50 text-red-700"
					}`}
				>
					{message}
				</div>
			)}
		</form>
	);
}
