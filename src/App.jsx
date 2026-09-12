import { useEffect, useState } from 'react'

function App() {
  const [task, setTask] = useState('')

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
      text: task,
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

  return (
    <div>
      <h1>React Todo App</h1>

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

      <p>
        Total: {todos.length} | Completed:{' '}
        {todos.filter(todo => todo.completed).length}
      </p>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />

            <span
              style={{
                textDecoration: todo.completed
                  ? 'line-through'
                  : 'none',
              }}
            >
              {todo.text}
            </span>

            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App