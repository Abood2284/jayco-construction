import { NextResponse } from "next/server";
import { sendFormNotification } from "@/lib/forms/notifications";
import { checkRateLimit } from "@/lib/forms/rate-limit";
import { appendSubmissionRecord, persistResumeFile } from "@/lib/forms/storage";

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const getIp = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const hasAllowedExtension = (fileName: string) => ALLOWED_EXTENSIONS.some((ext) => fileName.toLowerCase().endsWith(ext));

export async function POST(request: Request) {
	const formData = await request.formData();
	const honeypot = String(formData.get("companyWebsite") ?? "").trim();
	if (honeypot) {
		return NextResponse.json({ ok: true });
	}

	const ip = getIp(request);
	if (!checkRateLimit(`career:${ip}`, 4, 15 * 60_000)) {
		return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
	}

	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const phone = String(formData.get("phone") ?? "").trim();
	const message = String(formData.get("message") ?? "").trim();
	const sourcePath = String(formData.get("sourcePath") ?? "/careers").trim();
	const resume = formData.get("resume");

	if (!name || !email || !phone || !message || !isEmail(email)) {
		return NextResponse.json({ error: "Invalid form payload" }, { status: 400 });
	}

	let resumePath: string | undefined;
	if (resume instanceof File && resume.name) {
		if (!hasAllowedExtension(resume.name)) {
			return NextResponse.json({ error: "Unsupported resume format" }, { status: 400 });
		}

		if (resume.size > MAX_RESUME_SIZE_BYTES) {
			return NextResponse.json({ error: "Resume file too large" }, { status: 400 });
		}

		resumePath = await persistResumeFile(resume.name, await resume.arrayBuffer());
	}

	const payload = {
		name,
		email,
		phone,
		message,
		sourcePath,
		resumePath,
		createdAt: new Date().toISOString(),
	};

	await appendSubmissionRecord("careers", payload);
	await sendFormNotification("New Career Application", payload);

	return NextResponse.json({ ok: true });
}
