export type Priority = 'low' | 'medium' | 'high'
export type Category = 'work' | 'study' | 'personal'
export type TaskFilter = 'all' | 'active' | 'completed'
export type CategoryFilter = 'all' | Category
export type SortBy = 'default' | 'newest' | 'oldest' | 'priority-high' | 'priority-low' | 'due-date'
export type Theme = 'light' | 'dark'

export interface Task {
  id: number
  text: string
  completed: boolean
  priority?: Priority
  category?: Category
  dueDate?: string
}
