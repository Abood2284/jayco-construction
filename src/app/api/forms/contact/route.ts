import { NextResponse } from "next/server";
import { z } from "zod";
import { getContactSubmissionsCollection } from "@/lib/admin/mongo";
import { appendSubmissionRecord } from "@/lib/forms/storage";
import { sendFormNotification } from "@/lib/forms/notifications";
import { checkRateLimit } from "@/lib/forms/rate-limit";

const getIp = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

const validIntents = new Set(["quote", "service", "support"]);

const contactFormSchema = z.object({
	name: z.string().trim().min(1),
	email: z.string().trim().email(),
	company: z.string().trim().optional(),
	phone: z.string().trim().min(1),
	message: z.string().trim().optional(),
	intent: z.string().trim().optional(),
	intentLabel: z.string().trim().optional(),
	product: z.string().trim().optional(),
	capacityDetails: z.string().trim().optional(),
	location: z.string().trim().optional(),
	equipment: z.string().trim().optional(),
	serviceRequirement: z.string().trim().optional(),
	issueDescription: z.string().trim().optional(),
	sourcePath: z.string().trim().optional(),
});

function optionalValue(value: string | undefined) {
	return value?.trim() || undefined;
}

function formString(formData: FormData, key: string) {
	const value = formData.get(key);
	return typeof value === "string" ? value : undefined;
}

export async function POST(request: Request) {
	const formData = await request.formData();
	const honeypot = String(formData.get("companyWebsite") ?? "").trim();
	if (honeypot) {
		return NextResponse.json({ ok: true });
	}

	const ip = getIp(request);
	if (!checkRateLimit(`contact:${ip}`, 6, 10 * 60_000)) {
		return NextResponse.json({ ok: false, error: "Too many attempts" }, { status: 429 });
	}

	const parsed = contactFormSchema.safeParse({
		name: formString(formData, "name"),
		email: formString(formData, "email"),
		company: formString(formData, "company"),
		phone: formString(formData, "phone"),
		message: formString(formData, "message"),
		intent: formString(formData, "intent"),
		intentLabel: formString(formData, "intentLabel"),
		product: formString(formData, "product"),
		capacityDetails: formString(formData, "capacityDetails"),
		location: formString(formData, "location"),
		equipment: formString(formData, "equipment"),
		serviceRequirement: formString(formData, "serviceRequirement"),
		issueDescription: formString(formData, "issueDescription"),
		sourcePath: formString(formData, "sourcePath"),
	});

	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
	}

	const {
		name,
		email,
		phone,
		company,
		message,
		intent,
		intentLabel,
		product: productNote,
		capacityDetails,
		location,
		equipment,
		serviceRequirement,
		issueDescription,
	} = parsed.data;
	const sourcePath = optionalValue(parsed.data.sourcePath) ?? "/contact";
	const normalizedIntent = intent && validIntents.has(intent) ? intent : undefined;

	if (normalizedIntent === "quote" && (!productNote || !location || !message)) {
		return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
	}

	if (normalizedIntent === "service" && (!equipment || !serviceRequirement || !location || !message)) {
		return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
	}

	if (normalizedIntent === "support" && (!productNote || !issueDescription || !location)) {
		return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
	}

	if (!normalizedIntent && !message) {
		return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
	}

	const payload = {
		name,
		email,
		intent: normalizedIntent,
		intentLabel: optionalValue(intentLabel),
		company: optionalValue(company),
		phone,
		message: optionalValue(message),
		product: optionalValue(productNote),
		capacityDetails: optionalValue(capacityDetails),
		location: optionalValue(location),
		equipment: optionalValue(equipment),
		serviceRequirement: optionalValue(serviceRequirement),
		issueDescription: optionalValue(issueDescription),
		sourcePath,
		createdAt: new Date().toISOString(),
	};

	try {
		const submissions = await getContactSubmissionsCollection();
		const now = new Date();
		await submissions.insertOne({
			name,
			email,
			phone,
			...(optionalValue(company) ? { company: optionalValue(company) } : {}),
			...(normalizedIntent ? { intent: normalizedIntent } : {}),
			...(optionalValue(intentLabel) ? { intentLabel: optionalValue(intentLabel) } : {}),
			...(optionalValue(productNote) ? { product: optionalValue(productNote) } : {}),
			...(optionalValue(capacityDetails) ? { capacityDetails: optionalValue(capacityDetails) } : {}),
			...(optionalValue(location) ? { location: optionalValue(location) } : {}),
			...(optionalValue(equipment) ? { equipment: optionalValue(equipment) } : {}),
			...(optionalValue(serviceRequirement) ? { serviceRequirement: optionalValue(serviceRequirement) } : {}),
			...(optionalValue(issueDescription) ? { issueDescription: optionalValue(issueDescription) } : {}),
			...(optionalValue(message) ? { message: optionalValue(message) } : {}),
			sourcePath,
			...(request.headers.get("user-agent") ? { userAgent: request.headers.get("user-agent") ?? undefined } : {}),
			...(ip !== "unknown" ? { ipAddress: ip } : {}),
			status: "NEW",
			metadata: {
				form: "contact",
			},
			createdAt: now,
			updatedAt: now,
		});
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("Contact submission persistence failed.", error);
		}
		return NextResponse.json({ ok: false, error: "Unable to save form submission." }, { status: 500 });
	}

	try {
		await appendSubmissionRecord("contact", payload);
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("Contact submission file append failed.", error);
		}
	}
	await sendFormNotification(optionalValue(intentLabel) ? `New ${intentLabel}` : "New Contact Enquiry", payload);

	return NextResponse.json({ ok: true });
}
