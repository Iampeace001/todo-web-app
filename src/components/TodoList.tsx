import TodoItem from './TodoItem'
import type { Todo, TodoFilter } from '../types/todo'

interface TodoListProps {
  todos: Todo[]
  filter: TodoFilter
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const emptyMessages: Record<TodoFilter, string> = {
  all: 'Nothing on your list yet. Add a task to get started.',
  active: 'You’re all caught up. No active tasks.',
  completed: 'Completed tasks will show up here.',
}

function TodoList({ todos, filter, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="empty-state" role="status">
        {emptyMessages[filter]}
      </p>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          onDelete={onDelete}
          onToggle={onToggle}
          todo={todo}
        />
      ))}
    </ul>
  )
}

export default TodoList
