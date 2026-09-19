import { useEffect, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import TodoControls from './components/TodoControls'
import TodoStats from './components/TodoStats'

function App() {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('work')
  const [dueDate, setDueDate] = useState('')

  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingPriority, setEditingPriority] = useState('medium')
  const [editingCategory, setEditingCategory] = useState('work')
  const [editingDueDate, setEditingDueDate] = useState('')

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const addTodo = () => {
    if (task.trim() === '') {
      return
    }

    const newTodo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      priority,
      category,
      dueDate,
    }

    setTodos([...todos, newTodo])

    setTask('')
    setPriority('medium')
    setCategory('work')
    setDueDate('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
    setEditingPriority(todo.priority || 'medium')
    setEditingCategory(todo.category || 'work')
    setEditingDueDate(todo.dueDate || '')
  }

  const saveEdit = (id) => {
    if (editingText.trim() === '') {
      return
    }

    setTodos(
      todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              text: editingText.trim(),
              priority: editingPriority,
              category: editingCategory,
              dueDate: editingDueDate,
            }
          : todo
      )
    )

    cancelEdit()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
    setEditingPriority('medium')
    setEditingCategory('work')
    setEditingDueDate('')
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const isOverdue = (todo) => {
    if (!todo.dueDate || todo.completed) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadline = new Date(`${todo.dueDate}T00:00:00`)

    return deadline < today
  }

  const getPriorityValue = (priorityValue) => {
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

      return new Date(a.dueDate) - new Date(b.dueDate)
    }

    if (sortBy === 'newest') {
      return b.id - a.id
    }

    if (sortBy === 'oldest') {
      return a.id - b.id
    }

    return 0
  })

  const themeStyles =
    theme === 'dark'
      ? {
          '--page-bg': '#121212',
          '--panel-bg': '#1e1e1e',
          '--item-bg': '#292929',
          '--input-bg': '#2b2b2b',
          '--text-color': '#eeeeee',
          '--secondary-text': '#aaaaaa',
          '--border-color': '#555555',
          '--stats-border': '#3a3a3a',
          '--default-button': '#444444',
          '--filter-button': '#555555',
          '--active-filter': '#888888',
          '--shadow': 'rgba(0, 0, 0, 0.4)',
        }
      : {
          '--page-bg': '#f3f4f6',
          '--panel-bg': '#ffffff',
          '--item-bg': '#f8f8f8',
          '--input-bg': '#ffffff',
          '--text-color': '#222222',
          '--secondary-text': '#777777',
          '--border-color': '#dddddd',
          '--stats-border': '#eeeeee',
          '--default-button': '#222222',
          '--filter-button': '#777777',
          '--active-filter': '#222222',
          '--shadow': 'rgba(0, 0, 0, 0.08)',
        }

  return (
    <div
      className={`app-container ${theme}`}
      style={themeStyles}
    >
      <div className="todo-app">
        <div className="header">
          <h1>Task Manager</h1>

          <button
            className="theme-button"
            onClick={() =>
              setTheme(theme === 'light' ? 'dark' : 'light')
            }
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
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
        />

        <TodoStats todos={todos} />

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
        />

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
            />
          ))}
        </ul>

        {visibleTodos.length === 0 && (
          <p className="empty-message">
            No tasks found.
          </p>
        )}
      </div>
    </div>
  )
}

export default App