'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, ExternalLink, Pencil, Trash2, Loader2, Users, Globe, Phone, Mail } from 'lucide-react'
import { Client } from '@/types'
import { cn, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'

const STATUS_OPTIONS = ['', 'ACTIVE', 'INACTIVE', 'PROSPECT']

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '', website: '', status: 'ACTIVE', notes: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/clients?${params}`)
    setClients(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [search, statusFilter])

  function openCreate() {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', company: '', address: '', website: '', status: 'ACTIVE', notes: '' })
    setShowModal(true)
  }

  function openEdit(c: Client) {
    setEditing(c)
    setForm({ name: c.name, email: c.email, phone: c.phone ?? '', company: c.company ?? '', address: c.address ?? '', website: c.website ?? '', status: c.status, notes: c.notes ?? '' })
    setShowModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/clients/${editing.id}` : '/api/clients'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo cliente?')) return
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienti</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} clienti trovati</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Nuovo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca cliente..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Tutti gli stati</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Users className="w-12 h-12 mb-3 opacity-30" />
            <p>Nessun cliente trovato</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contatto</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stato</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Progetti</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aggiunto</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.name}</div>
                    {c.company && <div className="text-xs text-gray-400">{c.company}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600"><Mail className="w-3.5 h-3.5" />{c.email}</div>
                    {c.phone && <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5"><Phone className="w-3 h-3" />{c.phone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[c.status])}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{c._count?.projects ?? 0} progetti</td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(c.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/clients/${c.id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><ExternalLink className="w-4 h-4" /></Link>
                      <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Modifica Cliente' : 'Nuovo Cliente'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Azienda</label>
                  <input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sito Web</label>
                  <input value={form.website} onChange={(e) => setForm({...form, website: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="ACTIVE">Attivo</option>
                    <option value="PROSPECT">Prospect</option>
                    <option value="INACTIVE">Inattivo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
                <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editing ? 'Salva' : 'Crea Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
