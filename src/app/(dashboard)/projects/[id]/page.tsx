'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, CheckSquare, Plus, Loader2, Pencil, Trash2 } from 'lucide-react'
import { cn, formatCurrency, formatDate, formatDateInput, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/utils'

interface ProjectDetail {
  id: string; name: string; description?: string; status: string; priority: string
  startDate?: string; endDate?: string; budget?: number; spent: number
  client: { id: string; name: string; company?: string }
  createdBy: { name: string }
  tasks: { id: string; title: string; status: string; priority: string; assignee?: { name: string } | null; dueDate?: string; estimatedHours?: number }[]
  timeEntries: { id: string; hours: number; description?: string; date: string; user: { name: string }; task?: { title: string } | null }[]
}

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<{ id: string; name: string }[]>([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', assigneeId: '', dueDate: '', estimatedHours: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch(`/api/projects/${id}`)
    setProject(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    load()
    fetch('/api/team').then((r) => r.json()).then((d) => setTeam(d.map((u: { id: string; name: string }) => ({ id: u.id, name: u.name }))))
  }, [id])

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...taskForm, projectId: id, estimatedHours: taskForm.estimatedHours ? parseFloat(taskForm.estimatedHours) : null }),
    })
    setSaving(false)
    setShowTaskModal(false)
    setTaskForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', assigneeId: '', dueDate: '', estimatedHours: '' })
    load()
  }

  async function deleteTask(taskId: string) {
    if (!confirm('Eliminare questo task?')) return
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
  if (!project) return <div className="text-center py-12 text-gray-500">Progetto non trovato</div>

  const progress = project.budget && project.budget > 0 ? Math.min((project.spent / project.budget) * 100, 100) : 0
  const totalHours = project.timeEntries.reduce((s, t) => s + t.hours, 0)
  const tasksByStatus = TASK_STATUSES.reduce((acc, s) => ({ ...acc, [s]: project.tasks.filter((t) => t.status === s) }), {} as Record<string, typeof project.tasks>)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <Link href={`/clients/${project.client.id}`} className="text-sm text-indigo-600 hover:underline">{project.client.name}</Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={cn('text-xs px-3 py-1 rounded-full font-medium', STATUS_COLORS[project.status])}>{STATUS_LABELS[project.status]}</span>
          <span className={cn('text-xs px-3 py-1 rounded-full font-medium', PRIORITY_COLORS[project.priority])}>{PRIORITY_LABELS[project.priority]}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Budget', value: project.budget ? formatCurrency(project.budget) : '—' },
          { label: 'Speso', value: formatCurrency(project.spent) },
          { label: 'Ore Registrate', value: `${totalHours}h` },
          { label: 'Task Totali', value: project.tasks.length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Budget progress */}
      {project.budget && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Avanzamento Budget</span>
            <span className="text-gray-500">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all', progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-yellow-500' : 'bg-indigo-500')} style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatCurrency(project.spent)} spesi</span>
            <span>{formatCurrency((project.budget ?? 0) - project.spent)} rimanenti</span>
          </div>
        </div>
      )}

      {/* Task Kanban */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><CheckSquare className="w-4 h-4" />Task</h2>
          <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700">
            <Plus className="w-3.5 h-3.5" />Aggiungi Task
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TASK_STATUSES.map((status) => (
            <div key={status} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', STATUS_COLORS[status])}>{STATUS_LABELS[status]}</span>
                <span className="text-xs text-gray-400">{tasksByStatus[status]?.length ?? 0}</span>
              </div>
              <div className="space-y-2">
                {(tasksByStatus[status] ?? []).map((task) => (
                  <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-sm group">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-medium text-gray-800 leading-tight">{task.title}</p>
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 hover:text-red-500 transition-all flex-shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', PRIORITY_COLORS[task.priority])}>{PRIORITY_LABELS[task.priority]}</span>
                      {task.assignee && <span className="text-xs text-gray-400">{task.assignee.name.split(' ')[0]}</span>}
                    </div>
                    {task.dueDate && <p className="text-xs text-gray-400 mt-1">{formatDate(task.dueDate)}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent time entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4" />Ore Registrate Recenti</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {project.timeEntries.length === 0 && <div className="px-6 py-8 text-center text-gray-400 text-sm">Nessuna ora registrata</div>}
          {project.timeEntries.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-3 text-sm">
              <div>
                <p className="font-medium text-gray-800">{t.description ?? (t.task?.title ?? 'Attività generica')}</p>
                <p className="text-xs text-gray-400">{t.user.name} · {formatDate(t.date)}</p>
              </div>
              <span className="font-semibold text-gray-700">{t.hours}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nuovo Task</h2>
            </div>
            <form onSubmit={createTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titolo *</label>
                <input required value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                  <select value={taskForm.status} onChange={(e) => setTaskForm({...taskForm, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {TASK_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assegna a</label>
                  <select value={taskForm.assigneeId} onChange={(e) => setTaskForm({...taskForm, assigneeId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Nessuno</option>
                    {team.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza</label>
                  <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ore Stimate</label>
                  <input type="number" min="0" step="0.5" value={taskForm.estimatedHours} onChange={(e) => setTaskForm({...taskForm, estimatedHours: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Crea Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
