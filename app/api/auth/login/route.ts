import { cookies } from 'next/headers'
import { getUsersCollection } from '@/lib/users'
import { verifyPassword } from '@/lib/passwords'
import { createSession, SESSION_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return Response.json({ error: 'Content-Type must be application/json.' }, { status: 415 })
  let body: unknown
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return Response.json({ error: 'Expected a JSON object.' }, { status: 400 })
  const input = body as Record<string, unknown>
  if (typeof input.email !== 'string' || typeof input.password !== 'string') return Response.json({ error: 'Email and password must be strings.' }, { status: 400 })
  const email = input.email.trim().toLowerCase()
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || Array.from(input.password).length > 128) return Response.json({ error: 'Invalid email or password.' }, { status: 400 })
  try {
    const users = await getUsersCollection()
    const user = await users.findOne({ email })
    if (!user || !await verifyPassword(input.password, user.passwordHash)) return Response.json({ error: 'Invalid email or password.' }, { status: 401 })
    const { token, expiresAt } = await createSession(user._id)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: expiresAt })
    return Response.json({ user: { id: user._id.toHexString(), name: user.name, email: user.email } })
  } catch { return Response.json({ error: 'Unable to log in. Please try again later.' }, { status: 500 }) }
}
