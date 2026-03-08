import { NextResponse } from "next/server";
import { appendSubmissionRecord } from "@/lib/forms/storage";
import { sendFormNotification } from "@/lib/forms/notifications";
import { checkRateLimit } from "@/lib/forms/rate-limit";

const getIp = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
	const formData = await request.formData();
	const honeypot = String(formData.get("companyWebsite") ?? "").trim();
	if (honeypot) {
		return NextResponse.json({ ok: true });
	}

	const ip = getIp(request);
	if (!checkRateLimit(`contact:${ip}`, 6, 10 * 60_000)) {
		return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
	}

	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const phone = String(formData.get("phone") ?? "").trim();
	const message = String(formData.get("message") ?? "").trim();
	const productSlug = String(formData.get("product") ?? "").trim();
	const sourcePath = String(formData.get("sourcePath") ?? "/contact").trim();

	if (!name || !email || !phone || !message || !isEmail(email)) {
		return NextResponse.json({ error: "Invalid form payload" }, { status: 400 });
	}

	const payload = {
		name,
		email,
		phone,
		message,
		productSlug: productSlug || undefined,
		sourcePath,
		createdAt: new Date().toISOString(),
	};

	await appendSubmissionRecord("contact", payload);
	await sendFormNotification("New Contact Enquiry", payload);

	return NextResponse.json({ ok: true });
}
