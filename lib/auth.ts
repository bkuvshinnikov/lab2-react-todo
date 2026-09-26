import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import type { OptionalId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import type { Session } from '@/types/auth'
import type { User } from '@/types/user'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'

export const SESSION_COOKIE = 'task_manager_session'
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function getSessionsCollection() {
  const collection = (await getDatabase()).collection<OptionalId<Session>>('sessions')
  await collection.createIndex({ tokenHash: 1 }, { unique: true, name: 'sessions_token_unique' })
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'sessions_expiry' })
  return collection
}

export async function createSession(userId: Session['userId']) {
  const token = randomBytes(32).toString('base64url')
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS)
  const sessions = await getSessionsCollection()
  await sessions.insertOne({ _id: token, userId, tokenHash: hashSessionToken(token), createdAt: now, expiresAt })
  return { token, expiresAt }
}

export async function getCurrentUser(): Promise<Pick<User, '_id' | 'name' | 'email'> | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const sessions = await getSessionsCollection()
  const session = await sessions.findOne({ tokenHash: hashSessionToken(token), expiresAt: { $gt: new Date() } })
  if (!session || !ObjectId.isValid(session.userId)) return null
  const user = await (await getDatabase()).collection<User>('users').findOne({ _id: session.userId })
  return user ? { _id: user._id, name: user.name, email: user.email } : null
}
