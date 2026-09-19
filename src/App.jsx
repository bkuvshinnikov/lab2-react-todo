import { useEffect, useState } from 'react'

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

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

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

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  return (
    <div className="todo-app">
      <h1>Task Manager</h1>

      <div className="todo-form">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addTodo()
            }
          }}
        />

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />

        <button onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="stats">
        <span>Total: {todos.length}</span>

        <span>
          Active: {todos.filter(todo => !todo.completed).length}
        </span>

        <span>
          Completed: {todos.filter(todo => todo.completed).length}
        </span>
      </div>

      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="category-filter"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="all">All categories</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
        </select>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="default">Default order</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority-high">
            Priority: High to Low
          </option>
          <option value="priority-low">
            Priority: Low to High
          </option>
          <option value="due-date">
            Due date
          </option>
        </select>
      </div>

      <div className="filter-row">
        <div className="filters">
          <button
            className={filter === 'all' ? 'active-filter' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={filter === 'active' ? 'active-filter' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>

          <button
            className={filter === 'completed' ? 'active-filter' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {todos.some(todo => todo.completed) && (
          <button
            className="clear-button"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>

      <ul>
        {visibleTodos.map(todo => (
          <li
            key={todo.id}
            className={isOverdue(todo) ? 'overdue-task' : ''}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />

            {editingId === todo.id ? (
              <>
                <input
                  className="edit-input"
                  type="text"
                  value={editingText}
                  onChange={(event) =>
                    setEditingText(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      saveEdit(todo.id)
                    }

                    if (event.key === 'Escape') {
                      cancelEdit()
                    }
                  }}
                />

                <select
                  className="edit-priority"
                  value={editingPriority}
                  onChange={(event) =>
                    setEditingPriority(event.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <select
                  className="edit-category"
                  value={editingCategory}
                  onChange={(event) =>
                    setEditingCategory(event.target.value)
                  }
                >
                  <option value="work">Work</option>
                  <option value="study">Study</option>
                  <option value="personal">Personal</option>
                </select>

                <input
                  className="edit-date"
                  type="date"
                  value={editingDueDate}
                  onChange={(event) =>
                    setEditingDueDate(event.target.value)
                  }
                />

                <button
                  className="save-button"
                  onClick={() => saveEdit(todo.id)}
                >
                  Save
                </button>

                <button
                  className="cancel-button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="task-content">
                  <span
                    className={todo.completed ? 'completed' : ''}
                  >
                    {todo.text}
                  </span>

                  <div className="task-meta">
                    <span
                      className={`category ${
                        todo.category || 'work'
                      }`}
                    >
                      {todo.category || 'work'}
                    </span>

                    {todo.dueDate && (
                      <span className="due-date">
                        Due: {todo.dueDate}
                      </span>
                    )}

                    {isOverdue(todo) && (
                      <span className="overdue-label">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`priority ${
                    todo.priority || 'medium'
                  }`}
                >
                  {todo.priority || 'medium'}
                </span>

                <button
                  className="edit-button"
                  onClick={() => startEditing(todo)}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {visibleTodos.length === 0 && (
        <p className="empty-message">
          No tasks found.
        </p>
      )}
    </div>
  )
}

export default App