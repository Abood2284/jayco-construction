import type { CareersPage, Client, GalleryCategory, Product, ProductCategory, SiteSettings } from "@/lib/cms/types";

const image = (src: string, alt: string): { src: string; alt: string; width: number; height: number } => ({
	src,
	alt,
	width: 1600,
	height: 900,
});

export const siteSettings: SiteSettings = {
	companyName: "Jayco Industrial Manufacturing",
	address: "2145 Industry Park Drive, Houston, TX 77032",
	phones: ["+1 (713) 555-0192", "+1 (713) 555-0148"],
	emails: ["sales@jaycoindustrial.com", "support@jaycoindustrial.com"],
	seoTitleTemplate: "%s | Jayco Industrial Manufacturing",
	seoDescriptionTemplate:
		"Jayco Industrial Manufacturing delivers engineered heavy-industrial systems, fabrication, and field support across critical process industries.",
	logo: {
		src: "/images/logo.svg",
		alt: "Jayco Industrial Manufacturing",
		width: 480,
		height: 120,
	},
	defaultOgImage: {
		src: "/images/og-default.svg",
		alt: "Jayco Industrial Manufacturing facility",
		width: 1200,
		height: 630,
	},
	yearsInBusiness: 22,
	industriesServed: ["Oil & Gas", "Power", "Process Manufacturing", "Infrastructure"],
	standards: ["ISO 9001", "ASME", "AWS D1.1"],
	serviceSupport: "24/7 project response with commissioning and maintenance support.",
};

export const productCategories: ProductCategory[] = [
	{
		name: "Material Handling Systems",
		slug: "material-handling-systems",
		intro:
			"Engineered conveying and transfer systems designed for high-throughput industrial facilities with demanding uptime targets.",
		seoCopy:
			"Custom material handling systems including screw conveyors, bucket elevators, and integrated transfer solutions for heavy industrial plants.",
		heroImage: image("/images/category-material.svg", "Material handling systems in manufacturing plant"),
		order: 1,
		featuredProductSlugs: ["heavy-duty-screw-conveyor", "modular-bucket-elevator"],
		relatedCategorySlugs: ["fabrication-services", "pressure-vessels"],
	},
	{
		name: "Pressure Vessels",
		slug: "pressure-vessels",
		intro: "ASME-ready pressure vessels and tanks for process-critical operations.",
		seoCopy:
			"Industrial pressure vessels with engineered shell design, corrosion-resistant options, and full traceability documentation.",
		heroImage: image("/images/category-pressure.svg", "Pressure vessel manufacturing workshop"),
		order: 2,
		featuredProductSlugs: ["vertical-separator-vessel", "high-pressure-storage-tank"],
		relatedCategorySlugs: ["material-handling-systems", "fabrication-services"],
	},
	{
		name: "Fabrication Services",
		slug: "fabrication-services",
		intro:
			"Precision structural and plate fabrication services from detailed engineering through site deployment.",
		seoCopy: "Heavy fabrication services for skids, platforms, ducts, and custom process modules.",
		heroImage: image("/images/category-fabrication.svg", "Heavy industrial fabrication and welding"),
		order: 3,
		featuredProductSlugs: ["process-skid-module", "structural-support-platform"],
		relatedCategorySlugs: ["material-handling-systems", "pressure-vessels"],
	},
];

export const products: Product[] = [
	{
		name: "Heavy Duty Screw Conveyor",
		slug: "heavy-duty-screw-conveyor",
		categorySlug: "material-handling-systems",
		heroImages: [
			image("/images/product-screw-conveyor.svg", "Heavy duty screw conveyor assembly"),
			image("/images/gallery-floor.svg", "Screw conveyor on manufacturing floor"),
		],
		description:
			"Designed for abrasive and high-volume material transfer with configurable pitch, shaft options, and wear-liner packages.",
		features: [
			"Abrasion-resistant flights",
			"Variable speed drive integration",
			"High torque gearbox options",
		],
		applications: ["Cement plants", "Aggregate processing", "Bulk minerals"],
		specs: [
			{ label: "Capacity", value: "up to 220 TPH" },
			{ label: "Diameter Range", value: "250 mm - 900 mm" },
			{ label: "Motor Power", value: "11 kW - 75 kW" },
		],
		complianceNotes: ["ISO 9001 fabrication workflow", "AWS certified weld procedures"],
		ctaLabel: "Request Quote",
		relatedProductSlugs: ["modular-bucket-elevator", "process-skid-module"],
		faq: [
			{
				question: "Can this conveyor handle high-temperature feed?",
				answer: "Yes, high-temperature packages include specialized bearings and thermal isolation design.",
			},
			{
				question: "Is on-site commissioning included?",
				answer: "Commissioning and startup support can be included through our field service team.",
			},
		],
	},
	{
		name: "Modular Bucket Elevator",
		slug: "modular-bucket-elevator",
		categorySlug: "material-handling-systems",
		heroImages: [image("/images/product-bucket-elevator.svg", "Industrial modular bucket elevator")],
		description: "Modular vertical conveying system optimized for throughput and simplified maintenance.",
		features: ["Chain and belt options", "Dust-controlled enclosure", "Quick-access maintenance panels"],
		applications: ["Grain handling", "Fertilizer production", "Mineral processing"],
		specs: [
			{ label: "Lift Height", value: "up to 45 m" },
			{ label: "Capacity", value: "up to 180 TPH" },
			{ label: "Bucket Material", value: "Steel / Polymer" },
		],
		complianceNotes: ["Built to site-specific safety standards"],
		ctaLabel: "Enquire Now",
		relatedProductSlugs: ["heavy-duty-screw-conveyor", "vertical-separator-vessel"],
		faq: [],
	},
	{
		name: "Vertical Separator Vessel",
		slug: "vertical-separator-vessel",
		categorySlug: "pressure-vessels",
		heroImages: [image("/images/product-separator.svg", "Vertical separator vessel with nozzle layout")],
		description:
			"Engineered pressure vessel for liquid-gas separation with custom internals and corrosion allowances.",
		features: ["Custom internal pack designs", "Full traceability package", "NDE and hydrotest support"],
		applications: ["Upstream processing", "Refinery units", "Gas conditioning"],
		specs: [
			{ label: "Design Pressure", value: "up to 250 bar" },
			{ label: "Design Temperature", value: "-20 C to 420 C" },
			{ label: "Diameter", value: "600 mm - 3600 mm" },
		],
		complianceNotes: ["ASME Section VIII Div. 1", "Material certificates included"],
		relatedProductSlugs: ["high-pressure-storage-tank"],
		faq: [],
	},
	{
		name: "High Pressure Storage Tank",
		slug: "high-pressure-storage-tank",
		categorySlug: "pressure-vessels",
		heroImages: [image("/images/product-storage-tank.svg", "High pressure storage tank fabrication")],
		description: "Horizontal and vertical high-pressure tanks for critical storage applications.",
		features: ["Multi-layer coating options", "Skid-ready designs", "Optional insulation packages"],
		applications: ["Chemical plants", "Gas distribution", "Utility systems"],
		specs: [
			{ label: "Volume", value: "2 m3 - 180 m3" },
			{ label: "Design Code", value: "ASME / PED options" },
			{ label: "Material Grades", value: "CS / SS / Duplex" },
		],
		complianceNotes: ["Third-party inspection available"],
		relatedProductSlugs: ["vertical-separator-vessel", "process-skid-module"],
		faq: [],
	},
	{
		name: "Process Skid Module",
		slug: "process-skid-module",
		categorySlug: "fabrication-services",
		heroImages: [image("/images/product-skid.svg", "Process skid module with integrated piping")],
		description:
			"Fabricated turnkey process skid with integrated piping, controls interface, and transport-ready framing.",
		features: ["Modular layout", "Factory acceptance testing", "Integrated instrumentation ports"],
		applications: ["Water treatment", "Chemical dosing", "Energy systems"],
		specs: [
			{ label: "Footprint", value: "Custom" },
			{ label: "Structural Standard", value: "AISC compliant" },
			{ label: "Finish", value: "Blast + epoxy coating" },
		],
		complianceNotes: ["WPS/PQR documentation included"],
		relatedProductSlugs: ["structural-support-platform", "heavy-duty-screw-conveyor"],
		faq: [],
	},
	{
		name: "Structural Support Platform",
		slug: "structural-support-platform",
		categorySlug: "fabrication-services",
		heroImages: [image("/images/product-platform.svg", "Fabricated structural support platform")],
		description: "Engineered steel support platform for heavy equipment and maintenance access.",
		features: ["Load-rated design", "Anti-slip grating", "Galvanized or painted finish"],
		applications: ["Plant expansions", "Equipment retrofits", "Maintenance walkways"],
		specs: [
			{ label: "Load Capacity", value: "Project specific" },
			{ label: "Material", value: "ASTM A36 / A572" },
			{ label: "Coating", value: "C4/C5 environments" },
		],
		complianceNotes: ["Design review and shop drawings included"],
		relatedProductSlugs: ["process-skid-module", "modular-bucket-elevator"],
		faq: [],
	},
];

export const galleryCategories: GalleryCategory[] = [
	{
		name: "Manufacturing Floor",
		slug: "manufacturing-floor",
		images: [
			{ ...image("/images/gallery-floor.svg", "Fabrication team assembling industrial modules"), productSlug: "process-skid-module" },
			{ ...image("/images/gallery-welding.svg", "Certified welding in progress on heavy section"), productSlug: "structural-support-platform" },
		],
	},
	{
		name: "Site Installations",
		slug: "site-installations",
		images: [
			{ ...image("/images/gallery-installation.svg", "On-site installation of screw conveyor system"), productSlug: "heavy-duty-screw-conveyor" },
			{ ...image("/images/gallery-commissioning.svg", "Commissioning checks for pressure vessel package"), productSlug: "vertical-separator-vessel" },
		],
	},
];

export const clients: Client[] = [
	"@1.jpg", "@10.jpg", "@11.jpg", "@12.jpg", "@14.jpg", "@15.jpg", "@17.jpg",
	"@18.jpg", "@19.jpg", "@2.jpg", "@20.jpg", "@21.jpg", "@22.jpg", "@23.jpg",
	"@24.jpg", "@3.jpg", "@4.jpg", "@5.jpg", "@6.jpg", "@7.jpg", "@8.jpg", "@9.jpg",
	"client-001.jpg", "client-002.jpg", "client-003.jpg", "client-004.jpg",
	"client-005.jpg", "client-006.jpg", "client-007.jpg", "client-008.jpg",
	"client-009.jpg", "client-011.jpg", "galaxy.jpeg", "logo1.jpg", "logo12.jpg",
	"logo13.jpg", "logo14.jpg", "logo15.jpg", "logo16.jpg", "logo17.jpg", "logo19.jpg",
	"logo20.jpg", "logo21.jpg", "logo22.jpg", "logo23.jpg", "logo24.jpg", "logo26.jpg",
	"logo27.jpg", "logo28.jpg", "logo29.jpg", "logo30.jpg", "logo31.jpg", "logo32.jpg",
	"logo33.jpg", "logo34.jpg", "logo8.jpg", "logo9.jpg", "resize1.png", "resize10.png",
	"resize2.png", "resize4.png", "resize5.png", "resize6.png", "resize7.png",
	"resize8.png", "resize9.png"
].map((filename, i) => ({
	name: `Client ${i + 1}`,
	logo: { src: `/images/clients/${filename}`, alt: `Client ${i + 1} logo`, width: 240, height: 120 },
	industryTag: "",
}));

export const careersPage: CareersPage = {
	title: "Build Heavy-Industrial Systems With Us",
	intro:
		"Join our fabrication, engineering, and field operations teams working on high-impact industrial manufacturing projects.",
	highlights: [
		"Skilled fabrication and welding career paths",
		"Site commissioning and field engineering opportunities",
		"Safety-first culture with structured training",
	],
};
