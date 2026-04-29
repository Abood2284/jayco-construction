import bcrypt from "bcryptjs"
import { config as loadEnv } from "dotenv"
import { createInterface } from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

import { ensureAdminMongoIndexes, getAdminUsersCollection } from "../src/lib/admin/mongo"

loadEnv({ path: ".env.local" })
loadEnv({ path: ".env" })

interface Args {
	email?: string
	username?: string
	name?: string
	password?: string
}

function parseArgs(argv: string[]): Args {
	const args: Args = {}
	for (let index = 0; index < argv.length; index += 1) {
		const current = argv[index]
		const next = argv[index + 1]
		if (!current.startsWith("--")) continue
		if (!next || next.startsWith("--")) continue
		if (current === "--email") args.email = next
		if (current === "--username") args.username = next
		if (current === "--name") args.name = next
		if (current === "--password") args.password = next
		index += 1
	}
	return args
}

async function promptForPassword(): Promise<string> {
	const terminal = createInterface({ input, output })
	try {
		return await terminal.question("Password: ")
	} finally {
		terminal.close()
	}
}

async function main() {
	const args = parseArgs(process.argv.slice(2))
	const email = args.email?.trim().toLowerCase()
	const username = args.username?.trim().toLowerCase()
	const name = args.name?.trim() || undefined
	const password = args.password ?? (await promptForPassword())

	if (!email) throw new Error("Pass --email admin@example.com")
	if (!username) throw new Error("Pass --username admin")
	if (!password || password.length < 12) throw new Error("Admin password must be at least 12 characters")
	if (args.password) {
		console.warn("Password was passed as a CLI argument and may be stored in shell history.")
	}

	await ensureAdminMongoIndexes()

	const users = await getAdminUsersCollection()
	const passwordHash = await bcrypt.hash(password, 12)
	const now = new Date()
	const existingUser = await users.findOne({ $or: [{ email }, { username }] })

	if (existingUser) {
		await users.updateOne(
			{ _id: existingUser._id },
			{
				$set: {
					email,
					username,
					...(name ? { name } : {}),
					passwordHash,
					status: "ACTIVE",
					updatedAt: now,
				},
				...(!name ? { $unset: { name: "" } } : {}),
			},
		)
	} else {
		await users.insertOne({
			email,
			username,
			...(name ? { name } : {}),
			passwordHash,
			role: "SUPER_ADMIN",
			status: "ACTIVE",
			createdAt: now,
			updatedAt: now,
		})
	}

	console.info("Admin user ready:")
	console.info(`email: ${email}`)
	console.info(`username: ${username}`)
	console.info(`role: ${existingUser?.role ?? "SUPER_ADMIN"}`)
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error)
	process.exit(1)
})
