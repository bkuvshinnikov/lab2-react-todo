import type { ObjectId } from 'mongodb'

export interface Session {
  _id: string
  userId: ObjectId
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}
