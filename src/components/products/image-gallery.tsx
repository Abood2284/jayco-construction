"use client"

import Image from "next/image"
import { useState, useCallback, useEffect } from "react"
import type { ImageAsset } from "@/lib/cms/types"

interface ImageGalleryProps {
	images: ImageAsset[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

	const close = useCallback(() => setLightboxIndex(null), [])

	const goNext = useCallback(() => {
		setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))
	}, [images.length])

	const goPrev = useCallback(() => {
		setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
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

	if (images.length === 0) return null

	return (
		<>
			{/* Gallery Grid */}
			<div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:gap-6">
				{/* Primary large image */}
				<button
					type="button"
					onClick={() => setLightboxIndex(0)}
					className="relative aspect-video w-full cursor-zoom-in overflow-hidden border-2 border-slate-900 bg-slate-100 shadow-[4px_4px_0_0_rgba(15,23,42,1)] lg:flex-1"
				>
					<Image
						src={images[0].src}
						alt={images[0].alt}
						fill
						className="object-contain"
						priority
						sizes="(max-width: 1024px) 100vw, 62vw"
					/>
				</button>

				{/* Thumbnail grid */}
				{images.length > 1 && (
					<div className="grid grid-cols-4 gap-3 lg:w-[36%] lg:grid-cols-2 lg:gap-6">
						{images.slice(1).map((image, i) => (
							<button
								key={image.src}
								type="button"
								onClick={() => setLightboxIndex(i + 1)}
								className="relative aspect-square cursor-zoom-in overflow-hidden border-2 border-slate-900 bg-slate-100 shadow-[2px_2px_0_0_rgba(15,23,42,1)]"
							>
								<Image
									src={image.src}
									alt={image.alt}
									fill
									className="object-contain transition-transform duration-500 hover:scale-[1.04]"
									sizes="(max-width: 640px) 25vw, (max-width: 1024px) 25vw, 18vw"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Lightbox Overlay */}
			{lightboxIndex !== null && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
					onClick={close}
					role="dialog"
					aria-modal="true"
					aria-label="Image viewer"
				>
					{/* Close button */}
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

					{/* Counter */}
					{images.length > 1 && (
						<span className="absolute left-4 top-4 text-sm font-bold text-white/70 sm:left-6 sm:top-6">
							{lightboxIndex + 1} / {images.length}
						</span>
					)}

					{/* Previous */}
					{images.length > 1 && (
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); goPrev() }}
							className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
							aria-label="Previous image"
						>
							<svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
								<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
							</svg>
						</button>
					)}

					{/* Next */}
					{images.length > 1 && (
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); goNext() }}
							className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
							aria-label="Next image"
						>
							<svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
								<path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
							</svg>
						</button>
					)}

					{/* Full-size image */}
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
