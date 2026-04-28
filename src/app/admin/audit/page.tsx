import type { Metadata } from "next"

import { listRecentAdminAuditLogs, type AdminAuditLogRecord } from "@/lib/mongodb/admin-audit-logs"

export const metadata: Metadata = {
	title: "Audit Logs | Jayco Admin",
}

export const dynamic = "force-dynamic"

function formatDateTime(value: Date): string {
	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(value)
}

function formatJson(value: unknown): string {
	return JSON.stringify(value, null, 2)
}

function entityLabel(log: AdminAuditLogRecord): string {
	return log.entityKey || log.entityId || "-"
}

function statusClassName(status: AdminAuditLogRecord["status"]): string {
	return status === "success"
		? "bg-emerald-50 text-emerald-700 ring-emerald-200"
		: "bg-red-50 text-red-700 ring-red-200"
}

export default async function AdminAuditPage() {
	const logs = await listRecentAdminAuditLogs({ limit: 100 })

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight text-slate-950">Audit Logs</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Review recent admin catalog and media operations, including successes, failures, affected
					entities, and safe before/after snapshots.
				</p>
			</div>

			{logs.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
					<h2 className="text-base font-semibold text-slate-950">No audit logs yet.</h2>
					<p className="mt-2 text-sm text-slate-600">
						Catalog and media changes will appear here after admin mutations run.
					</p>
				</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-slate-200">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200 text-sm">
							<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-3">Time</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3">Action</th>
									<th className="px-4 py-3">Entity</th>
									<th className="px-4 py-3">Summary</th>
									<th className="px-4 py-3">Actor</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200 bg-white">
								{logs.map((log) => (
									<tr key={String(log._id ?? `${log.createdAt.toISOString()}-${log.action}`)}>
										<td className="whitespace-nowrap px-4 py-3 text-slate-700">
											{formatDateTime(log.createdAt)}
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClassName(log.status)}`}>
												{log.status}
											</span>
										</td>
										<td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700">
											{log.action}
										</td>
										<td className="px-4 py-3 text-slate-700">
											<div className="font-semibold text-slate-950">{log.entityType}</div>
											<div className="mt-0.5 break-all font-mono text-xs text-slate-500">{entityLabel(log)}</div>
										</td>
										<td className="min-w-80 px-4 py-3 text-slate-700">
											<p>{log.summary}</p>
											<AuditDetails log={log} />
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-700">
											{log.actorEmail ?? "-"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	)
}

function AuditDetails({ log }: { log: AdminAuditLogRecord }) {
	const hasDetails =
		log.before !== undefined ||
		log.after !== undefined ||
		log.metadata !== undefined ||
		log.errorMessage !== undefined ||
		log.errorCode !== undefined

	if (!hasDetails) return null

	return (
		<details className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
			<summary className="cursor-pointer text-xs font-semibold text-slate-700">Details</summary>
			<div className="mt-3 space-y-3">
				{log.before !== undefined ? <JsonBlock label="Before" value={log.before} /> : null}
				{log.after !== undefined ? <JsonBlock label="After" value={log.after} /> : null}
				{log.metadata !== undefined ? <JsonBlock label="Metadata" value={log.metadata} /> : null}
				{log.errorCode || log.errorMessage ? (
					<JsonBlock
						label="Error"
						value={{
							code: log.errorCode,
							message: log.errorMessage,
						}}
					/>
				) : null}
			</div>
		</details>
	)
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
			<pre className="mt-1 max-h-80 overflow-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">
				{formatJson(value)}
			</pre>
		</div>
	)
}
