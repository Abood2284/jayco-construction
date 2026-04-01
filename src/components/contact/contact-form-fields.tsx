import { Paperclip } from "lucide-react";
import type { ContactIntentField } from "@/lib/content/contact";

interface ContactFormFieldsProps {
	intentKey: string;
	fields: ContactIntentField[];
}

export function ContactFormFields({ intentKey, fields }: ContactFormFieldsProps) {
	return (
		<div className="grid gap-5 md:grid-cols-2">
			{fields.map((field) => {
				const fieldId = `${intentKey}-${field.name}`;
				const wrapperClassName = field.span === "full" ? "md:col-span-2" : "";
				const controlClassName =
					field.type === "file"
						? "block w-full cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
						: "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20";

				return (
					<div key={field.name} className={wrapperClassName}>
						<label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-slate-800">
							{field.label}
							{field.required ? <span className="text-amber-700"> *</span> : null}
						</label>

						{field.type === "textarea" ? (
							<textarea
								id={fieldId}
								name={field.name}
								required={field.required}
								rows={field.rows ?? 5}
								autoComplete={field.autoComplete}
								placeholder={field.placeholder}
								className={`${controlClassName} min-h-[140px] resize-y`}
							/>
						) : field.type === "file" ? (
							<div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3">
								<div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
									<Paperclip className="h-4 w-4 text-amber-700" aria-hidden />
									Attach a file if it helps the team review your enquiry faster
								</div>
								<input
									id={fieldId}
									name={field.name}
									type="file"
									required={field.required}
									accept={field.accept}
									className={controlClassName}
								/>
								{field.hint ? <p className="mt-2 text-xs leading-relaxed text-slate-500">{field.hint}</p> : null}
							</div>
						) : (
							<input
								id={fieldId}
								name={field.name}
								type={field.type}
								required={field.required}
								autoComplete={field.autoComplete}
								placeholder={field.placeholder}
								className={controlClassName}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
