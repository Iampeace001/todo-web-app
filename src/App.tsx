import { useState } from 'react'
import MiniCalendar from './components/MiniCalendar'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import type { Todo, TodoFilter } from './types/todo'
import './App.css'

const STORAGE_KEY = 'todo-web-app.todos'

function loadTodos(): { todos: Todo[]; error: string | null } {
  try {
    const savedTodos = window.localStorage.getItem(STORAGE_KEY)

    if (!savedTodos) {
      return { todos: [], error: null }
    }

    const parsedTodos: unknown = JSON.parse(savedTodos)
    if (
      !Array.isArray(parsedTodos) ||
      !parsedTodos.every(
        (todo): todo is Todo =>
          typeof todo === 'object' &&
          todo !== null &&
          typeof todo.id === 'string' &&
          typeof todo.title === 'string' &&
          typeof todo.completed === 'boolean' &&
          ((typeof todo.dueDate === 'string' &&
            typeof todo.dueTime === 'string') ||
            (todo.dueDate === undefined && todo.dueTime === undefined)),
      )
    ) {
      return { todos: [], error: 'Saved tasks could not be read.' }
    }

    return { todos: parsedTodos, error: null }
  } catch {
    return { todos: [], error: 'Saved tasks could not be loaded.' }
  }
}

function App() {
  const [initialState] = useState(loadTodos)
  const [todos, setTodos] = useState(initialState.todos)
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [storageError, setStorageError] = useState(initialState.error)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })

  function updateTodos(update: (currentTodos: Todo[]) => Todo[]) {
    const updatedTodos = update(todos)
    setTodos(updatedTodos)

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos))
      setStorageError(null)
    } catch {
      setStorageError('Your changes could not be saved in this browser.')
    }
  }

  function addTodo(title: string, dueDate: string, dueTime: string) {
    updateTodos((currentTodos) => [
      { id: crypto.randomUUID(), title, completed: false, dueDate, dueTime },
      ...currentTodos,
    ])
    setSelectedDate(dueDate)
  }

  function toggleTodo(id: string) {
    updateTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  function deleteTodo(id: string) {
    updateTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    updateTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed))
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  const remainingCount = todos.filter((todo) => !todo.completed).length
  const filters: { label: string; value: TodoFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ]

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">A little more focus, every day</p>
        <h1>My tasks<span>.</span></h1>
        <p className="subtitle">Plan your day, one task at a time.</p>
      </header>

      <div className="dashboard-grid">
        <section className="todo-card" aria-label="Todo list">
          <TodoForm
            dueDate={selectedDate}
            onAdd={addTodo}
            onDueDateChange={setSelectedDate}
          />

          {storageError && (
            <p className="storage-message" role="alert">
              {storageError}
            </p>
          )}

          <div className="list-toolbar">
            <p className="task-count">
              <strong>{remainingCount}</strong>{' '}
              {remainingCount === 1 ? 'task' : 'tasks'} left
            </p>
            <nav className="filters" aria-label="Filter tasks">
              {filters.map(({ label, value }) => (
                <button
                  aria-pressed={filter === value}
                  className={filter === value ? 'filter-button is-selected' : 'filter-button'}
                  key={value}
                  onClick={() => setFilter(value)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <TodoList
            filter={filter}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
            todos={visibleTodos}
          />

          <footer className="list-footer">
            <span>{todos.length} {todos.length === 1 ? 'task' : 'tasks'} total</span>
            <button
              className="clear-button"
              disabled={!todos.some((todo) => todo.completed)}
              onClick={clearCompleted}
              type="button"
            >
              Clear completed
            </button>
          </footer>
        </section>
        <MiniCalendar
          onDelete={deleteTodo}
          onSelectDate={setSelectedDate}
          onToggle={toggleTodo}
          selectedDate={selectedDate}
          todos={todos}
        />
      </div>
      <p className="page-footer">One step at a time is still progress.</p>
    </main>
  )
}

export default App
