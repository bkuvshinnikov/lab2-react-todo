import { useState } from 'react'

function App() {
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState([])

  const addTodo = () => {
    if (task.trim() === '') {
      return
    }

    const newTodo = {
      id: Date.now(),
      text: task,
    }

    setTodos([...todos, newTodo])
    setTask('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div>
      <h1>React Todo App</h1>

      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(event) => setTask(event.target.value)}
      />

      <button onClick={addTodo}>
        Add
      </button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}

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