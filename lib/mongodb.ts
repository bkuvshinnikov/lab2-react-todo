import 'server-only'
import { MongoClient } from 'mongodb'

type MongoCache = {
  promise?: Promise<MongoClient>
}

// Keep one connection pool per server process, including development hot reloads.
const globalForMongo = globalThis as typeof globalThis & {
  taskManagerMongo?: MongoCache
}
const cache = (globalForMongo.taskManagerMongo ??= {})

export async function getMongoClient(): Promise<MongoClient> {
  if (!cache.promise) {
    const uri = process.env.MONGODB_URI?.trim()
    if (!uri) {
      throw new Error('Set MONGODB_URI in .env.local before connecting to MongoDB.')
    }
    if (!/^mongodb(?:\+srv)?:\/\//.test(uri) || /[<>]/.test(uri)) {
      throw new Error('MONGODB_URI must be a MongoDB connection string with all placeholders replaced.')
    }

    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    })

    // Concurrent requests share the same promise. Allow retries after a failure.
    cache.promise = client.connect().catch(async (error: unknown) => {
      try {
        await client.close()
      } finally {
        cache.promise = undefined
      }
      throw error
    })
  }

  return cache.promise
}

export async function getDatabase() {
  const name = process.env.MONGODB_DB?.trim()
  if (!name) {
    throw new Error('Set MONGODB_DB in .env.local before selecting a database.')
  }
  const client = await getMongoClient()
  return client.db(name)
}
