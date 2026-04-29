import { getContactSubmissionsCollection } from "@/lib/admin/mongo"

export const dynamic = "force-dynamic"

function formatDate(value: Date): string {
	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(value)
}

function preview(value: string | null | undefined): string {
	if (!value) return "-"
	return value.length > 140 ? `${value.slice(0, 140)}...` : value
}

export default async function ContactSubmissionsPage() {
	const collection = await getContactSubmissionsCollection()
	const submissions = await collection.find({}).sort({ createdAt: -1 }).limit(50).toArray()

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight text-slate-950">Inquiries</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					Review recent contact form submissions captured from the public site.
				</p>
			</div>

			{submissions.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
					<h2 className="text-base font-semibold text-slate-950">No inquiries yet.</h2>
					<p className="mt-2 text-sm text-slate-600">New contact form submissions will appear here.</p>
				</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-slate-200">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200 text-sm">
							<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-3">Submitted</th>
									<th className="px-4 py-3">Contact</th>
									<th className="px-4 py-3">Phone / Company</th>
									<th className="px-4 py-3">Type</th>
									<th className="px-4 py-3">Message</th>
									<th className="px-4 py-3">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200 bg-white">
								{submissions.map((submission) => (
									<tr key={submission._id.toString()}>
										<td className="whitespace-nowrap px-4 py-3 text-slate-700">
											{formatDate(submission.createdAt)}
										</td>
										<td className="px-4 py-3">
											<div className="font-semibold text-slate-950">{submission.name}</div>
											<div className="mt-0.5 break-all text-xs text-slate-500">{submission.email}</div>
										</td>
										<td className="px-4 py-3 text-slate-700">
											<div>{submission.phone}</div>
											<div className="mt-0.5 text-xs text-slate-500">{submission.company ?? "-"}</div>
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-700">
											{submission.intentLabel || submission.intent || "-"}
										</td>
										<td className="min-w-80 px-4 py-3 text-slate-700">{preview(submission.message)}</td>
										<td className="whitespace-nowrap px-4 py-3">
											<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
												{submission.status}
											</span>
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
