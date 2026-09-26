import type { Task } from '@/types/task'

interface TodoStatsProps {
  todos: Task[]
}

function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length
  const completed = todos.filter(todo => todo.completed).length
  const active = total - completed

  const completion =
    total === 0
      ? 0
      : Math.round((completed / total) * 100)

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon total-icon">
          ◈
        </div>

        <div>
          <span className="stat-label">
            Total tasks
          </span>

          <strong>{total}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon active-icon">
          ↗
        </div>

        <div>
          <span className="stat-label">
            Active
          </span>

          <strong>{active}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon completed-icon">
          ✓
        </div>

        <div>
          <span className="stat-label">
            Completed
          </span>

          <strong>{completed}</strong>
        </div>
      </div>

      <div className="stat-card progress-card">
        <div className="progress-info">
          <span className="stat-label">
            Progress
          </span>

          <strong>{completion}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{
              width: `${completion}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default TodoStats
