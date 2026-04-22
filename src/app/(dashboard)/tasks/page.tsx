'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Loader2, CheckSquare, Trash2 } from 'lucide-react'
import { Task } from '@/types'
import { cn, formatDate, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/utils'

const COLUMNS: { status: string; label: string }[] = [
  { status: 'TODO', label: 'Da Fare' },
  { status: 'IN_PROGRESS', label: 'In Corso' },
  { status: 'REVIEW', label: 'Revisione' },
  { status: 'DONE', label: 'Completato' },
]

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [team, setTeam] = useState<{ id: string; name: string }[]>([])
  const [projectFilter, setProjectFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', projectId: '', assigneeId: '', dueDate: '', estimatedHours: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (projectFilter) params.set('project', projectFilter)
    const res = await fetch(`/api/tasks?${params}`)
    setTasks(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [projectFilter])
  useEffect(() => {
    fetch('/api/projects').then((r) => r.json()).then((d) => setProjects(d.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))))
    fetch('/api/team').then((r) => r.json()).then((d) => setTeam(d.map((u: { id: string; name: string }) => ({ id: u.id, name: u.name }))))
  }, [])

  const tasksByStatus = COLUMNS.reduce((acc, col) => ({
    ...acc,
    [col.status]: tasks.filter((t) => t.status === col.status),
  }), {} as Record<string, Task[]>)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : null }),
    })
    setSaving(false)
    setShowModal(false)
    setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', projectId: '', assigneeId: '', dueDate: '', estimatedHours: '' })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo task?')) return
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    load()
  }

  async function handleDrop(newStatus: string, e: React.DragEvent) {
    e.preventDefault()
    if (!draggedId) return
    await fetch(`/api/tasks/${draggedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setDraggedId(null)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <p className="text-gray-500 text-sm mt-1">{tasks.length} task totali</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Tutti i progetti</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Nuovo Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <div
              key={col.status}
              className="bg-gray-100/70 rounded-xl p-3 min-h-[400px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(col.status, e)}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[col.status])}>{col.label}</span>
                <span className="text-xs text-gray-400 font-medium">{tasksByStatus[col.status]?.length ?? 0}</span>
              </div>
              <div className="space-y-2">
                {(tasksByStatus[col.status] ?? []).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedId(task.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className={cn(
                      'bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing group transition-opacity',
                      draggedId === task.id ? 'opacity-50' : ''
                    )}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
                      <button onClick={() => handleDelete(task.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 hover:text-red-500 transition-all flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{task.project.name}</p>
                    <div className="flex items-center justify-between">
                      <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', PRIORITY_COLORS[task.priority])}>{PRIORITY_LABELS[task.priority]}</span>
                      <div className="flex items-center gap-2">
                        {task.assignee && (
                          <span className="text-xs text-gray-400">{task.assignee.name.split(' ')[0]}</span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-gray-400">{formatDate(task.dueDate)}</span>
                        )}
                      </div>
                    </div>
                    {task.estimatedHours && (
                      <p className="text-xs text-gray-300 mt-1">{task.estimatedHours}h stimate</p>
                    )}
                  </div>
                ))}

                {(tasksByStatus[col.status] ?? []).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 text-gray-300 text-xs">
                    <CheckSquare className="w-6 h-6 mb-1 opacity-30" />
                    Trascina qui
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nuovo Task</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titolo *</label>
                <input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progetto *</label>
                <select required value={form.projectId} onChange={(e) => setForm({...form, projectId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Seleziona progetto</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {COLUMNS.map((c) => <option key={c.status} value={c.status}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                  <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assegna a</label>
                  <select value={form.assigneeId} onChange={(e) => setForm({...form, assigneeId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Nessuno</option>
                    {team.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ore Stimate</label>
                  <input type="number" min="0" step="0.5" value={form.estimatedHours} onChange={(e) => setForm({...form, estimatedHours: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
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
