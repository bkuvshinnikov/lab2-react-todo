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
}) {
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
            setCategoryFilter(event.target.value)
          }
        >
          <option value="all">All categories</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
        </select>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
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