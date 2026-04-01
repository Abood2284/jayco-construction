import { Libre_Baskerville, Open_Sans } from "next/font/google"

/** Sans for headings, nav, and primary UI labels (maps to --font-heading in globals.css) */
export const headingFont = Open_Sans({
	subsets: ["latin"],
	variable: "--font-heading",
	display: "swap",
})

/** Serif for long-form and supporting copy (maps to --font-body in globals.css) */
export const bodyFont = Libre_Baskerville({
	subsets: ["latin"],
	variable: "--font-body",
	display: "swap",
})
