import { MongoClient, type Collection } from "mongodb"

import { getMongoEnv } from "@/lib/mongodb/env"
import type { ProductMdxDocument } from "@/lib/mongodb/product-mdx-document"

let clientPromise: Promise<MongoClient> | null = null

export function getMongoClient(): Promise<MongoClient> {
	if (!clientPromise) {
		const { uri } = getMongoEnv()
		const client = new MongoClient(uri)
		clientPromise = client.connect()
	}
	return clientPromise
}

export async function getProductMdxCollection(): Promise<Collection<ProductMdxDocument>> {
	const { dbName, collectionName } = getMongoEnv()
	const client = await getMongoClient()
	return client.db(dbName).collection<ProductMdxDocument>(collectionName)
}
