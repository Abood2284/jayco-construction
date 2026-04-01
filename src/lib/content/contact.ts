export type ContactIntentKey = "quote" | "service" | "support" | "careers";

export type ContactIntentField = {
	name: string;
	label: string;
	type: "text" | "email" | "tel" | "textarea" | "file";
	placeholder?: string;
	required?: boolean;
	autoComplete?: string;
	rows?: number;
	span?: "half" | "full";
	accept?: string;
	hint?: string;
};

export type ContactIntent = {
	key: ContactIntentKey;
	label: string;
	description: string;
	panelEyebrow: string;
	panelTitle: string;
	panelDescription: string;
	highlight?: string;
	ctaLabel: string;
	submitEndpoint: "/api/forms/contact" | "/api/forms/careers";
	sourcePath: string;
	successMessage: string;
	formSupportCopy: string;
	fields: ContactIntentField[];
};

export const contactPageContent = {
	pageEyebrow: "Contact Jayco",
	pageTitle: "Contact Jayco for Quotes, Support & Service",
	pageDescription:
		"Choose the right enquiry route below. The form adapts for new requirements, service requests, technical issues, and career enquiries so users can submit with better context and less friction.",
	intentHeading: "Why are you contacting Jayco?",
	intentDescription:
		"Start with the route that matches your requirement. Quote requests stay easiest to begin, while service, support, and careers each get their own relevant form so the page feels faster and clearer.",
	routeBenefits: [
		{
			title: "Right team",
			description: "Sales, service, support, or careers",
		},
		{
			title: "Clearer requests",
			description: "Share the details that matter first",
		},
		{
			title: "Faster contact",
			description: "Call, email, or map in one tap",
		},
	],
} as const;

export const contactIntents: ContactIntent[] = [
	{
		key: "quote",
		label: "Request Quote / New Enquiry",
		description: "New equipment, pricing, and product guidance.",
		panelEyebrow: "New business enquiry",
		panelTitle: "Tell us what you need",
		panelDescription:
			"Share the product, capacity, and site context so the team can understand your requirement from the first reply.",
		ctaLabel: "Request Quote",
		submitEndpoint: "/api/forms/contact",
		sourcePath: "/contact?intent=quote",
		successMessage: "Your quote enquiry has been sent. The team now has the requirement context you shared.",
		formSupportCopy:
			"Keep the enquiry practical. Product type, location, and requirement details help the team route your request faster without forcing a long form.",
		highlight: "Recommended",
		fields: [
			{ name: "name", label: "Name", type: "text", required: true, autoComplete: "name", placeholder: "Your name" },
			{
				name: "company",
				label: "Company",
				type: "text",
				autoComplete: "organization",
				placeholder: "Company or plant name",
			},
			{ name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+91 98765 43210" },
			{
				name: "email",
				label: "Email",
				type: "email",
				required: true,
				autoComplete: "email",
				placeholder: "you@company.com",
			},
			{
				name: "product",
				label: "Product / Requirement Type",
				type: "text",
				required: true,
				span: "full",
				placeholder: "Crane, hoist, lift, retrofit, or custom requirement",
			},
			{
				name: "location",
				label: "City / Location",
				type: "text",
				required: true,
				autoComplete: "address-level2",
				placeholder: "City, state, or plant location",
			},
			{
				name: "capacityDetails",
				label: "Capacity / Equipment Details",
				type: "text",
				span: "full",
				placeholder: "Optional load, span, size, or duty details",
			},
			{
				name: "message",
				label: "Requirement Description",
				type: "textarea",
				required: true,
				rows: 5,
				span: "full",
				placeholder: "Share the scope, use case, quantities, timelines, or commercial context.",
			},
		],
	},
	{
		key: "service",
		label: "Service / AMC",
		description: "Maintenance, breakdown support, and AMC requests.",
		panelEyebrow: "After-sales service",
		panelTitle: "Route your service request correctly",
		panelDescription:
			"Tell us what equipment is installed, what support is needed, and where the site is located.",
		ctaLabel: "Submit Service Request",
		submitEndpoint: "/api/forms/contact",
		sourcePath: "/contact?intent=service",
		successMessage: "Your service request has been sent. The team can now review the equipment and site details provided.",
		formSupportCopy:
			"Use this route for maintenance, AMC, inspection, or breakdown support. Installed equipment and site context help avoid back-and-forth later.",
		fields: [
			{ name: "name", label: "Name", type: "text", required: true, autoComplete: "name", placeholder: "Your name" },
			{
				name: "company",
				label: "Company",
				type: "text",
				autoComplete: "organization",
				placeholder: "Company or plant name",
			},
			{ name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+91 98765 43210" },
			{
				name: "email",
				label: "Email",
				type: "email",
				required: true,
				autoComplete: "email",
				placeholder: "you@company.com",
			},
			{
				name: "equipment",
				label: "Existing Equipment / Product",
				type: "text",
				required: true,
				span: "full",
				placeholder: "Installed equipment, model, or system type",
			},
			{
				name: "serviceRequirement",
				label: "Service Requirement",
				type: "text",
				required: true,
				span: "full",
				placeholder: "AMC, preventive service, repair, inspection, or breakdown visit",
			},
			{
				name: "location",
				label: "Site Location",
				type: "text",
				required: true,
				autoComplete: "address-level2",
				span: "full",
				placeholder: "Plant, city, and state",
			},
			{
				name: "message",
				label: "Message",
				type: "textarea",
				required: true,
				rows: 5,
				span: "full",
				placeholder: "Share the issue, urgency, service history, or site-access details.",
			},
		],
	},
	{
		key: "support",
		label: "Technical Support",
		description: "Troubleshooting, performance issues, and system concerns.",
		panelEyebrow: "Technical support",
		panelTitle: "Share the issue clearly",
		panelDescription:
			"Add the product or system concern, issue details, and site context so the team can review the problem efficiently.",
		ctaLabel: "Contact Support",
		submitEndpoint: "/api/forms/contact",
		sourcePath: "/contact?intent=support",
		successMessage: "Your support request has been sent. The team can now review the issue details you shared.",
		formSupportCopy:
			"Use the issue description to explain the problem clearly. Keep the message practical so the team can understand the concern before follow-up.",
		fields: [
			{ name: "name", label: "Name", type: "text", required: true, autoComplete: "name", placeholder: "Your name" },
			{
				name: "company",
				label: "Company",
				type: "text",
				autoComplete: "organization",
				placeholder: "Company or site name",
			},
			{ name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+91 98765 43210" },
			{
				name: "email",
				label: "Email",
				type: "email",
				required: true,
				autoComplete: "email",
				placeholder: "you@company.com",
			},
			{
				name: "product",
				label: "Product / System Concern",
				type: "text",
				required: true,
				span: "full",
				placeholder: "Equipment name, model, system, or control concern",
			},
			{
				name: "issueDescription",
				label: "Issue Description",
				type: "textarea",
				required: true,
				rows: 5,
				span: "full",
				placeholder: "Describe the issue, when it occurs, and any troubleshooting already attempted.",
			},
			{
				name: "location",
				label: "Site Location",
				type: "text",
				required: true,
				autoComplete: "address-level2",
				span: "full",
				placeholder: "Plant, city, and state",
			},
			{
				name: "message",
				label: "Additional Message",
				type: "textarea",
				rows: 4,
				span: "full",
				placeholder: "Add anything else the team should know before follow-up.",
			},
		],
	},
	{
		key: "careers",
		label: "Careers",
		description: "Job enquiries for fabrication, engineering, and field roles.",
		panelEyebrow: "Careers enquiry",
		panelTitle: "Send a career enquiry",
		panelDescription:
			"Share the role you are interested in and any relevant experience. Resume upload is optional.",
		ctaLabel: "Send Application Enquiry",
		submitEndpoint: "/api/forms/careers",
		sourcePath: "/contact?intent=careers",
		successMessage: "Your application enquiry has been sent. The team will review your details and resume if attached.",
		formSupportCopy:
			"Keep this short and relevant. Role interest, contact details, and a concise message are usually enough for an initial careers enquiry.",
		fields: [
			{ name: "name", label: "Name", type: "text", required: true, autoComplete: "name", placeholder: "Your name" },
			{
				name: "email",
				label: "Email",
				type: "email",
				required: true,
				autoComplete: "email",
				placeholder: "you@example.com",
			},
			{ name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+91 98765 43210" },
			{
				name: "role",
				label: "Role of Interest",
				type: "text",
				required: true,
				span: "full",
				placeholder: "Fabrication, welding, design, service, sales, or operations",
			},
			{
				name: "message",
				label: "Message",
				type: "textarea",
				required: true,
				rows: 5,
				span: "full",
				placeholder: "Tell us about your experience, current work, or the kind of role you are exploring.",
			},
			{
				name: "resume",
				label: "Resume",
				type: "file",
				span: "full",
				accept: ".pdf,.doc,.docx",
				hint: "Optional. PDF, DOC, or DOCX up to 5 MB.",
			},
		],
	},
];
