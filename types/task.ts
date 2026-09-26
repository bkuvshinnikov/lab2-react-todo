export type Priority = 'low' | 'medium' | 'high'
export type Category = string
export type TaskFilter = 'all' | 'active' | 'completed'
export type CategoryFilter = 'all' | Category
export type SortBy = 'default' | 'newest' | 'oldest' | 'priority-high' | 'priority-low' | 'due-date'
export type Theme = 'light' | 'dark'

export interface Task {
  id: string
  text: string
  completed: boolean
  priority?: Priority
  category?: Category
  dueDate?: string
  createdAt?: string
}
