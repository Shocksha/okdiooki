import { useState, useEffect, useCallback } from 'react'

const C = { primary: '#7c6ef5', success: '#34d399', warning: '#fbbf24', danger: '#f87171', panel: '#111118', border: '#1e1e2e', text: '#e2e2f0', muted: '#6b6b8a', input: '#1a1a2a' }

const MOCK_CLIENTS = [
  { id: '1', name: 'Pizzeria Roma', account_id: 'acc_1', location_id: 'loc_1', token_status: 'active',   token_expiry: new Date(Date.now() + 3600000).toISOString() },
  { id: '2', name: 'Studio Dentistico Belli', account_id: 'acc_2', location_id: 'loc_2', token_status: 'expired', token_expiry: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', name: 'Avv. Chiara Verdi', account_id: '', location_id: '', token_status: 'missing', token_expiry: null },
  { id: '4', name: 'Farmacia Centrale', account_id: 'acc_4', location_id: 'loc_4', token_status: 'active', token_expiry: new Date(Date.now() + 7200000).toISOString() },
]

function StatusBadge({ status }) {
  const map = {
    active:  { label: 'Attivo',   bg: '#34d39920', color: C.success },
    expired: { label: 'Scaduto',  bg: '#fbbf2420', color: C.warning },
    missing: { label: 'Mancante', bg: '#f8717120', color: C.danger },
  }
  const s = map[status] || map.missing
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>&#x2715;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, color: C.muted, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = { width: '100%', background: C.input, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, boxSizing: 'border-box', outline: 'none' }

export default function ClientsView({ clients: propClients, onRefresh }) {
  const [clients, setClients] = useState(propClients?.length ? propClients : MOCK_CLIENTS)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', account_id: '', location_id: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    if (propClients?.length) setClients(propClients)
  }, [propClients])

  const filtered = clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()))

  function openAdd() { setForm({ name: '', account_id: '', location_id: '' }); setModal('add') }
  function openEdit(c) { setForm({ name: c.name, account_id: c.account_id || '', location_id: c.location_id || '' }); setModal({ type: 'edit', client: c }) }

  async function saveClient() {
    setLoading(true)
    try {
      const isEdit = modal?.type === 'edit'
      const url = isEdit ? `/api/clients/${modal.client.id}` : '/api/clients'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      setMsg({ ok: true, text: isEdit ? 'Cliente aggiornato' : 'Cliente creato' })
      setModal(null)
      onRefresh?.()
    } catch (e) {
      // mock: just update local state
      if (modal?.type === 'edit') {
        setClients(cs => cs.map(c => c.id === modal.client.id ? { ...c, ...form } : c))
      } else {
        setClients(cs => [...cs, { id: Date.now().toString(), ...form, token_status: 'missing' }])
      }
      setModal(null)
      setMsg({ ok: true, text: 'Salvato (mock)' })
    }
    setLoading(false)
    setTimeout(() => setMsg(null), 3000)
  }

  async function deleteClient(id) {
    if (!confirm('Eliminare questo cliente?')) return
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      onRefresh?.()
    } catch {
      setClients(cs => cs.filter(c => c.id !== id))
    }
  }

  function connectGoogle(client) {
    const popup = window.open(`/api/auth/google?client_id=${encodeURIComponent(client.id)}`, 'oauth', 'width=500,height=650,left=400,top=100')
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer)
        onRefresh?.()
        setClients(cs => cs.map(c => c.id === client.id ? { ...c, token_status: 'active' } : c))
        setMsg({ ok: true, text: `Google connesso per ${client.name}` })
        setTimeout(() => setMsg(null), 3000)
      }
    }, 800)
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Clienti</h1>
          <p style={{ fontSize: 14, color: C.muted, margin: '4px 0 0' }}>{clients.length} profili GMB</p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
        >
          + Nuovo cliente
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.ok ? '#34d39920' : '#f8717120', border: `1px solid ${msg.ok ? C.success : C.danger}`, borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: msg.ok ? C.success : C.danger, fontSize: 14 }}>
          {msg.text}
        </div>
      )}

      <input
        placeholder="Cerca cliente..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: 16, maxWidth: 320 }}
      />

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Nome', 'Account ID', 'Location ID', 'Stato token', 'Azioni'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#ffffff04'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', color: C.text, fontSize: 14, fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '14px 16px', color: C.muted, fontSize: 13, fontFamily: 'monospace' }}>{c.account_id || '—'}</td>
                <td style={{ padding: '14px 16px', color: C.muted, fontSize: 13, fontFamily: 'monospace' }}>{c.location_id || '—'}</td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={c.token_status} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => connectGoogle(c)}
                      style={{ background: '#34d39915', border: `1px solid ${C.success}40`, color: C.success, borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                    >
                      Google
                    </button>
                    <button
                      onClick={() => openEdit(c)}
                      style={{ background: `${C.primary}15`, border: `1px solid ${C.primary}40`, color: C.primary, borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => deleteClient(c.id)}
                      style={{ background: '#f8717115', border: '1px solid #f8717140', color: C.danger, borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}
                    >
                      Elimina
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.muted, fontSize: 14 }}>Nessun cliente trovato</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {(modal === 'add' || modal?.type === 'edit') && (
        <Modal title={modal === 'add' ? 'Nuovo cliente' : 'Modifica cliente'} onClose={() => setModal(null)}>
          <Field label="Nome azienda *">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Es. Pizzeria Roma" />
          </Field>
          <Field label="Account ID (GMB)">
            <input value={form.account_id} onChange={e => setForm(f => ({ ...f, account_id: e.target.value }))} style={inputStyle} placeholder="accounts/123456789" />
          </Field>
          <Field label="Location ID (GMB)">
            <input value={form.location_id} onChange={e => setForm(f => ({ ...f, location_id: e.target.value }))} style={inputStyle} placeholder="locations/987654321" />
          </Field>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '10px', cursor: 'pointer', fontSize: 14 }}>
              Annulla
            </button>
            <button
              onClick={saveClient}
              disabled={!form.name || loading}
              style={{ flex: 1, background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: (!form.name || loading) ? 0.5 : 1 }}
            >
              {loading ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
