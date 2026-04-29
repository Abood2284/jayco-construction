import { config as loadEnv } from "dotenv"

import { ensureAdminMongoIndexes } from "../src/lib/admin/mongo"

loadEnv({ path: ".env.local" })
loadEnv({ path: ".env" })

async function main() {
	await ensureAdminMongoIndexes()
	console.info("Admin MongoDB indexes are ready.")
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error)
	process.exit(1)
})
