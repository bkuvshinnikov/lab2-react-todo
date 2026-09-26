import type { Priority, Category } from '@/types/task'

interface TodoFormProps {
  task: string
  setTask: (value: string) => void
  priority: Priority
  setPriority: (value: Priority) => void
  category: Category
  setCategory: (value: Category) => void
  dueDate: string
  setDueDate: (value: string) => void
  addTodo: () => void
  categories: Category[]
}

function TodoForm({
  task,
  setTask,
  priority,
  setPriority,
  category,
  setCategory,
  dueDate,
  setDueDate,
  addTodo,
  categories,
}: TodoFormProps) {
  return (
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
        onChange={(event) => setPriority(event.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={category}
        onChange={(event) => setCategory(event.target.value as Category)}
      >
        {categories.map(item => <option key={item} value={item}>{item}</option>)}
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
  )
}

export default TodoForm
