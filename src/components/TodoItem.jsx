function TodoItem({
  todo,
  editingId,
  editingText,
  setEditingText,
  editingPriority,
  setEditingPriority,
  editingCategory,
  setEditingCategory,
  editingDueDate,
  setEditingDueDate,
  toggleTodo,
  startEditing,
  saveEdit,
  cancelEdit,
  deleteTodo,
  isOverdue,
}) {
  return (
    <li className={isOverdue(todo) ? 'overdue-task' : ''}>
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
            onChange={(event) => setEditingText(event.target.value)}
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
            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>

            <div className="task-meta">
              <span
                className={`category ${todo.category || 'work'}`}
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
            className={`priority ${todo.priority || 'medium'}`}
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
  )
}

export default TodoItem