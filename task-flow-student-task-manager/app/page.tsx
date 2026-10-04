'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Check, CheckCircle2, ClipboardList, Clock3, LayoutDashboard, Plus, Search, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createTask, deleteTask, getFilteredTasks, getTaskStatistics, completeTask, type TaskFilter } from '@/business/taskService'
import { getTasks, type Task, type TaskPriority } from '@/data/taskRepository'

const priorityStyles: Record<TaskPriority, string> = { Low: 'priority-low', Medium: 'priority-medium', High: 'priority-high' }
const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function AddTaskForm({ onCreated, onClose }: { onCreated: (tasks: Task[]) => void; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    try { onCreated(createTask({ title, description, priority, dueDate })); onClose() } catch (err) { setError(err instanceof Error ? err.message : 'Please check your input.') }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="task-form" onSubmit={submit} aria-labelledby="add-task-title">
      <div className="form-heading"><div><p className="eyebrow">New task</p><h2 id="add-task-title">Add a task</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close form"><X /></button></div>
      <label>Task title <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Prepare presentation slides" aria-invalid={Boolean(error)} /></label>
      <label>Description <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context (optional)" rows={3} /></label>
      <div className="form-grid"><label>Priority <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Due date <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit"><Plus data-icon="inline-start" />Add task</Button></div>
    </form>
  </div>
}

function TaskCard({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return <article className={`task-card ${task.completed ? 'is-complete' : ''}`}>
    <button className={`check-button ${task.completed ? 'checked' : ''}`} onClick={onToggle} aria-label={task.completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as complete`}>{task.completed && <Check />}</button>
    <div className="task-copy"><div className="task-title-row"><h3>{task.title}</h3><span className={`priority-badge ${priorityStyles[task.priority]}`}>{task.priority}</span></div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span><Clock3 /> {formatDate(task.dueDate)}</span><span className={task.completed ? 'status-done' : ''}>{task.completed ? 'Completed' : 'In progress'}</span></div></div>
    <button className="delete-button" onClick={onDelete} aria-label={`Delete ${task.title}`}><Trash2 /></button>
  </article>
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('All')
  const [search, setSearch] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showArchitecture, setShowArchitecture] = useState(false)
  useEffect(() => setTasks(getTasks()), [])
  const stats = useMemo(() => getTaskStatistics(tasks), [tasks])
  const visibleTasks = useMemo(() => getFilteredTasks(tasks, filter, search), [tasks, filter, search])

  function remove(id: string) { if (window.confirm('Delete this task? This action cannot be undone.')) setTasks(deleteTask(id)) }

  return <main className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark"><CheckCircle2 /></div><div><strong>TaskFlow</strong><span>Student workspace</span></div></div><nav><a className="nav-item active"><LayoutDashboard /> Overview</a><a className="nav-item" onClick={() => setShowArchitecture(true)}><BookOpen /> Architecture</a></nav><div className="sidebar-note"><span className="note-icon"><ClipboardList /></span><p><strong>Stay on track</strong><br />Small progress adds up.</p></div><div className="sidebar-footer">SDA Lab Assignment <span>v1.0</span></div></aside>
    <section className="content"><header className="topbar"><div><p className="eyebrow">Monday, October 4, 2026</p><h1>Good morning, student.</h1><p className="subtitle">Here&apos;s your academic focus for today.</p></div><Button onClick={() => setIsAdding(true)}><Plus data-icon="inline-start" /> Add task</Button></header>
      <div className="stats-grid"><div className="stat-card"><div className="stat-icon total"><ClipboardList /></div><div><span>Total tasks</span><strong>{stats.total}</strong></div></div><div className="stat-card"><div className="stat-icon pending"><Clock3 /></div><div><span>Pending</span><strong>{stats.pending}</strong></div></div><div className="stat-card"><div className="stat-icon completed"><CheckCircle2 /></div><div><span>Completed</span><strong>{stats.completed}</strong></div></div></div>
      <section className="tasks-section"><div className="section-heading"><div><h2>Your tasks</h2><p>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} in view</p></div><div className="search-wrap"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" /></div></div><div className="filter-row" role="tablist" aria-label="Task filters">{(['All', 'Pending', 'Completed'] as TaskFilter[]).map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item}{item === 'All' ? ` ${stats.total}` : item === 'Pending' ? ` ${stats.pending}` : ` ${stats.completed}`}</button>)}</div>
        <div className="task-list">{visibleTasks.length ? visibleTasks.map((task) => <TaskCard key={task.id} task={task} onToggle={() => setTasks(completeTask(task.id, !task.completed))} onDelete={() => remove(task.id)} />) : <div className="empty-state"><div className="empty-icon"><Check /></div><h3>No tasks found</h3><p>{search ? 'Try a different search term.' : 'You’re all caught up. Add a task to get started.'}</p>{!search && <Button onClick={() => setIsAdding(true)}><Plus data-icon="inline-start" /> Add your first task</Button>}</div>}</div>
      </section>
      <button className="architecture-banner" onClick={() => setShowArchitecture(true)}><div className="banner-icon"><BookOpen /></div><div><strong>Built with layered architecture</strong><span>Explore how TaskFlow separates presentation, business logic, and data access.</span></div><span className="banner-arrow">→</span></button>
    </section>
    {isAdding && <AddTaskForm onCreated={setTasks} onClose={() => setIsAdding(false)} />}
    {showArchitecture && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowArchitecture(false)}><div className="architecture-modal" role="dialog" aria-modal="true" aria-labelledby="architecture-title"><div className="form-heading"><div><p className="eyebrow">SDA concept</p><h2 id="architecture-title">Layered architecture</h2></div><button className="icon-button" onClick={() => setShowArchitecture(false)} aria-label="Close architecture"><X /></button></div><p className="modal-intro">Each layer has one clear responsibility, making the application easier to understand, test, and maintain.</p><div className="layers"><div><b>01</b><span><strong>Presentation Layer</strong>React components handle UI and user interaction.</span></div><div><b>02</b><span><strong>Business Logic Layer</strong>Task operations, validation, filtering, and statistics.</span></div><div><b>03</b><span><strong>Data Access Layer</strong>Persistent storage through browser localStorage.</span></div></div><div className="flow"><span>Presentation</span><i>→</i><span>Business Logic</span><i>→</i><span>Data Access</span><i>→</i><span>localStorage</span></div></div></div>}
  </main>
}
