import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  compact?: boolean
}

function formatDueDate(todo: Todo) {
  if (!todo.dueDate) return null

  const [year, month, day] = todo.dueDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formattedDate = Number.isNaN(date.getTime())
    ? todo.dueDate
    : new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
      }).format(date)

  return `${formattedDate}${todo.dueTime ? ` · ${todo.dueTime}` : ''}`
}

function TodoItem({ todo, onToggle, onDelete, compact = false }: TodoItemProps) {
  const dueLabel = compact ? todo.dueTime : formatDueDate(todo)

  return (
    <li
      className={[
        'todo-item',
        todo.completed && 'is-completed',
        compact && 'agenda-task',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label className="todo-label">
        <input
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          type="checkbox"
        />
        <span className="checkbox-mark" aria-hidden="true" />
        <span className="todo-content">
          <span className="todo-title">{todo.title}</span>
          {dueLabel && (
            <span className={compact ? 'todo-due agenda-time' : 'todo-due'}>
              {dueLabel}
            </span>
          )}
        </span>
      </label>
      <button
        aria-label={`Delete ${todo.title}`}
        className="delete-button"
        onClick={() => onDelete(todo.id)}
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  )
}

export default TodoItem
