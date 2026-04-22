'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Play, Square, Trash2, Loader2, Clock } from 'lucide-react'
import { TimeEntry } from '@/types'
import { formatDate } from '@/lib/utils'

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [tasks, setTasks] = useState<{ id: string; title: string; projectId: string }[]>([])
  const [projectFilter, setProjectFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ description: '', hours: '', date: new Date().toISOString().split('T')[0], projectId: '', taskId: '' })
  const [saving, setSaving] = useState(false)

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerProject, setTimerProject] = useState('')
  const [timerDesc, setTimerDesc] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (projectFilter) params.set('project', projectFilter)
    const res = await fetch(`/api/time-entries?${params}`)
    setEntries(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [projectFilter])
  useEffect(() => {
    fetch('/api/projects').then((r) => r.json()).then((d) => setProjects(d.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))))
    fetch('/api/tasks').then((r) => r.json()).then((d) => setTasks(d.map((t: { id: string; title: string; projectId: string }) => ({ id: t.id, title: t.title, projectId: t.projectId }))))
  }, [])

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  function formatTimer(seconds: number) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  async function stopTimer() {
    if (!timerProject || timerSeconds < 60) {
      setTimerRunning(false)
      setTimerSeconds(0)
      return
    }
    const hours = (timerSeconds / 3600).toFixed(2)
    await fetch('/api/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: timerDesc, hours, projectId: timerProject, date: new Date().toISOString().split('T')[0] }),
    })
    setTimerRunning(false)
    setTimerSeconds(0)
    setTimerDesc('')
    load()
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/time-entries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setShowModal(false)
    setForm({ description: '', hours: '', date: new Date().toISOString().split('T')[0], projectId: '', taskId: '' })
    load()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/time-entries/${id}`, { method: 'DELETE' })
    load()
  }

  const totalHours = entries.reduce((s, e) => s + e.hours, 0)
  const filteredTasks = tasks.filter((t) => !form.projectId || t.projectId === form.projectId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ore Lavorate</h1>
          <p className="text-gray-500 text-sm mt-1">{totalHours.toFixed(1)}h totali registrate</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Registra Ore
        </button>
      </div>

      {/* Timer widget */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <h2 className="text-sm font-semibold opacity-80 mb-4">Timer Automatico</h2>
        <div className="flex items-center gap-6">
          <div className="text-5xl font-mono font-bold tracking-wide">{formatTimer(timerSeconds)}</div>
          <div className="flex-1 space-y-2">
            <input
              value={timerDesc}
              onChange={(e) => setTimerDesc(e.target.value)}
              placeholder="Descrizione attività..."
              disabled={timerRunning}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
            />
            <select
              value={timerProject}
              onChange={(e) => setTimerProject(e.target.value)}
              disabled={timerRunning}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
            >
              <option value="">Seleziona progetto...</option>
              {projects.map((p) => <option key={p.id} value={p.id} className="text-gray-900">{p.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => timerRunning ? stopTimer() : setTimerRunning(true)}
            disabled={!timerRunning && !timerProject}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-40 flex items-center justify-center transition-colors"
          >
            {timerRunning ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
        </div>
        {timerRunning && <p className="text-xs opacity-60 mt-3">Il timer verrà salvato automaticamente allo stop</p>}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Tutti i progetti</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Entries list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Clock className="w-12 h-12 mb-3 opacity-30" />
            <p>Nessuna ora registrata</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Attività</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Progetto</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Collaboratore</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ore</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3 text-gray-500">{formatDate(e.date)}</td>
                  <td className="px-6 py-3 text-gray-900">{e.description ?? (e.task?.title ?? '—')}</td>
                  <td className="px-6 py-3 text-gray-600">{e.project.name}</td>
                  <td className="px-6 py-3 text-gray-600">{e.user.name}</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">{e.hours}h</td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDelete(e.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-gray-700">Totale</td>
                <td className="px-6 py-3 text-right font-bold text-gray-900">{totalHours.toFixed(1)}h</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Registra Ore</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ore *</label>
                  <input required type="number" min="0.25" max="24" step="0.25" value={form.hours} onChange={(e) => setForm({...form, hours: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progetto *</label>
                <select required value={form.projectId} onChange={(e) => setForm({...form, projectId: e.target.value, taskId: ''})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Seleziona progetto</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              {form.projectId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task (opzionale)</label>
                  <select value={form.taskId} onChange={(e) => setForm({...form, taskId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Nessun task specifico</option>
                    {filteredTasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
