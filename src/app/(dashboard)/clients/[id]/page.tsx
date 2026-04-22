'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Mail, Phone, MapPin, FolderKanban, FileText, Loader2 } from 'lucide-react'
import { cn, formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/utils'

interface ClientDetail {
  id: string; name: string; email: string; phone?: string; company?: string; address?: string; website?: string; status: string; notes?: string; createdAt: string
  projects: { id: string; name: string; status: string; priority: string; budget?: number; spent: number; startDate?: string; endDate?: string; _count: { tasks: number } }[]
  invoices: { id: string; number: string; status: string; total: number; issueDate: string; dueDate: string }[]
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then((r) => r.json())
      .then((d) => { setClient(d); setLoading(false) })
  }, [id])

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
  if (!client) return <div className="text-center py-12 text-gray-500">Cliente non trovato</div>

  const totalRevenue = client.invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          {client.company && <p className="text-gray-500 text-sm">{client.company}</p>}
        </div>
        <span className={cn('ml-auto text-xs px-3 py-1 rounded-full font-medium', STATUS_COLORS[client.status])}>
          {STATUS_LABELS[client.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Informazioni</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{client.email}</div>
            {client.phone && <div className="flex items-center gap-3 text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{client.phone}</div>}
            {client.website && <div className="flex items-center gap-3 text-gray-600"><Globe className="w-4 h-4 text-gray-400" /><a href={client.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{client.website}</a></div>}
            {client.address && <div className="flex items-center gap-3 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" />{client.address}</div>}
          </div>
          {client.notes && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Note</p>
              <p className="text-sm text-gray-600">{client.notes}</p>
            </div>
          )}
          <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-400">Progetti</p><p className="text-xl font-bold text-gray-900">{client.projects.length}</p></div>
            <div><p className="text-xs text-gray-400">Fatturato</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p></div>
          </div>
        </div>

        {/* Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><FolderKanban className="w-4 h-4" />Progetti</h2>
            <Link href={`/projects?client=${id}`} className="text-xs text-indigo-600 hover:underline">Vedi tutti</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {client.projects.length === 0 && <div className="px-6 py-8 text-center text-gray-400 text-sm">Nessun progetto</div>}
            {client.projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p._count.tasks} task · {formatDate(p.startDate)} – {formatDate(p.endDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {p.budget && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Budget</p>
                      <p className="text-sm font-medium text-gray-700">{formatCurrency(p.budget)}</p>
                    </div>
                  )}
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[p.status])}>{STATUS_LABELS[p.status]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4" />Fatture</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {client.invoices.length === 0 && <div className="px-6 py-8 text-center text-gray-400 text-sm">Nessuna fattura</div>}
          {client.invoices.map((inv) => (
            <Link key={inv.id} href={`/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors text-sm">
              <div>
                <p className="font-medium text-gray-900">{inv.number}</p>
                <p className="text-xs text-gray-400">Emessa {formatDate(inv.issueDate)} · Scadenza {formatDate(inv.dueDate)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-900">{formatCurrency(inv.total)}</p>
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[inv.status])}>{STATUS_LABELS[inv.status]}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
