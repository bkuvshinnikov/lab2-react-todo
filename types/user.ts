import type { ObjectId } from 'mongodb'

// Database document, not an API response: never expose passwordHash to clients.
export interface User {
  _id: ObjectId
  name: string
  // Store email trimmed and lowercased when registration is implemented.
  email: string
  passwordHash: string
  createdAt: Date
}
