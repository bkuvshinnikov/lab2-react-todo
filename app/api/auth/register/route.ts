import { MongoServerError } from 'mongodb'
import { hashPassword } from '@/lib/passwords'
import { getUsersCollection } from '@/lib/users'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return Response.json({ error: 'Content-Type must be application/json.' }, { status: 415 })
  }

  let body: unknown
  try {
    const text = await request.text()
    if (Buffer.byteLength(text, 'utf8') > 8192) {
      return Response.json({ error: 'Request body is too large.' }, { status: 413 })
    }
    body = JSON.parse(text)
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return Response.json({ error: 'Expected a JSON object.' }, { status: 400 })
  }

  const input = body as Record<string, unknown>
  if (typeof input.name !== 'string' || typeof input.email !== 'string' || typeof input.password !== 'string') {
    return Response.json({ error: 'Name, email and password must be strings.' }, { status: 400 })
  }

  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  // Passwords are not trimmed or normalized: spaces can be intentional.
  const password = input.password
  if (name.length === 0 || name.length > 100) {
    return Response.json({ error: 'Name must contain 1–100 characters.' }, { status: 400 })
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }
  const passwordLength = Array.from(password).length
  if (passwordLength < 15 || passwordLength > 128) {
    return Response.json({ error: 'Password must contain 15–128 characters.' }, { status: 400 })
  }

  try {
    const users = await getUsersCollection()
    const passwordHash = await hashPassword(password)
    const createdAt = new Date()
    // The unique index, rather than a separate existence check, protects against
    // duplicate email registrations even when requests arrive simultaneously.
    const result = await users.insertOne({ name, email, passwordHash, createdAt })

    return Response.json({
      user: { id: result.insertedId.toHexString(), name, email, createdAt: createdAt.toISOString() },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return Response.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    // Do not expose database errors, credentials, or password hashes.
    return Response.json({ error: 'Unable to register. Please try again later.' }, { status: 500 })
  }
}
