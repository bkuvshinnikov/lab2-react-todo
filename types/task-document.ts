import type { ObjectId } from 'mongodb'
import type { Category, Priority } from '@/types/task'

export interface TaskDocument {
  _id: ObjectId
  userId: ObjectId
  text: string
  completed: boolean
  priority: Priority
  category: Category
  dueDate: string
  createdAt: Date
  updatedAt: Date
}
