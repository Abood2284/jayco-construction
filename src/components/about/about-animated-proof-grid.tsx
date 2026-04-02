"use client"

import { useEffect, useRef, useState } from "react"
import type { AboutProofStat } from "@/lib/content/about"

interface AboutAnimatedProofGridProps {
	stats: AboutProofStat[]
}

export function AboutAnimatedProofGrid({ stats }: AboutAnimatedProofGridProps) {
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<AnimatedStatCell key={stat.label} stat={stat} />
			))}
		</div>
	)
}

function AnimatedStatCell({ stat }: { stat: AboutProofStat }) {
	const [display, setDisplay] = useState(0)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		let raf = 0
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

		const runCountUp = () => {
			if (reduceMotion) {
				setDisplay(stat.target)
				return
			}
			const start = performance.now()
			const duration = 1400
			const tick = (now: number) => {
				const p = Math.min(1, (now - start) / duration)
				const eased = 1 - (1 - p) ** 3
				setDisplay(Math.round(eased * stat.target))
				if (p < 1) raf = requestAnimationFrame(tick)
			}
			raf = requestAnimationFrame(tick)
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0]?.isIntersecting) return
				runCountUp()
				observer.disconnect()
			},
			{ threshold: 0.2 },
		)
		observer.observe(el)

		return () => {
			cancelAnimationFrame(raf)
			observer.disconnect()
		}
	}, [stat.target])

	return (
		<div
			ref={ref}
			className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4"
		>
			<p className="text-2xl font-bold tabular-nums tracking-tight text-slate-950 sm:text-3xl">{display}</p>
			<p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">{stat.label}</p>
		</div>
	)
}
