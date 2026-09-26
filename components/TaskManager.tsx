'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TodoForm from './TodoForm'
import TodoItem from './TodoItem'
import TodoControls from './TodoControls'
import TodoStats from './TodoStats'

import type { Task, Priority, Category, TaskFilter, CategoryFilter, SortBy, Theme } from '@/types/task'

function TaskManager({ user }: { user: { name: string; email: string } }) {
  const router = useRouter()
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState<Category>('work')
  const [dueDate, setDueDate] = useState('')

  const [filter, setFilter] = useState<TaskFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('default')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [editingPriority, setEditingPriority] = useState<Priority>('medium')
  const [editingCategory, setEditingCategory] = useState<Category>('work')
  const [editingDueDate, setEditingDueDate] = useState('')

  const [theme, setTheme] = useState<Theme>('dark')
  const [todos, setTodos] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>(['work', 'study', 'personal'])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const savedTheme = localStorage.getItem('theme')
      setTheme(savedTheme === 'light' ? 'light' : 'dark')
      fetch('/api/tasks', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject(new Error('Could not load tasks.'))).then(data => setTodos(data.tasks)).catch(error => console.warn(error))
      fetch('/api/categories', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject(new Error('Could not load categories.'))).then(data => setCategories(data.categories)).catch(error => console.warn(error))
    } catch (error) {
      console.warn('Could not load saved tasks or theme.', error)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.warn('Could not save theme.', error)
    }
  }, [theme])

  const addTodo = async () => {
    if (task.trim() === '') {
      return
    }

    const response = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: task, priority, category, dueDate }) })
    if (!response.ok) return
    const { task: newTodo } = await response.json()
    setTodos(current => [newTodo, ...current])

    setTask('')
    setPriority('medium')
    setCategory('work')
    setDueDate('')
  }

  const deleteTodo = async (id: string) => {
    if ((await fetch(`/api/tasks/${id}`, { method: 'DELETE' })).ok) setTodos(current => current.filter(todo => todo.id !== id))
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find(item => item.id === id); if (!todo) return
    const response = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !todo.completed }) })
    if (response.ok) setTodos(current => current.map(item => item.id === id ? { ...item, completed: !item.completed } : item))
  }

  const startEditing = (todo: Task) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
    setEditingPriority(todo.priority || 'medium')
    setEditingCategory(todo.category || 'work')
    setEditingDueDate(todo.dueDate || '')
  }

  const saveEdit = async (id: string) => {
    if (editingText.trim() === '') {
      return
    }

    const response = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: editingText, priority: editingPriority, category: editingCategory, dueDate: editingDueDate }) })
    if (response.ok) setTodos(current => current.map(todo => todo.id === id ? { ...todo, text: editingText.trim(), priority: editingPriority, category: editingCategory, dueDate: editingDueDate } : todo))

    cancelEdit()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
    setEditingPriority('medium')
    setEditingCategory('work')
    setEditingDueDate('')
  }

  const clearCompleted = async () => {
    const response = await fetch('/api/tasks', { method: 'DELETE' })
    if (response.ok) setTodos(current => current.filter(todo => !todo.completed))
  }

  const isOverdue = (todo: Task) => {
    if (!todo.dueDate || todo.completed) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadline = new Date(`${todo.dueDate}T00:00:00`)

    return deadline < today
  }

  const getPriorityValue = (priorityValue: Priority) => {
    if (priorityValue === 'high') return 3
    if (priorityValue === 'medium') return 2
    return 1
  }

  let visibleTodos = todos.filter(todo => {
    if (filter === 'active' && todo.completed) {
      return false
    }

    if (filter === 'completed' && !todo.completed) {
      return false
    }

    if (
      categoryFilter !== 'all' &&
      (todo.category || 'work') !== categoryFilter
    ) {
      return false
    }

    return todo.text
      .toLowerCase()
      .includes(search.toLowerCase())
  })

  visibleTodos = [...visibleTodos].sort((a, b) => {
    if (sortBy === 'priority-high') {
      return (
        getPriorityValue(b.priority || 'medium') -
        getPriorityValue(a.priority || 'medium')
      )
    }

    if (sortBy === 'priority-low') {
      return (
        getPriorityValue(a.priority || 'medium') -
        getPriorityValue(b.priority || 'medium')
      )
    }

    if (sortBy === 'due-date') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    if (sortBy === 'newest') {
      return (b.createdAt || '').localeCompare(a.createdAt || '')
    }

    if (sortBy === 'oldest') {
      return (a.createdAt || '').localeCompare(b.createdAt || '')
    }

    return 0
  })

  return (
    <div className={`app-container ${theme}`}>
      <main className="todo-app">
        <header className="header">
          <div className="brand">
            <div className="brand-icon">✓</div>

            <div>
              <span className="eyebrow">
                PRODUCTIVITY DASHBOARD
              </span>

              <h1>Task Manager</h1>

              <p className="subtitle">
                Organize your day. Focus on what matters.
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="theme-button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <span className="theme-icon">{theme === 'light' ? '☾' : '☀'}</span>
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <span className="user-name">{user.name}</span>
            <button className="logout-button" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); router.refresh() }}>Log out</button>
          </div>
        </header>

        <section className="dashboard-section">
          <TodoStats todos={todos} />
        </section>

        <section className="glass-panel create-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">NEW TASK</span>
              <h2>Create something</h2>
            </div>

            <span className="keyboard-hint">
              Press Enter ↵
            </span>
          </div>

          <TodoForm
            task={task}
            setTask={setTask}
            priority={priority}
            setPriority={setPriority}
            category={category}
            setCategory={setCategory}
            dueDate={dueDate}
            setDueDate={setDueDate}
            addTodo={addTodo}
            categories={categories}
          />
        </section>

        <section className="glass-panel controls-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">WORKSPACE</span>
              <h2>Your tasks</h2>
            </div>

            <span className="task-count">
              {visibleTodos.length} visible
            </span>
          </div>

          <TodoControls
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={todos.some(todo => todo.completed)}
            clearCompleted={clearCompleted}
            categories={categories}
          />
        </section>

        <section className="tasks-section">
          <ul>
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editingId={editingId}
                editingText={editingText}
                setEditingText={setEditingText}
                editingPriority={editingPriority}
                setEditingPriority={setEditingPriority}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
                editingDueDate={editingDueDate}
                setEditingDueDate={setEditingDueDate}
                toggleTodo={toggleTodo}
                startEditing={startEditing}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
                deleteTodo={deleteTodo}
                isOverdue={isOverdue}
                categories={categories}
              />
            ))}
          </ul>

          {visibleTodos.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✓</div>

              <h3>Nothing here yet</h3>

              <p>
                Create a task or change your filters.
              </p>
            </div>
          )}
        </section>

        <footer className="footer">
          <span>React Task Manager</span>
          <span>•</span>
          <span>Local-first productivity</span>
        </footer>
      </main>
    </div>
  )
}

export default TaskManager
