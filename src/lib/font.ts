import localFont from "next/font/local"

export const headingFont = localFont({
	src: [
		{
			path: "../../public/fonts/quilon/Quilon-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/quilon/Quilon-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/quilon/Quilon-Semibold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/fonts/quilon/Quilon-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-heading",
	display: "swap",
})

export const bodyFont = localFont({
	src: [
		{
			path: "../../public/fonts/rowan/Rowan-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/rowan/Rowan-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/rowan/Rowan-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/rowan/Rowan-Semibold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/fonts/rowan/Rowan-LightItalic.woff2",
			weight: "300",
			style: "italic",
		},
		{
			path: "../../public/fonts/rowan/Rowan-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../public/fonts/rowan/Rowan-MediumItalic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../../public/fonts/rowan/Rowan-SemiboldItalic.woff2",
			weight: "600",
			style: "italic",
		},
	],
	variable: "--font-body",
	display: "swap",
})

