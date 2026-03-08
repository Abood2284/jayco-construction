import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRedirectMap } from "@/lib/seo/redirects";

const redirectMap = getRedirectMap();

const staticAssetPattern = /\.(?:css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|txt|woff2?|ttf|map)$/i;

const isAssetPath = (pathname: string) =>
	pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/images") || staticAssetPattern.test(pathname);

export function middleware(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	if (isAssetPath(pathname)) {
		return NextResponse.next();
	}

	let nextPath = pathname;
	let changed = false;

	const lowerPath = nextPath.toLowerCase();
	if (nextPath !== lowerPath) {
		nextPath = lowerPath;
		changed = true;
	}

	if (nextPath !== "/" && nextPath.endsWith("/")) {
		nextPath = nextPath.slice(0, -1);
		changed = true;
	}

	if (nextPath.endsWith(".html")) {
		const mappedPath = redirectMap.get(nextPath);
		const fallback = nextPath.replace(/\.html$/, "") || "/";
		nextPath = mappedPath ?? fallback;
		changed = true;
	}

	if (changed && nextPath !== pathname) {
		const url = request.nextUrl.clone();
		url.pathname = nextPath;
		url.search = search;
		return NextResponse.redirect(url, 301);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
