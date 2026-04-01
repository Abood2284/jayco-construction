import { AlertCircle, CheckCircle } from "lucide-react";

interface ContactSubmissionStateProps {
	status: "idle" | "loading" | "success" | "error";
	message: string;
}

export function ContactSubmissionState({ status, message }: ContactSubmissionStateProps) {
	if ((status !== "success" && status !== "error") || !message) {
		return null;
	}

	const isSuccess = status === "success";

	return (
		<div
			className={[
				"flex items-start gap-3 rounded-2xl border px-4 py-4",
				isSuccess ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900",
			].join(" ")}
			aria-live="polite"
		>
			{isSuccess ? (
				<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
			) : (
				<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
			)}
			<p className="m-0 text-sm font-medium">{message}</p>
		</div>
	);
}
