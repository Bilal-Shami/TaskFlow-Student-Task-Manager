export type TaskPriority = 'Low' | 'Medium' | 'High'

export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = 'taskflow.tasks'

const sampleTasks: Task[] = [
  {
    id: 'sample-1',
    title: 'Complete Software Architecture report',
    description: 'Document the layered architecture and prepare diagrams for the lab submission.',
    priority: 'High',
    dueDate: '2026-10-08',
    completed: false,
    createdAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 'sample-2',
    title: 'Review database normalization notes',
    description: 'Revise 1NF, 2NF, and 3NF before the study group session.',
    priority: 'Medium',
    dueDate: '2026-10-10',
    completed: false,
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'sample-3',
    title: 'Submit UI prototype',
    description: 'Upload the final prototype link to the course portal.',
    priority: 'Low',
    dueDate: '2026-09-30',
    completed: true,
    createdAt: '2026-09-28T10:00:00.000Z',
  },
]

export function getTasks(): Task[] {
  if (typeof window === 'undefined') return []
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    saveTasks(sampleTasks)
    return sampleTasks
  }
  try {
    return JSON.parse(stored) as Task[]
  } catch {
    saveTasks(sampleTasks)
    return sampleTasks
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function addTask(task: Task): Task[] {
  const tasks = getTasks()
  const updated = [task, ...tasks]
  saveTasks(updated)
  return updated
}

export function updateTask(task: Task): Task[] {
  const updated = getTasks().map((item) => (item.id === task.id ? task : item))
  saveTasks(updated)
  return updated
}

export function deleteTask(id: string): Task[] {
  const updated = getTasks().filter((task) => task.id !== id)
  saveTasks(updated)
  return updated
}

export function resetTasks(): Task[] {
  saveTasks(sampleTasks)
  return sampleTasks
}

export { sampleTasks }
