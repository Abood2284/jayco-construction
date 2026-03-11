export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jaycocranes.in").replace(/\/$/, "");

export const absoluteUrl = (path: string) => {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `${siteUrl}${normalized}`;
};
