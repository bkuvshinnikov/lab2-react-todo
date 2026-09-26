import { getCurrentUser } from '@/lib/auth'
import { getTasksCollection } from '@/lib/tasks'
import type { Category, Priority } from '@/types/task'

export const runtime = 'nodejs'
const priorities: Priority[] = ['low', 'medium', 'high']
const categories: Category[] = ['work', 'study', 'personal']

function responseTask(task: { _id: { toHexString(): string }; text: string; completed: boolean; priority: Priority; category: Category; dueDate: string; createdAt: Date }) { return { id: task._id.toHexString(), text: task.text, completed: task.completed, priority: task.priority, category: task.category, dueDate: task.dueDate, createdAt: task.createdAt.toISOString() } }

async function body(request: Request) { try { return await request.json() as Record<string, unknown> } catch { return null } }

export async function GET() {
  const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const tasks = await getTasksCollection(); const items = await tasks.find({ userId: user._id }).sort({ createdAt: -1 }).toArray()
  return Response.json({ tasks: items.map(responseTask) }, { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function POST(request: Request) {
  const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const input = await body(request)
  if (!input || typeof input.text !== 'string' || !input.text.trim() || input.text.trim().length > 500) return Response.json({ error: 'Task text must contain 1–500 characters.' }, { status: 400 })
  const priority = priorities.includes(input.priority as Priority) ? input.priority as Priority : 'medium'
  const category = categories.includes(input.category as Category) ? input.category as Category : 'work'
  const dueDate = typeof input.dueDate === 'string' ? input.dueDate : ''
  const now = new Date(); const result = await (await getTasksCollection()).insertOne({ userId: user._id, text: input.text.trim(), completed: false, priority, category, dueDate, createdAt: now, updatedAt: now })
  return Response.json({ task: responseTask({ _id: result.insertedId, text: input.text.trim(), completed: false, priority, category, dueDate, createdAt: now }) }, { status: 201 })
}

export async function DELETE() {
  const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const result = await (await getTasksCollection()).deleteMany({ userId: user._id, completed: true })
  return Response.json({ deletedCount: result.deletedCount })
}
