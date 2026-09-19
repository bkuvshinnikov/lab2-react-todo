import { useEffect, useState } from 'react'

function App() {
  const [task, setTask] = useState('')
  const [filter, setFilter] = useState('all')

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
    }

    setTodos([...todos, newTodo])
    setTask('')
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
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />

            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>

            <button
              className="delete-button"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
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