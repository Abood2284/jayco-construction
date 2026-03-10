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
			className="bg-white border-2 border-slate-900 p-8 lg:p-10 shadow-[6px_6px_0_0_rgba(15,23,42,1)] relative overflow-hidden"
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
							className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-0"
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
							className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-0"
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
							className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-0"
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
							className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-0"
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
						className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-0 resize-y min-h-[120px]"
						placeholder="Please share details about your project or enquiry..."
					/>
				</div>

				{status === "success" && (
					<div className="flex items-start gap-3 p-4 bg-emerald-50 text-emerald-800 border-2 border-emerald-200">
						<CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
						<p className="text-sm font-medium">{message}</p>
					</div>
				)}

				{status === "error" && (
					<div className="flex items-start gap-3 p-4 bg-red-50 text-red-800 border-2 border-red-200">
						<AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
						<p className="text-sm font-medium">{message}</p>
					</div>
				)}

				<button 
					type="submit" 
					disabled={status === "loading" || status === "success"}
					className="mt-6 flex w-full items-center justify-center gap-2 bg-amber-500 px-8 py-5 text-[0.8rem] font-black uppercase tracking-[0.16em] text-slate-950 transition-all hover:bg-amber-400 hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-1 active:shadow-none"
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
