import 'server-only'
import type { OptionalId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import type { TaskDocument } from '@/types/task-document'

export async function getTasksCollection() {
  const collection = (await getDatabase()).collection<OptionalId<TaskDocument>>('tasks')
  await collection.createIndex({ userId: 1, createdAt: -1 }, { name: 'tasks_user_created' })
  return collection
}
