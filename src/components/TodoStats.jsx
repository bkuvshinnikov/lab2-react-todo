function TodoStats({ todos }) {
  const total = todos.length
  const active = todos.filter(todo => !todo.completed).length
  const completed = todos.filter(todo => todo.completed).length

  return (
    <div className="stats">
      <span>Total: {total}</span>
      <span>Active: {active}</span>
      <span>Completed: {completed}</span>
    </div>
  )
}

export default TodoStats