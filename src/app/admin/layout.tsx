import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
	title: "Admin | Jayco Construction",
}

export const dynamic = "force-dynamic"

export default function AdminRootLayout({ children }: { children: ReactNode }) {
	return children
}
