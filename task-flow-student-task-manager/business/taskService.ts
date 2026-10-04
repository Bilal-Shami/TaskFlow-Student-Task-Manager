import { addTask as persistTask, deleteTask as removeTask, getTasks, type Task, type TaskPriority, updateTask } from '@/data/taskRepository'

export type TaskFilter = 'All' | 'Pending' | 'Completed'

export function createTask(input: { title: string; description: string; priority: TaskPriority; dueDate: string }): Task[] {
  const title = input.title.trim()
  if (!title) throw new Error('Task title is required.')
  if (!input.dueDate) throw new Error('Due date is required.')
  return persistTask({ ...input, title, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() })
}

export function completeTask(id: string, completed: boolean): Task[] {
  const task = getTasks().find((item) => item.id === id)
  if (!task) return getTasks()
  return updateTask({ ...task, completed })
}

export function deleteTask(id: string): Task[] {
  return removeTask(id)
}

export function getFilteredTasks(tasks: Task[], filter: TaskFilter, search: string): Task[] {
  const query = search.trim().toLowerCase()
  return tasks.filter((task) => {
    const matchesFilter = filter === 'All' || (filter === 'Completed' ? task.completed : !task.completed)
    const matchesSearch = !query || `${task.title} ${task.description} ${task.priority}`.toLowerCase().includes(query)
    return matchesFilter && matchesSearch
  }).sort((a, b) => Number(a.completed) - Number(b.completed) || a.dueDate.localeCompare(b.dueDate))
}

export function getTaskStatistics(tasks: Task[]) {
  const completed = tasks.filter((task) => task.completed).length
  return { total: tasks.length, completed, pending: tasks.length - completed }
}
