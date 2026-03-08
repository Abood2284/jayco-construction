import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/config";
import { getSiteSettings } from "@/lib/cms";

type MetadataOptions = {
	title: string;
	description: string;
	path: string;
	imagePath?: string;
	indexable?: boolean;
};

export const buildMetadata = async ({
	title,
	description,
	path,
	imagePath,
	indexable = true,
}: MetadataOptions): Promise<Metadata> => {
	const settings = await getSiteSettings();
	const pageTitle = settings.seoTitleTemplate.replace("%s", title);
	const canonical = absoluteUrl(path);
	const imageUrl = imagePath ? absoluteUrl(imagePath) : absoluteUrl(settings.defaultOgImage.src);

	return {
		title: pageTitle,
		description,
		alternates: {
			canonical,
		},
		robots: {
			index: indexable,
			follow: indexable,
		},
		openGraph: {
			title: pageTitle,
			description,
			url: canonical,
			type: "website",
			images: [{ url: imageUrl, width: 1200, height: 630 }],
		},
		twitter: {
			card: "summary_large_image",
			title: pageTitle,
			description,
			images: [imageUrl],
		},
	};
};
