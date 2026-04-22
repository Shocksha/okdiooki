'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, ExternalLink, Trash2, Loader2, Pencil } from 'lucide-react'
import { Invoice } from '@/types'
import { cn, formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'

const INVOICE_STATUSES = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ clientId: '', projectId: '', dueDate: '', notes: '', tax: '22', items: [{ description: '', quantity: '1', unitPrice: '', total: '' }] })

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/invoices?${params}`)
    setInvoices(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [statusFilter])
  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then((d) => setClients(d.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))))
    fetch('/api/projects').then((r) => r.json()).then((d) => setProjects(d.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))))
  }, [])

  function updateItem(i: number, field: string, value: string) {
    const updated = [...form.items]
    updated[i] = { ...updated[i], [field]: value }
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = parseFloat(updated[i].quantity) || 0
      const price = parseFloat(updated[i].unitPrice) || 0
      updated[i].total = (qty * price).toFixed(2)
    }
    setForm({ ...form, items: updated })
  }

  function addItem() {
    setForm({ ...form, items: [...form.items, { description: '', quantity: '1', unitPrice: '', total: '' }] })
  }

  function removeItem(i: number) {
    if (form.items.length === 1) return
    setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })
  }

  const subtotal = form.items.reduce((s, i) => s + (parseFloat(i.total) || 0), 0)
  const taxAmount = subtotal * (parseFloat(form.tax) / 100)
  const total = subtotal + taxAmount

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const items = form.items.map((i) => ({
      description: i.description,
      quantity: parseFloat(i.quantity),
      unitPrice: parseFloat(i.unitPrice),
      total: parseFloat(i.total),
    }))
    await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items }),
    })
    setSaving(false)
    setShowModal(false)
    setForm({ clientId: '', projectId: '', dueDate: '', notes: '', tax: '22', items: [{ description: '', quantity: '1', unitPrice: '', total: '' }] })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questa fattura?')) return
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    load()
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/invoices/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    load()
  }

  const stats = { total: invoices.reduce((s, i) => s + i.total, 0), paid: invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0), pending: invoices.filter((i) => ['SENT', 'OVERDUE'].includes(i.status)).reduce((s, i) => s + i.total, 0) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fatture</h1>
          <p className="text-gray-500 text-sm mt-1">{invoices.length} fatture</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Nuova Fattura
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Totale', value: formatCurrency(stats.total), color: 'text-gray-900' }, { label: 'Incassato', value: formatCurrency(stats.paid), color: 'text-green-600' }, { label: 'In Attesa', value: formatCurrency(stats.pending), color: 'text-yellow-600' }].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400">{label}</p>
            <p className={cn('text-xl font-bold mt-1', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Tutti gli stati</option>
          {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <p>Nessuna fattura trovata</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Numero</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Emessa</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Scadenza</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stato</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Totale</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{inv.number}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{inv.client.name}</div>
                    {inv.client.company && <div className="text-xs text-gray-400">{inv.client.company}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(inv.issueDate)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-4">
                    <select value={inv.status} onChange={(e) => updateStatus(inv.id, e.target.value)} className={cn('text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500', STATUS_COLORS[inv.status])}>
                      {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/invoices/${inv.id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><ExternalLink className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(inv.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nuova Fattura</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select required value={form.clientId} onChange={(e) => setForm({...form, clientId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Seleziona</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progetto</label>
                  <select value={form.projectId} onChange={(e) => setForm({...form, projectId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Nessuno</option>
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza *</label>
                  <input required type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                  <input type="number" min="0" max="100" value={form.tax} onChange={(e) => setForm({...form, tax: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              {/* Line items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Voci</label>
                  <button type="button" onClick={addItem} className="text-xs text-indigo-600 hover:underline">+ Aggiungi voce</button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
                    <div className="col-span-5">Descrizione</div>
                    <div className="col-span-2">Q.tà</div>
                    <div className="col-span-2">Prezzo</div>
                    <div className="col-span-2">Totale</div>
                    <div className="col-span-1" />
                  </div>
                  {form.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2">
                      <input required value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Descrizione..." className="col-span-5 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input required type="number" min="1" step="1" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} className="col-span-2 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input required type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', e.target.value)} className="col-span-2 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <div className="col-span-2 border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-gray-50 text-gray-700">{item.total ? `€${parseFloat(item.total).toFixed(2)}` : '—'}</div>
                      <button type="button" onClick={() => removeItem(i)} className="col-span-1 text-gray-300 hover:text-red-500 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
                {/* Totals */}
                <div className="mt-4 space-y-1 text-sm text-right">
                  <div className="flex justify-between text-gray-500"><span>Imponibile:</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between text-gray-500"><span>IVA ({form.tax}%):</span><span>{formatCurrency(taxAmount)}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 text-base"><span>Totale:</span><span>{formatCurrency(total)}</span></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Crea Fattura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
