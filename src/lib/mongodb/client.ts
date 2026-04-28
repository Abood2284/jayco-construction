import { MongoClient } from "mongodb"

import { getMongoEnv } from "@/lib/mongodb/env"

let clientPromise: Promise<MongoClient> | null = null

export function getMongoClient(): Promise<MongoClient> {
	if (!clientPromise) {
		const { uri } = getMongoEnv()
		const client = new MongoClient(uri)
		clientPromise = client.connect().catch((error) => {
			// Avoid locking the process to a permanently rejected promise after transient failures.
			clientPromise = null
			throw error
		})
	}
	return clientPromise
}
