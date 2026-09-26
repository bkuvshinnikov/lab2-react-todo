import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import type { OptionalId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import type { Session } from '@/types/auth'

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
