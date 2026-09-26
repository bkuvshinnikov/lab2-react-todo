import { MongoServerError } from 'mongodb'
import { getCurrentUser } from '@/lib/auth'
import { getCategoriesCollection } from '@/lib/categories'

export const runtime = 'nodejs'
const defaults = ['work', 'study', 'personal']
export async function GET() {
  const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const collection = await getCategoriesCollection()
  for (const name of defaults) await collection.updateOne({ userId: user._id, name }, { $setOnInsert: { userId: user._id, name, createdAt: new Date() } }, { upsert: true })
  const categories = await collection.find({ userId: user._id }).sort({ createdAt: 1 }).toArray()
  return Response.json({ categories: categories.map(item => item.name) }, { headers: { 'Cache-Control': 'private, no-store' } })
}
export async function POST(request: Request) {
  const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  let input: { name?: unknown }; try { input = await request.json() } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  const name = typeof input.name === 'string' ? input.name.trim().toLowerCase() : ''
  if (!name || name.length > 40) return Response.json({ error: 'Category must contain 1–40 characters.' }, { status: 400 })
  try { await (await getCategoriesCollection()).insertOne({ userId: user._id, name, createdAt: new Date() }); return Response.json({ category: name }, { status: 201 }) } catch (error) { if (error instanceof MongoServerError && error.code === 11000) return Response.json({ error: 'Category already exists.' }, { status: 409 }); return Response.json({ error: 'Unable to create category.' }, { status: 500 }) }
}
