'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, ExternalLink, Pencil, Trash2, Loader2, FolderKanban } from 'lucide-react'
import { Project } from '@/types'
import { cn, formatCurrency, formatDate, formatDateInput, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/utils'

const PROJECT_STATUSES = ['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ON_HOLD', 'CANCELLED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState({ name: '', description: '', status: 'PLANNING', priority: 'MEDIUM', startDate: '', endDate: '', budget: '', clientId: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/projects?${params}`)
    setProjects(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [search, statusFilter])
  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then((d) => setClients(d.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))))
  }, [])

  function openCreate() {
    setEditing(null)
    setForm({ name: '', description: '', status: 'PLANNING', priority: 'MEDIUM', startDate: '', endDate: '', budget: '', clientId: '' })
    setShowModal(true)
  }

  function openEdit(p: Project) {
    setEditing(p)
    setForm({ name: p.name, description: p.description ?? '', status: p.status, priority: p.priority, startDate: formatDateInput(p.startDate), endDate: formatDateInput(p.endDate), budget: p.budget?.toString() ?? '', clientId: p.clientId })
    setShowModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/projects/${editing.id}` : '/api/projects'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo progetto? Tutti i task e le ore associate verranno eliminati.')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progetti</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} progetti trovati</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Nuovo Progetto
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca progetto..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Tutti gli stati</option>
          {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 bg-white rounded-xl border border-gray-100">
          <FolderKanban className="w-12 h-12 mb-3 opacity-30" />
          <p>Nessun progetto trovato</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => {
            const progress = p.budget && p.budget > 0 ? Math.min((p.spent / p.budget) * 100, 100) : 0
            return (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{p.client.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <Link href={`/projects/${p.id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><ExternalLink className="w-3.5 h-3.5" /></Link>
                    <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[p.status])}>{STATUS_LABELS[p.status]}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', PRIORITY_COLORS[p.priority])}>{PRIORITY_LABELS[p.priority]}</span>
                </div>

                {p.budget && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Budget usato</span>
                      <span>{formatCurrency(p.spent)} / {formatCurrency(p.budget)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-yellow-500' : 'bg-indigo-500')} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{p._count?.tasks ?? 0} task</span>
                  <span>{formatDate(p.startDate)} – {formatDate(p.endDate)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Modifica Progetto' : 'Nuovo Progetto'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Progetto *</label>
                <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select required value={form.clientId} onChange={(e) => setForm({...form, clientId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Seleziona cliente</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                    {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                  <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (€)</label>
                  <input type="number" min="0" step="100" value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editing ? 'Salva' : 'Crea Progetto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
