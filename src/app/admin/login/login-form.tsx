"use client"

import { useActionState } from "react"

import { loginAction, type LoginActionState } from "./actions"

const initialState: LoginActionState = {}

export function AdminLoginForm() {
	const [state, formAction, pending] = useActionState(loginAction, initialState)

	return (
		<form action={formAction} className="space-y-5">
			<div className="space-y-2">
				<label htmlFor="identifier" className="text-sm font-semibold text-slate-700">
					Username or email
				</label>
				<input
					id="identifier"
					name="identifier"
					type="text"
					autoComplete="username"
					required
					className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
					placeholder="admin@example.com"
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="password" className="text-sm font-semibold text-slate-700">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					required
					className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
				/>
			</div>

			{state.error ? (
				<p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800" role="alert">
					{state.error}
				</p>
			) : null}

			<button
				type="submit"
				disabled={pending}
				className="flex w-full min-h-11 items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
			>
				{pending ? "Signing in..." : "Sign in"}
			</button>
		</form>
	)
}
