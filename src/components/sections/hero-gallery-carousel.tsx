"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import type { HomepageHeroGallerySlide } from "@/lib/content/homepage-gallery"

const ADVANCE_MS = 5500

interface HeroGalleryCarouselProps {
	slides: HomepageHeroGallerySlide[]
}

export function HeroGalleryCarousel({ slides }: HeroGalleryCarouselProps) {
	const [index, setIndex] = useState(0)
	const [isPaused, setIsPaused] = useState(false)
	const [reducedMotion, setReducedMotion] = useState(false)

	const goTo = useCallback(
		(next: number) => {
			if (slides.length === 0) return
			const i = ((next % slides.length) + slides.length) % slides.length
			setIndex(i)
		},
		[slides.length],
	)

	const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
	const goNext = useCallback(() => goTo(index + 1), [goTo, index])

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
		function onChange() {
			setReducedMotion(mq.matches)
		}
		onChange()
		mq.addEventListener("change", onChange)
		return () => mq.removeEventListener("change", onChange)
	}, [])

	useEffect(() => {
		if (slides.length <= 1 || reducedMotion || isPaused) return
		const id = window.setInterval(() => {
			setIndex((i) => (i + 1) % slides.length)
		}, ADVANCE_MS)
		return () => window.clearInterval(id)
	}, [slides.length, reducedMotion, isPaused])

	if (slides.length === 0) return null

	const transitionClass = reducedMotion ? "duration-0" : "duration-500 ease-out motion-reduce:transition-none"

	return (
		<div
			className="relative mb-5 w-full md:mb-6"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onFocusCapture={() => setIsPaused(true)}
			onBlurCapture={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsPaused(false)
			}}
		>
			<div className="relative w-full overflow-hidden">
				<div
					className={`flex transition-transform will-change-transform ${transitionClass}`}
					style={{
						transform: `translateX(-${index * 100}%)`,
						transitionProperty: reducedMotion ? "none" : "transform",
					}}
				>
					{slides.map((slide, i) => (
						<div key={slide.src} className="w-full shrink-0 flex-[0_0_100%]">
							<div className="relative aspect-[16/5] sm:aspect-[16/6] w-full bg-slate-900 lg:aspect-auto lg:h-[min(280px,32vh)] lg:max-h-[300px] lg:min-h-[200px]">
								<Image
									src={slide.src}
									alt={slide.alt}
									fill
									priority={i === 0}
									className="object-cover"
									sizes="100vw"
								/>
								<div
									className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950/92 via-slate-950/55 to-slate-950/25"
									aria-hidden
								/>
								<div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10 lg:pb-8">
									<div className="max-w-xl">
										<p className="font-heading mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-300 sm:text-[0.68rem] sm:tracking-[0.22em]">
											{slide.eyebrow}
										</p>
										<h2 className="font-heading text-balance text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-[clamp(1.35rem,2.5vw,1.85rem)]">
											{slide.title}
										</h2>
										<Link
											href={slide.ctaHref}
											className="font-heading mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-rose-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_32px_rgba(190,24,93,0.35)] transition-colors hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"
										>
											{slide.ctaLabel}
										</Link>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{slides.length > 1 ? (
					<div className="pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center justify-between sm:left-4 sm:right-4">
						<button
							type="button"
							aria-label="Previous slide"
							onClick={goPrev}
							className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/55 text-white backdrop-blur-sm transition-colors hover:bg-slate-950/75"
						>
							<ChevronLeft className="h-5 w-5" aria-hidden />
						</button>
						<button
							type="button"
							aria-label="Next slide"
							onClick={goNext}
							className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/55 text-white backdrop-blur-sm transition-colors hover:bg-slate-950/75"
						>
							<ChevronRight className="h-5 w-5" aria-hidden />
						</button>
					</div>
				) : null}
			</div>

			{slides.length > 1 ? (
				<div className="flex justify-center gap-2 border-t border-white/8 bg-slate-950 py-2">
					{slides.map((slide, i) => (
						<button
							key={`dot-${slide.src}`}
							type="button"
							aria-label={`Show slide ${i + 1}: ${slide.title}`}
							aria-current={i === index ? "true" : undefined}
							onClick={() => setIndex(i)}
							className={`h-2 rounded-full transition-all ${
								i === index ? "w-7 bg-rose-400" : "w-2 bg-white/25 hover:bg-white/40"
							}`}
						/>
					))}
				</div>
			) : null}
		</div>
	)
}
