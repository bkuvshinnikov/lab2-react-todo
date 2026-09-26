import 'server-only'
import type { OptionalId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import type { User } from '@/types/user'

export async function getUsersCollection() {
  const db = await getDatabase()
  // MongoDB generates _id on insert; returned documents include an ObjectId.
  const users = db.collection<OptionalId<User>>('users')

  // Idempotent: an existing identical index is reused. Await it before writes
  // so concurrent registrations cannot create duplicate normalized emails.
  await users.createIndex({ email: 1 }, { unique: true, name: 'users_email_unique' })

  return users
}
