export interface HomepageHeroGallerySlide {
	src: string
	alt: string
	eyebrow: string
	title: string
	ctaLabel: string
	/** In-app route (e.g. `/products`, `/gallery`). */
	ctaHref: string
}

/** Hero gallery carousel: one slide = image + copy + primary CTA. */
export const HOMEPAGE_HERO_GALLERY_SLIDES: HomepageHeroGallerySlide[] = [
	{
		src: "/images/gallery-section-1.jpg",
		alt: "Jayco overhead crane installation across a production bay",
		eyebrow: "Installations & projects",
		title: "EOT cranes engineered for heavy-duty bays",
		ctaLabel: "EOT cranes",
		ctaHref: "/products/eot-cranes",
	},
	{
		src: "/images/gallery-section-2.jpg",
		alt: "Material handling equipment configured inside an active industrial facility",
		eyebrow: "Production facilities",
		title: "Material handling systems in live industrial plants",
		ctaLabel: "Browse catalog",
		ctaHref: "/products",
	},
	{
		src: "/images/gallery-section-3.jpeg",
		alt: "Heavy-duty equipment deployed for field-ready lifting operations",
		eyebrow: "Field applications",
		title: "Cranes, hoists & lifts built for real site conditions",
		ctaLabel: "Project gallery",
		ctaHref: "/gallery",
	},
]

/** Teaser section: same assets with short captions (eyebrow as label). */
export const HOMEPAGE_HERO_GALLERY_IMAGES = HOMEPAGE_HERO_GALLERY_SLIDES.map((slide) => ({
	src: slide.src,
	alt: slide.alt,
	caption: slide.eyebrow,
}))
