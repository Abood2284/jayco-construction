"use client"

import { useCallback, useRef, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CategoriesCarouselProps {
	children: ReactNode
	"aria-label"?: string
}

export function CategoriesCarousel({
	children,
	"aria-label": ariaLabel = "Product categories",
}: CategoriesCarouselProps) {
	const scrollerRef = useRef<HTMLDivElement>(null)

	const scrollByStep = useCallback((direction: "prev" | "next") => {
		const el = scrollerRef.current
		if (!el) return
		const firstCard = el.querySelector<HTMLElement>("[data-carousel-card]")
		const gap = 20
		const step = firstCard ? firstCard.offsetWidth + gap : Math.min(el.clientWidth * 0.9, 320)
		el.scrollBy({
			left: direction === "next" ? step : -step,
			behavior: "smooth",
		})
	}, [])

	return (
		<div className="relative">
			<div
				ref={scrollerRef}
				role="region"
				aria-label={ariaLabel}
				className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{children}
			</div>

			<div className="mt-6 flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => scrollByStep("prev")}
					className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
					aria-label="Show previous categories"
				>
					<ChevronLeft className="h-5 w-5" aria-hidden />
				</button>
				<button
					type="button"
					onClick={() => scrollByStep("next")}
					className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
					aria-label="Show next categories"
				>
					<ChevronRight className="h-5 w-5" aria-hidden />
				</button>
			</div>
		</div>
	)
}
