export interface Todo {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  dueTime?: string
}

export type TodoFilter = 'all' | 'active' | 'completed'
