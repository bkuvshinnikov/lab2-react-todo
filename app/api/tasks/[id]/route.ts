import { ObjectId } from 'mongodb'
import { getCurrentUser } from '@/lib/auth'
import { getTasksCollection } from '@/lib/tasks'

export const runtime = 'nodejs'
async function target(id: string) { return ObjectId.isValid(id) ? new ObjectId(id) : null }

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const id = await target((await params).id); if (!id) return Response.json({ error: 'Invalid task id.' }, { status: 400 })
  let input: Record<string, unknown>; try { input = await request.json() } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  const update: Record<string, unknown> = { updatedAt: new Date() }
  if (typeof input.text === 'string' && input.text.trim()) update.text = input.text.trim()
  if (typeof input.completed === 'boolean') update.completed = input.completed
  if (['low', 'medium', 'high'].includes(String(input.priority))) update.priority = input.priority
  if (['work', 'study', 'personal'].includes(String(input.category))) update.category = input.category
  if (typeof input.dueDate === 'string') update.dueDate = input.dueDate
  const result = await (await getTasksCollection()).findOneAndUpdate({ _id: id, userId: user._id }, { $set: update }, { returnDocument: 'after' })
  return result ? Response.json({ task: { ...result, id: result._id.toHexString(), _id: undefined } }) : Response.json({ error: 'Task not found.' }, { status: 404 })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const id = await target((await params).id); if (!id) return Response.json({ error: 'Invalid task id.' }, { status: 400 })
  const result = await (await getTasksCollection()).deleteOne({ _id: id, userId: user._id })
  return result.deletedCount ? Response.json({ ok: true }) : Response.json({ error: 'Task not found.' }, { status: 404 })
}
