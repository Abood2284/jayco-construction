import { neon } from "@neondatabase/serverless"

type NeonSql = ReturnType<typeof neon>

let cachedSql: NeonSql | null = null

/**
 * Serverless / edge-friendly SQL client for Neon Postgres.
 * Uses `DATABASE_URL` from the environment (pooled URI recommended).
 *
 * Neon project: `young-math-54820541` · org: `org-spring-sunset-28623562`
 * Console: https://console.neon.tech/app/projects/young-math-54820541
 */
export function getNeonSql(): NeonSql {
	const url = process.env.DATABASE_URL
	if (!url?.trim()) {
		throw new Error(
			"DATABASE_URL is not set. Copy .env.example to .env, open the Neon console → Connect, and paste the connection string.",
		)
	}
	cachedSql ??= neon(url.trim())
	return cachedSql
}

export function hasDatabaseUrl(): boolean {
	return Boolean(process.env.DATABASE_URL?.trim())
}

/** Example health check — use from a Server Component or Route Handler with `dynamic = 'force-dynamic'`. */
export async function getPostgresVersion(): Promise<string> {
	const sql = getNeonSql()
	const rows = await sql`SELECT version() AS version`
	if (!Array.isArray(rows) || rows.length === 0) throw new Error("Unexpected response from SELECT version()")
	const version = (rows[0] as { version?: string }).version
	if (typeof version !== "string") throw new Error("Unexpected response from SELECT version()")
	return version
}
