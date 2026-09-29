import TodoItem from './TodoItem'
import type { Todo } from '../types/todo'

interface MiniCalendarProps {
  todos: Todo[]
  selectedDate: string
  onSelectDate: (date: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatSelectedDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(parseDateKey(value))
}

function MiniCalendar({
  todos,
  selectedDate,
  onSelectDate,
  onToggle,
  onDelete,
}: MiniCalendarProps) {
  const selected = parseDateKey(selectedDate)
  const displayedMonth = new Date(selected.getFullYear(), selected.getMonth(), 1)
  const today = dateKey(new Date())
  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(displayedMonth)
  const firstWeekday = (displayedMonth.getDay() + 6) % 7
  const gridStart = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth(),
    1 - firstWeekday,
  )
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    )
    const key = dateKey(date)
    return {
      date,
      key,
      isCurrentMonth: date.getMonth() === displayedMonth.getMonth(),
      taskCount: todos.filter((todo) => todo.dueDate === key).length,
    }
  })
  const selectedTodos = todos
    .filter((todo) => todo.dueDate === selectedDate)
    .sort((first, second) =>
      (first.dueTime ?? '').localeCompare(second.dueTime ?? ''),
    )

  function changeMonth(offset: number) {
    const targetMonth = new Date(
      selected.getFullYear(),
      selected.getMonth() + offset,
      1,
    )
    const targetDay = Math.min(
      selected.getDate(),
      new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate(),
    )
    onSelectDate(
      dateKey(
        new Date(
          targetMonth.getFullYear(),
          targetMonth.getMonth(),
          targetDay,
        ),
      ),
    )
  }

  function selectDate(value: string) {
    onSelectDate(value)
  }

  return (
    <aside className="calendar-card" aria-label="Task calendar">
      <div className="calendar-heading">
        <div>
          <p className="calendar-eyebrow">Your schedule</p>
          <h2>Calendar</h2>
        </div>
        <button
          className="today-button"
          onClick={() => selectDate(today)}
          type="button"
        >
          Today
        </button>
      </div>

      <div className="month-navigation">
        <button
          aria-label="Previous month"
          className="month-arrow"
          onClick={() => changeMonth(-1)}
          type="button"
        >
          ‹
        </button>
        <h3 aria-live="polite">{monthLabel}</h3>
        <button
          aria-label="Next month"
          className="month-arrow"
          onClick={() => changeMonth(1)}
          type="button"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid" role="group" aria-label={monthLabel}>
        {weekdays.map((weekday) => (
          <span className="weekday-label" key={weekday}>
            {weekday}
          </span>
        ))}
        {calendarDays.map(({ date, key, isCurrentMonth, taskCount }) => (
          <button
            aria-label={`${formatSelectedDate(key)}${taskCount ? `, ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}` : ''}`}
            aria-pressed={selectedDate === key}
            className={[
              'calendar-day',
              !isCurrentMonth && 'is-outside-month',
              key === today && 'is-today',
              selectedDate === key && 'is-selected',
            ]
              .filter(Boolean)
              .join(' ')}
            key={key}
            onClick={() => selectDate(key)}
            type="button"
          >
            <span>{date.getDate()}</span>
            {taskCount > 0 && (
              <span aria-hidden="true" className="calendar-task-count">
                {taskCount > 9 ? '9+' : taskCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <section className="day-agenda" aria-live="polite">
        <div className="agenda-heading">
          <h3>{formatSelectedDate(selectedDate)}</h3>
          <span>{selectedTodos.length}</span>
        </div>
        {selectedTodos.length > 0 ? (
          <ul className="agenda-list">
            {selectedTodos.map((todo) => (
              <TodoItem
                compact
                key={todo.id}
                onDelete={onDelete}
                onToggle={onToggle}
                todo={todo}
              />
            ))}
          </ul>
        ) : (
          <p className="agenda-empty">Nothing scheduled for this day.</p>
        )}
      </section>
    </aside>
  )
}

export default MiniCalendar
