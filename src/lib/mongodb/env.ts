export interface MongoEnv {
	uri: string
	dbName: string
	collectionName: string
}

export function getMongoEnv(): MongoEnv {
	const uri = process.env.MONGODB_URI?.trim()
	if (!uri) {
		throw new Error("Missing MONGODB_URI. Add it to .env or .env.local.")
	}

	const dbName = process.env.MONGODB_DB?.trim() || "jayco"
	const collectionName = process.env.MONGODB_COLLECTION?.trim() || "product_mdx"

	return { uri, dbName, collectionName }
}
