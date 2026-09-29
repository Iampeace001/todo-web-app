import { useState, type FormEvent } from 'react'

interface TodoFormProps {
  dueDate: string
  onAdd: (title: string, dueDate: string, dueTime: string) => void
  onDueDateChange: (date: string) => void
}

function TodoForm({ dueDate, onAdd, onDueDateChange }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [dueTime, setDueTime] = useState('09:00')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle || !dueDate || !dueTime) return

    onAdd(trimmedTitle, dueDate, dueTime)
    setTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="task-entry">
        <label className="visually-hidden" htmlFor="new-todo">
          Add a task
        </label>
        <input
          autoComplete="off"
          id="new-todo"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to get done?"
          value={title}
        />
        <button
          className="add-button"
          disabled={!title.trim() || !dueDate || !dueTime}
          type="submit"
        >
        Add task
        </button>
      </div>
      <div className="schedule-entry">
        <label>
          <span>Date</span>
          <input
            aria-label="Task date"
            onChange={(event) => {
              if (event.target.value) onDueDateChange(event.target.value)
            }}
            required
            type="date"
            value={dueDate}
          />
        </label>
        <label>
          <span>Time</span>
          <input
            aria-label="Task time"
            onChange={(event) => setDueTime(event.target.value)}
            required
            type="time"
            value={dueTime}
          />
        </label>
      </div>
    </form>
  )
}

export default TodoForm
