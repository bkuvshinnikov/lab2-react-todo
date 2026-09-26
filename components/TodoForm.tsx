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
  )
}

export default TodoForm
