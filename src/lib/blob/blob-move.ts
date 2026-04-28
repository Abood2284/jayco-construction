import { copy, del } from "@vercel/blob"

function assertBlobTokenConfigured() {
	if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
		throw new Error("Missing BLOB_READ_WRITE_TOKEN. Add it to .env.local or export it before moving product media.")
	}
}

function normalizeBlobPathname(pathname: string): string {
	return pathname.trim().replace(/^\/+/, "")
}

function isMissingBlobError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false
	const message = "message" in error ? String(error.message ?? "").toLowerCase() : ""
	const status = "status" in error ? String(error.status ?? "") : ""
	return status === "404" || message.includes("not found") || message.includes("no such")
}

function warnBlobMoveCleanupFailure(error: unknown) {
	if (process.env.NODE_ENV !== "production") {
		console.warn("Category rename old Blob cleanup failed.", error)
	}
}

export async function movePublicBlobObject(input: {
	oldPathname: string
	newPathname: string
}): Promise<{
	oldPathname: string
	newPathname: string
	newUrl: string
}> {
	assertBlobTokenConfigured()

	const oldPathname = normalizeBlobPathname(input.oldPathname)
	const newPathname = normalizeBlobPathname(input.newPathname)
	if (!oldPathname || !newPathname) throw new Error("Blob move requires old and new pathnames.")
	if (oldPathname === newPathname) throw new Error("Blob move requires different old and new pathnames.")

	const copied = await copy(oldPathname, newPathname, {
		access: "public",
	})

	return {
		oldPathname,
		newPathname: copied.pathname,
		newUrl: copied.url,
	}
}

export async function deletePublicBlobObjectBestEffort(pathnameOrUrl: string): Promise<boolean> {
	try {
		await del(pathnameOrUrl)
		return true
	} catch (error) {
		if (!isMissingBlobError(error)) warnBlobMoveCleanupFailure(error)
		return false
	}
}
