"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react"
import type { ImageAsset } from "@/lib/cms/types"

interface ImageGalleryProps {
	images: ImageAsset[]
	/** Larger lead layout for product detail (gallery-first CRO). */
	leadLayout?: boolean
	/** Amazon-style main stage + thumbnail filmstrip (product detail). */
	variant?: "grid" | "carousel"
}

export function ImageGallery({ images, leadLayout = false, variant = "grid" }: ImageGalleryProps) {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
	const [activeIndex, setActiveIndex] = useState(0)
	const touchStartX = useRef<number | null>(null)

	const close = useCallback(() => setLightboxIndex(null), [])

	const goNext = useCallback(() => {
		setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))
	}, [images.length])

	const goPrev = useCallback(() => {
		setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
	}, [images.length])

	const stageNext = useCallback(() => {
		setActiveIndex((i) => (i + 1) % images.length)
	}, [images.length])

	const stagePrev = useCallback(() => {
		setActiveIndex((i) => (i - 1 + images.length) % images.length)
	}, [images.length])

	useEffect(() => {
		if (lightboxIndex === null) return

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") close()
			if (e.key === "ArrowRight") goNext()
			if (e.key === "ArrowLeft") goPrev()
		}

		document.body.style.overflow = "hidden"
		window.addEventListener("keydown", onKeyDown)
		return () => {
			document.body.style.overflow = ""
			window.removeEventListener("keydown", onKeyDown)
		}
	}, [lightboxIndex, close, goNext, goPrev])

	useEffect(() => {
		if (activeIndex >= images.length) setActiveIndex(0)
	}, [activeIndex, images.length])

	useEffect(() => {
		if (images.length < 2) return
		if (variant !== "carousel" || !leadLayout) return
		if (lightboxIndex !== null) return
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
		if (mq.matches) return

		const id = window.setInterval(() => {
			setActiveIndex((i) => (i + 1) % images.length)
		}, 3000)
		return () => window.clearInterval(id)
	}, [images.length, variant, leadLayout, lightboxIndex])

	if (images.length === 0) return null

	const isCarousel = variant === "carousel" && leadLayout

	function onTouchStart(e: TouchEvent<HTMLDivElement>) {
		touchStartX.current = e.changedTouches[0].clientX
	}

	function onTouchEnd(e: TouchEvent<HTMLDivElement>) {
		if (touchStartX.current === null || images.length < 2) return
		const dx = e.changedTouches[0].clientX - touchStartX.current
		touchStartX.current = null
		if (dx > 48) stagePrev()
		else if (dx < -48) stageNext()
	}

	return (
		<>
			{isCarousel ? (
				<div role="region" aria-roledescription="carousel" aria-label="Product images">
					<div
						className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm sm:aspect-[4/3] sm:rounded-2xl lg:aspect-[5/4] lg:rounded-2xl"
						onTouchStart={onTouchStart}
						onTouchEnd={onTouchEnd}
					>
						<button
							type="button"
							onClick={() => setLightboxIndex(activeIndex)}
							className="absolute inset-0 z-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
							aria-label={`View image ${activeIndex + 1} of ${images.length} larger`}
						>
							<Image
								src={images[activeIndex].src}
								alt={images[activeIndex].alt}
								fill
								className="object-cover lg:object-contain"
								priority={activeIndex === 0}
								sizes="(max-width: 1024px) 100vw, 50vw"
							/>
						</button>

						{images.length > 1 ? (
							<>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										stagePrev()
									}}
									className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-800 shadow-md transition hover:bg-white sm:left-3 sm:h-11 sm:w-11"
									aria-label="Previous image"
								>
									<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
										<path
											d="M15 18l-6-6 6-6"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.25"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										stageNext()
									}}
									className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-800 shadow-md transition hover:bg-white sm:right-3 sm:h-11 sm:w-11"
									aria-label="Next image"
								>
									<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
										<path
											d="M9 18l6-6-6-6"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.25"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<span className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-950/75 px-2.5 py-1 text-[0.65rem] font-semibold tabular-nums text-white">
									{activeIndex + 1} / {images.length}
								</span>
							</>
						) : null}
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:gap-6">
					<button
						type="button"
						onClick={() => setLightboxIndex(0)}
						className={`relative w-full cursor-zoom-in overflow-hidden border border-slate-200 bg-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 lg:flex-1 ${
							leadLayout
								? "aspect-[4/3] rounded-2xl sm:aspect-[5/4] sm:rounded-3xl"
								: "aspect-video rounded-lg"
						}`}
					>
						<Image
							src={images[0].src}
							alt={images[0].alt}
							fill
							className={leadLayout ? "object-cover" : "object-contain"}
							priority
							sizes="(max-width: 1024px) 100vw, 62vw"
						/>
					</button>

					{images.length > 1 && (
						<div
							className={`grid grid-cols-4 gap-3 lg:grid-cols-2 ${
								leadLayout ? "lg:w-[34%] lg:gap-4" : "lg:w-[36%] lg:gap-6"
							}`}
						>
							{images.slice(1).map((image, i) => (
								<button
									key={image.src}
									type="button"
									onClick={() => setLightboxIndex(i + 1)}
									className={`relative aspect-square cursor-zoom-in overflow-hidden border border-slate-200 bg-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 ${
										leadLayout ? "rounded-xl" : "rounded-md"
									}`}
								>
									<Image
										src={image.src}
										alt={image.alt}
										fill
										className={`transition-transform duration-500 hover:scale-[1.04] ${
											leadLayout ? "object-cover" : "object-contain"
										}`}
										sizes="(max-width: 640px) 25vw, (max-width: 1024px) 25vw, 18vw"
									/>
								</button>
							))}
						</div>
					)}
				</div>
			)}

			{lightboxIndex !== null && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
					onClick={close}
					role="dialog"
					aria-modal="true"
					aria-label="Image viewer"
				>
					<button
						type="button"
						onClick={close}
						className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
						aria-label="Close image viewer"
					>
						<svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
							<path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
						</svg>
					</button>

					{images.length > 1 && (
						<span className="absolute left-4 top-4 text-sm font-bold text-white/70 sm:left-6 sm:top-6">
							{lightboxIndex + 1} / {images.length}
						</span>
					)}

					{images.length > 1 && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								goPrev()
							}}
							className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
							aria-label="Previous image"
						>
							<svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
								<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
							</svg>
						</button>
					)}

					{images.length > 1 && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								goNext()
							}}
							className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
							aria-label="Next image"
						>
							<svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
								<path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
							</svg>
						</button>
					)}

					<div
						className="relative h-[80vh] w-[90vw] max-w-5xl sm:h-[85vh]"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={images[lightboxIndex].src}
							alt={images[lightboxIndex].alt}
							fill
							className="object-contain"
							sizes="90vw"
							priority
						/>
					</div>
				</div>
			)}
		</>
	)
}
