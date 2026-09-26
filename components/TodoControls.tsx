import type { CategoryFilter, SortBy, TaskFilter } from '@/types/task'

interface TodoControlsProps {
  search: string
  setSearch: (value: string) => void
  categoryFilter: CategoryFilter
  setCategoryFilter: (value: CategoryFilter) => void
  sortBy: SortBy
  setSortBy: (value: SortBy) => void
  filter: TaskFilter
  setFilter: (value: TaskFilter) => void
  hasCompleted: boolean
  clearCompleted: () => void
  categories: string[]
}

function TodoControls({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  filter,
  setFilter,
  hasCompleted,
  clearCompleted,
  categories,
}: TodoControlsProps) {
  return (
    <>
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
            setCategoryFilter(event.target.value as CategoryFilter)
          }
        >
          <option value="all">All categories</option>
          {categories.map(item => <option key={item} value={item}>{item}</option>)}
        </select>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortBy)}
        >
          <option value="default">
            Default order
          </option>

          <option value="newest">
            Newest first
          </option>

          <option value="oldest">
            Oldest first
          </option>

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
            className={
              filter === 'all'
                ? 'active-filter'
                : ''
            }
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={
              filter === 'active'
                ? 'active-filter'
                : ''
            }
            onClick={() => setFilter('active')}
          >
            Active
          </button>

          <button
            className={
              filter === 'completed'
                ? 'active-filter'
                : ''
            }
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {hasCompleted && (
          <button
            className="clear-button"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </>
  )
}

export default TodoControls
