"use client";

import { useMemo, useState } from "react";
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";

type EnquiryFormProps = {
	defaultProduct?: string;
	sourcePath: string;
	title?: string;
};

export function EnquiryForm({ defaultProduct, sourcePath, title = "Send Us a Message" }: EnquiryFormProps) {
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");
	const product = useMemo(() => defaultProduct ?? "", [defaultProduct]);

	return (
		<form
			className="bg-white rounded-2xl border-t-4 border-t-amber-500 p-8 lg:p-10 shadow-xl ring-1 ring-slate-200 relative overflow-hidden"
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
			<h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight uppercase">
				{title}
			</h2>

			<input type="hidden" name="sourcePath" value={sourcePath} />
			<input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" />

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label htmlFor="name" className="text-xs font-bold text-slate-600 uppercase tracking-widest">
							Full Name
						</label>
						<input 
							id="name"
							required 
							name="name" 
							type="text" 
							className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
							placeholder="John Doe"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase tracking-widest">
							Email Address
						</label>
						<input 
							id="email"
							required 
							name="email" 
							type="email" 
							className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
							placeholder="john@company.com"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-widest">
							Phone Number
						</label>
						<input 
							id="phone"
							required 
							name="phone" 
							type="tel" 
							className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
							placeholder="+1 (555) 000-0000"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="product" className="text-xs font-bold text-slate-600 uppercase tracking-widest">
							Related Product / Subject
						</label>
						<input 
							id="product"
							name="product" 
							type="text" 
							defaultValue={product} 
							className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
							placeholder="e.g. Structural Steel"
						/>
					</div>
				</div>

				<div className="space-y-2">
						<label htmlFor="message" className="text-xs font-bold text-slate-600 uppercase tracking-widest">
						Message Details
					</label>
					<textarea 
						id="message"
						required 
						name="message" 
						rows={5} 
						className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
						placeholder="Please share details about your project or enquiry..."
					/>
				</div>

				{status === "success" && (
					<div className="flex items-start gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
						<CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
						<p className="text-sm font-medium">{message}</p>
					</div>
				)}

				{status === "error" && (
					<div className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-lg border border-red-100">
						<AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
						<p className="text-sm font-medium">{message}</p>
					</div>
				)}

				<button 
					type="submit" 
					disabled={status === "loading" || status === "success"}
					className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
				>
					{status === "loading" ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							Sending Message...
						</>
					) : status === "success" ? (
						<>
							<CheckCircle className="w-5 h-5" />
							Sent Successfully
						</>
					) : (
						<>
							<Send className="w-5 h-5" />
							Send Message
						</>
					)}
				</button>
			</div>
		</form>
	);
}
