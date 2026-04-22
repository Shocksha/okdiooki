'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Printer, Loader2 } from 'lucide-react'
import { Invoice } from '@/types'
import { cn, formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'

const INVOICE_STATUSES = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/invoices/${id}`).then((r) => r.json()).then((d) => { setInvoice(d); setLoading(false) })
  }, [id])

  async function updateStatus(status: string) {
    setSaving(true)
    const res = await fetch(`/api/invoices/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setInvoice(await res.json())
    setSaving(false)
  }

  function handlePrint() {
    window.print()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
  if (!invoice) return <div className="text-center py-12 text-gray-500">Fattura non trovata</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 print:hidden">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{invoice.number}</h1>
        <span className={cn('text-xs px-3 py-1 rounded-full font-medium', STATUS_COLORS[invoice.status])}>{STATUS_LABELS[invoice.status]}</span>
        <div className="ml-auto flex items-center gap-3">
          <select value={invoice.status} onChange={(e) => updateStatus(e.target.value)} disabled={saving} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Stampa / PDF
          </button>
        </div>
      </div>

      {/* Invoice document */}
      <div ref={printRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 print:shadow-none print:rounded-none print:border-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="text-2xl font-black text-indigo-600 mb-1">WebAgency</div>
            <div className="text-sm text-gray-500 space-y-0.5">
              <div>info@webagency.com</div>
              <div>+39 02 1234567</div>
              <div>Via della Innovazione 1, Milano</div>
              <div>P.IVA: IT01234567890</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-gray-200 mb-2">FATTURA</div>
            <div className="text-xl font-bold text-gray-900">{invoice.number}</div>
            <div className="text-sm text-gray-500 mt-2 space-y-0.5">
              <div>Emessa: {formatDate(invoice.issueDate)}</div>
              <div>Scadenza: {formatDate(invoice.dueDate)}</div>
            </div>
          </div>
        </div>

        {/* Client info */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Fatturato a</p>
            <div className="text-sm space-y-1">
              <div className="font-semibold text-gray-900 text-base">{invoice.client.name}</div>
              {invoice.client.company && <div className="text-gray-600">{invoice.client.company}</div>}
              <div className="text-gray-500">{invoice.client.email}</div>
              {invoice.client.address && <div className="text-gray-500">{invoice.client.address}</div>}
            </div>
          </div>
          {invoice.project && (
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Riferimento progetto</p>
              <div className="font-semibold text-gray-900">{invoice.project.name}</div>
            </div>
          )}
        </div>

        {/* Items table */}
        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 font-semibold text-gray-700">Descrizione</th>
              <th className="text-right py-3 font-semibold text-gray-700 w-20">Q.tà</th>
              <th className="text-right py-3 font-semibold text-gray-700 w-28">Prezzo Unit.</th>
              <th className="text-right py-3 font-semibold text-gray-700 w-28">Totale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 text-gray-700">{item.description}</td>
                <td className="py-3 text-right text-gray-500">{item.quantity}</td>
                <td className="py-3 text-right text-gray-500">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-right font-medium text-gray-900">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Imponibile:</span><span>{formatCurrency(invoice.subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>IVA:</span><span>{formatCurrency(invoice.tax)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-xl pt-3 border-t-2 border-gray-200"><span>Totale:</span><span className="text-indigo-600">{formatCurrency(invoice.total)}</span></div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Note</p>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
          Grazie per aver scelto WebAgency · Pagamento tramite bonifico bancario · IBAN: IT60 X054 2811 1010 0000 0123 456
        </div>
      </div>

      <style>{`@media print { .print\\:hidden { display: none !important; } }`}</style>
    </div>
  )
}
