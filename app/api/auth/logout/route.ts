import { cookies } from 'next/headers'
import { getSessionsCollection, hashSessionToken, SESSION_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    try { await (await getSessionsCollection()).deleteOne({ tokenHash: hashSessionToken(token) }) } catch { /* logout remains successful */ }
  }
  cookieStore.delete(SESSION_COOKIE)
  return Response.json({ ok: true })
}
