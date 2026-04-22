'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, UserCheck } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { cn, formatDate, ROLE_LABELS } from '@/lib/utils'

interface TeamMember { id: string; name: string; email: string; role: string; position?: string; phone?: string; createdAt: string; _count: { assignedTasks: number; timeEntries: number } }

const ROLES = ['ADMIN', 'MANAGER', 'EMPLOYEE']
const ROLE_COLORS: Record<string, string> = { ADMIN: 'bg-purple-100 text-purple-700', MANAGER: 'bg-blue-100 text-blue-700', EMPLOYEE: 'bg-gray-100 text-gray-700' }

export default function TeamPage() {
  const { data: session } = useSession()
  const currentRole = (session?.user as { role?: string })?.role ?? ''
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE', position: '', phone: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/team')
    setTeam(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm({ name: '', email: '', password: '', role: 'EMPLOYEE', position: '', phone: '' })
    setShowModal(true)
  }

  function openEdit(m: TeamMember) {
    setEditing(m)
    setForm({ name: m.name, email: m.email, password: '', role: m.role, position: m.position ?? '', phone: m.phone ?? '' })
    setShowModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      await fetch(`/api/team/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setSaving(false)
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo membro del team?')) return
    await fetch(`/api/team/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 text-sm mt-1">{team.length} collaboratori</p>
        </div>
        {currentRole === 'ADMIN' && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Nuovo Membro
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {team.map((member) => {
            const initials = member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
            return (
              <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">{initials}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.position ?? '—'}</p>
                    </div>
                  </div>
                  {currentRole === 'ADMIN' && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(member)} className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(member.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-500">{member.email}</div>
                  {member.phone && <div className="text-gray-400">{member.phone}</div>}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className={cn('text-xs px-2 py-1 rounded-full font-semibold', ROLE_COLORS[member.role])}>{ROLE_LABELS[member.role]}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{member._count.assignedTasks} task</span>
                    <span>{member._count.timeEntries} ore</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Modifica Membro' : 'Nuovo Membro'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email {!editing && '*'}</label>
                  <input type="email" disabled={!!editing} required={!editing} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password {editing ? '(lascia vuoto)' : '*'}</label>
                  <input type="password" required={!editing} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
                  <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posizione</label>
                  <input value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editing ? 'Salva' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
