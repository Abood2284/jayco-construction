import { NextResponse } from "next/server";
import { appendSubmissionRecord } from "@/lib/forms/storage";
import { sendFormNotification } from "@/lib/forms/notifications";
import { checkRateLimit } from "@/lib/forms/rate-limit";

const getIp = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validIntents = new Set(["quote", "service", "support"]);

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
	const company = String(formData.get("company") ?? "").trim();
	const phone = String(formData.get("phone") ?? "").trim();
	const message = String(formData.get("message") ?? "").trim();
	const intent = String(formData.get("intent") ?? "").trim();
	const intentLabel = String(formData.get("intentLabel") ?? "").trim();
	const productNote = String(formData.get("product") ?? "").trim();
	const capacityDetails = String(formData.get("capacityDetails") ?? "").trim();
	const location = String(formData.get("location") ?? "").trim();
	const equipment = String(formData.get("equipment") ?? "").trim();
	const serviceRequirement = String(formData.get("serviceRequirement") ?? "").trim();
	const issueDescription = String(formData.get("issueDescription") ?? "").trim();
	const sourcePath = String(formData.get("sourcePath") ?? "/contact").trim();
	const normalizedIntent = validIntents.has(intent) ? intent : undefined;

	if (!name || !email || !phone || !isEmail(email)) {
		return NextResponse.json({ error: "Invalid form payload" }, { status: 400 });
	}

	if (normalizedIntent === "quote" && (!productNote || !location || !message)) {
		return NextResponse.json({ error: "Please complete the quote fields before submitting." }, { status: 400 });
	}

	if (normalizedIntent === "service" && (!equipment || !serviceRequirement || !location || !message)) {
		return NextResponse.json({ error: "Please complete the service request fields before submitting." }, { status: 400 });
	}

	if (normalizedIntent === "support" && (!productNote || !issueDescription || !location)) {
		return NextResponse.json({ error: "Please complete the support fields before submitting." }, { status: 400 });
	}

	if (!normalizedIntent && !message) {
		return NextResponse.json({ error: "Invalid form payload" }, { status: 400 });
	}

	const payload = {
		name,
		email,
		intent: normalizedIntent,
		intentLabel: intentLabel || undefined,
		company: company || undefined,
		phone,
		message: message || undefined,
		product: productNote || undefined,
		capacityDetails: capacityDetails || undefined,
		location: location || undefined,
		equipment: equipment || undefined,
		serviceRequirement: serviceRequirement || undefined,
		issueDescription: issueDescription || undefined,
		sourcePath,
		createdAt: new Date().toISOString(),
	};

	await appendSubmissionRecord("contact", payload);
	await sendFormNotification(intentLabel ? `New ${intentLabel}` : "New Contact Enquiry", payload);

	return NextResponse.json({ ok: true });
}
