export type HeaderNavLink = {
	label: string;
	href: string;
	match: "exact" | "prefix";
	description?: string;
};

export type HeaderAction = {
	label: string;
	href: string;
};

export const headerNavConfig = {
	primaryLinks: [
		{
			label: "Products",
			href: "/products",
			match: "prefix",
			description: "Browse hoists, cranes, lifts, and material handling systems.",
		},
		{
			label: "Installations",
			href: "/gallery",
			match: "prefix",
			description: "See commissioned equipment and project proof.",
		},
		{
			label: "About",
			href: "/about",
			match: "exact",
			description: "Company profile, manufacturing discipline, and capability story.",
		},
		{
			label: "Clients",
			href: "/clients",
			match: "exact",
			description: "Trusted customer logos and sector proof.",
		},
		{
			label: "Careers",
			href: "/careers",
			match: "exact",
			description: "Fabrication, engineering, and operations roles.",
		},
		{
			label: "Contact",
			href: "/contact",
			match: "exact",
			description: "Speak with Jayco about a live requirement.",
		},
	] satisfies HeaderNavLink[],
	utilityLinks: [
		{
			label: "Contact",
			href: "/contact",
			match: "exact",
			description: "Direct route for live project enquiries.",
		},
	] satisfies HeaderNavLink[],
	ctaActions: {
		quote: {
			label: "Request Quote",
			href: "/contact",
		},
	} satisfies {
		quote: HeaderAction;
	},
	futureLinks: [
		{
			label: "Industries",
			href: "/industries",
			match: "prefix",
			description: "Sector-specific buyer paths for future expansion.",
		},
		{
			label: "Services / AMC",
			href: "/services",
			match: "prefix",
			description: "Service, maintenance, spares, and lifecycle support.",
		},
		{
			label: "Downloads / Resources",
			href: "/downloads",
			match: "prefix",
			description: "Catalogues, datasheets, guides, and technical assets.",
		},
	] satisfies HeaderNavLink[],
};

export function buildPhoneHref(phone: string) {
	return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
