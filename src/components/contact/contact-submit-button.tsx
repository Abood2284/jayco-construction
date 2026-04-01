import { CheckCircle, Loader2, Send } from "lucide-react";

interface ContactSubmitButtonProps {
	label: string;
	status: "idle" | "loading" | "success" | "error";
}

export function ContactSubmitButton({ label, status }: ContactSubmitButtonProps) {
	return (
		<button
			type="submit"
			disabled={status === "loading"}
			className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(180,83,9,0.24)] transition-colors hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
		>
			{status === "loading" ? (
				<>
					<Loader2 className="h-5 w-5 animate-spin" aria-hidden />
					Sending...
				</>
			) : status === "success" ? (
				<>
					<CheckCircle className="h-5 w-5" aria-hidden />
					{label}
				</>
			) : (
				<>
					<Send className="h-5 w-5" aria-hidden />
					{label}
				</>
			)}
		</button>
	);
}
