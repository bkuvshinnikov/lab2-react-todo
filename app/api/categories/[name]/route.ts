import { getCurrentUser } from '@/lib/auth'
import { getCategoriesCollection } from '@/lib/categories'
import { getTasksCollection } from '@/lib/tasks'
import { MongoServerError } from 'mongodb'

export const runtime = 'nodejs'

export async function DELETE(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const user = await getCurrentUser()
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const name = decodeURIComponent((await params).name).trim().toLowerCase()
  if (!name) return Response.json({ error: 'Invalid category.' }, { status: 400 })
  const result = await (await getCategoriesCollection()).deleteOne({ userId: user._id, name })
  return result.deletedCount ? Response.json({ ok: true }) : Response.json({ error: 'Category not found.' }, { status: 404 })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const user = await getCurrentUser()
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const oldName = decodeURIComponent((await params).name).trim().toLowerCase()
  let input: { name?: unknown }
  try { input = await request.json() } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  const newName = typeof input.name === 'string' ? input.name.trim().toLowerCase() : ''
  if (!oldName || !newName || newName.length > 40) return Response.json({ error: 'Category must contain 1–40 characters.' }, { status: 400 })
  try {
    const categories = await getCategoriesCollection()
    const result = await categories.updateOne({ userId: user._id, name: oldName }, { $set: { name: newName } })
    if (!result.matchedCount) return Response.json({ error: 'Category not found.' }, { status: 404 })
    await (await getTasksCollection()).updateMany({ userId: user._id, category: oldName }, { $set: { category: newName, updatedAt: new Date() } })
    return Response.json({ category: newName })
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return Response.json({ error: 'Category already exists.' }, { status: 409 })
    return Response.json({ error: 'Unable to rename category.' }, { status: 500 })
  }
}
