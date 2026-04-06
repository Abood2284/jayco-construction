"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { HeroSpotlight } from "@/lib/content/hero-spotlights"

const ADVANCE_MS = 3000

interface HeroProductSpotlightsProps {
	spotlights: HeroSpotlight[]
}

export function HeroProductSpotlights({ spotlights }: HeroProductSpotlightsProps) {
	const trackRef = useRef<HTMLDivElement>(null)
	const [index, setIndex] = useState(0)
	const [translateX, setTranslateX] = useState(0)
	const [isPaused, setIsPaused] = useState(false)
	const [reducedMotion, setReducedMotion] = useState(false)

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
		if (spotlights.length <= 1 || reducedMotion || isPaused) return
		const id = window.setInterval(() => {
			setIndex((i) => (i + 1) % spotlights.length)
		}, ADVANCE_MS)
		return () => window.clearInterval(id)
	}, [spotlights.length, reducedMotion, isPaused])

	useEffect(() => {
		setIndex((i) => Math.min(i, Math.max(0, spotlights.length - 1)))
	}, [spotlights.length])

	const syncTranslate = useCallback(() => {
		const track = trackRef.current
		if (!track?.children[index]) return
		const child = track.children[index] as HTMLElement
		setTranslateX(child.offsetLeft)
	}, [index])

	useLayoutEffect(() => {
		syncTranslate()
	}, [syncTranslate])

	useEffect(() => {
		window.addEventListener("resize", syncTranslate, { passive: true })
		return () => window.removeEventListener("resize", syncTranslate)
	}, [syncTranslate])

	if (spotlights.length === 0) return null

	const transitionClass = reducedMotion ? "duration-0" : "duration-300 ease-out"

	return (
		<div
			className="relative min-w-0 max-w-full"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onFocusCapture={() => setIsPaused(true)}
			onBlurCapture={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsPaused(false)
			}}
		>
			<p className="font-heading mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:tracking-[0.18em]">
				Product range
			</p>

			<div className="min-w-0 overflow-hidden">
				<div
					ref={trackRef}
					className={`flex min-w-0 gap-4 transition-transform ${transitionClass}`}
					style={{
						transform: `translateX(-${translateX}px)`,
						transitionProperty: reducedMotion ? "none" : "transform",
					}}
				>
					{spotlights.map((item) => (
						<Link
							key={`${item.href}-${item.title}`}
							href={item.href}
							className="font-heading group shrink-0 grow-0 overflow-hidden rounded-2xl border border-white/12 bg-slate-900/80 shadow-[0_20px_48px_rgba(2,6,23,0.35)] transition-colors hover:border-rose-400/35 hover:bg-slate-900 basis-[min(100%,300px)] sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.67rem)] lg:basis-[calc(25%-0.75rem)]"
						>
							<div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
								<Image
									src={item.image.src}
									alt={item.image.alt}
									fill
									sizes="(max-width: 640px) 300px, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
									className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								/>
								<div
									className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"
									aria-hidden
								/>
							</div>
							<div className="border-t border-white/8 px-4 py-3">
								<p className="text-sm font-semibold tracking-tight text-white text-pretty group-hover:text-rose-100">
									{item.title}
								</p>
								<p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-slate-500">
									View range
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>

			{spotlights.length > 1 ? (
				<div className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1">
					{spotlights.map((item, i) => (
						<button
							key={`dot-${item.href}-${i}`}
							type="button"
							aria-label={`Show ${item.title}`}
							aria-current={i === index ? "true" : undefined}
							onClick={() => setIndex(i)}
							className={`h-2 rounded-full transition-all ${
								i === index ? "w-6 bg-rose-400" : "w-2 bg-white/25 hover:bg-white/40"
							}`}
						/>
					))}
				</div>
			) : null}
		</div>
	)
}
