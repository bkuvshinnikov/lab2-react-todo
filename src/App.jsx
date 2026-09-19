import { useEffect, useState } from 'react'

function App() {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingPriority, setEditingPriority] = useState('medium')
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
      dueDate,
    }

    setTodos([...todos, newTodo])
    setTask('')
    setPriority('medium')
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
              dueDate: editingDueDate,
            }
          : todo
      )
    )

    setEditingId(null)
    setEditingText('')
    setEditingPriority('medium')
    setEditingDueDate('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
    setEditingPriority('medium')
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

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed
    }

    if (filter === 'completed') {
      return todo.completed
    }

    return true
  })

  return (
    <div className="todo-app">
      <h1>React Todo App</h1>

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

        <input
          className="date-input"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />

        <button onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="stats">
        Total: {todos.length} | Completed:{' '}
        {todos.filter(todo => todo.completed).length}
      </div>

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

      <ul>
        {filteredTodos.map(todo => (
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

      {filteredTodos.length === 0 && (
        <p className="empty-message">
          No tasks found.
        </p>
      )}
    </div>
  )
}

export default App