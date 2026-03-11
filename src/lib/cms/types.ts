export type ImageAsset = {
	src: string;
	alt: string;
	width: number;
	height: number;
};

export type SeoFields = {
	title?: string;
	description?: string;
};

export type SiteSettings = {
	companyName: string;
	shortName: string;
	address: string;
	phones: string[];
	emails: string[];
	website: string;
	seoTitleTemplate: string;
	seoDescriptionTemplate: string;
	logo: ImageAsset;
	defaultOgImage: ImageAsset;
	yearsInBusiness: number;
	industriesServed: string[];
	standards: string[];
	serviceSupport: string;
};

export type ProductSpec = {
	label: string;
	value: string;
};

export type ProductArticleFrontmatter = {
	title: string;
	description: string;
	categorySlug: string;
	productSlug: string;
	shortTitle?: string;
	heroImage?: string;
	ogImage?: string;
	excerpt?: string;
	keywords?: string[];
	publishedAt?: string;
	updatedAt?: string;
	toc?: boolean;
	canonicalPath?: string;
};

export type ProductCategory = {
	name: string;
	slug: string;
	intro: string;
	seoCopy: string;
	heroImage: ImageAsset;
	order: number;
	featuredProductSlugs: string[];
	relatedCategorySlugs: string[];
	seo?: SeoFields;
};

export type Product = {
	name: string;
	slug: string;
	categorySlug: string;
	heroImages: ImageAsset[];
	description: string;
	features: string[];
	applications: string[];
	specs: ProductSpec[];
	complianceNotes: string[];
	ctaLabel?: "Request Quote" | "Enquire Now";
	relatedProductSlugs: string[];
	faq: Array<{ question: string; answer: string }>;
	seo?: SeoFields;
};

export type GalleryImage = ImageAsset & {
	productSlug?: string;
};

export type GalleryCategory = {
	name: string;
	slug: string;
	images: GalleryImage[];
	seo?: SeoFields;
};

export type Client = {
	name: string;
	logo: ImageAsset;
	industryTag?: string;
};

export type CareersPage = {
	title: string;
	intro: string;
	highlights: string[];
	seo?: SeoFields;
};

export type EnquirySubmission = {
	name: string;
	email: string;
	phone: string;
	message: string;
	sourcePath: string;
	productSlug?: string;
	createdAt: string;
};

export type CareerSubmission = {
	name: string;
	email: string;
	phone: string;
	message: string;
	resumeFileName?: string;
	sourcePath: string;
	createdAt: string;
};
