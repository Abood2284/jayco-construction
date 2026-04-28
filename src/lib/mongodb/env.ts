export interface MongoEnv {
	uri: string
	dbName: string
}

export function getMongoEnv(): MongoEnv {
	const uri = process.env.MONGODB_URI?.trim()
	if (!uri) {
		throw new Error("Missing MONGODB_URI. Add it to .env or .env.local.")
	}

	const dbName = process.env.MONGODB_DB?.trim() || "jayco"

	return { uri, dbName }
}
