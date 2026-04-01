import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface SectionCta {
	label: string
	href: string
}

interface SectionCtaRowProps {
	primary: SectionCta
	secondary?: SectionCta
	className?: string
}

export function SectionCtaRow({ primary, secondary, className }: SectionCtaRowProps) {
	return (
		<div className={className}>
			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				<Link
					href={primary.href}
					className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-rose-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-rose-600"
				>
					{primary.label}
					<ArrowRight className="h-4 w-4" aria-hidden />
				</Link>
				{secondary ? (
					<Link
						href={secondary.href}
						className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
					>
						{secondary.label}
					</Link>
				) : null}
			</div>
		</div>
	)
}
