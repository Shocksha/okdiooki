import { useState } from 'react'

const C = { primary: '#7c6ef5', accent: '#f472b6', success: '#34d399', danger: '#f87171', warning: '#fbbf24', panel: '#111118', border: '#1e1e2e', text: '#e2e2f0', muted: '#6b6b8a', input: '#1a1a2a' }

const MOCK_POSTS = [
  { id: '1', client_name: 'Pizzeria Roma',          summary: 'Nuova pizza del mese: Tartufo e Porcini!', post_type: 'update', status: 'published', created_at: '2026-04-20' },
  { id: '2', client_name: 'Studio Dentistico Belli', summary: 'Promozione pulizia denti -30% fino al 30 aprile.', post_type: 'offer',  status: 'published', created_at: '2026-04-18' },
  { id: '3', client_name: 'Farmacia Centrale',       summary: 'Apertura domenicale dalle 9 alle 13.',       post_type: 'update', status: 'failed',    created_at: '2026-04-15' },
]

const inputStyle = { width: '100%', background: C.input, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, boxSizing: 'border-box', outline: 'none' }
const taStyle = { ...inputStyle, resize: 'vertical', minHeight: 110, fontFamily: 'inherit', lineHeight: 1.5 }

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, color: C.muted, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = { published: { label: 'Pubblicato', color: C.success, bg: '#34d39920' }, failed: { label: 'Fallito', color: C.danger, bg: '#f8717120' }, pending: { label: 'In attesa', color: C.warning, bg: '#fbbf2420' } }
  const s = map[status] || map.pending
  return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
}

export default function PostsView({ clients = [] }) {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [form, setForm] = useState({ client_id: '', post_type: 'update', summary: '', media_url: '', cta_type: '', cta_url: '' })
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [msg, setMsg] = useState(null)

  const mockClients = clients.length ? clients : [
    { id: '1', name: 'Pizzeria Roma' },
    { id: '2', name: 'Studio Dentistico Belli' },
    { id: '4', name: 'Farmacia Centrale' },
  ]

  async function generateAI() {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Scrivi un post Google My Business (max 300 caratteri) per: ${aiPrompt}` }),
      })
      const data = await res.json()
      if (data.text) setForm(f => ({ ...f, summary: data.text }))
      else throw new Error()
    } catch {
      setForm(f => ({ ...f, summary: `Scopri le nostre offerte speciali! Vieni a trovarci, ti aspettiamo con tante novità. ${aiPrompt}` }))
    }
    setAiLoading(false)
  }

  async function publishPost() {
    if (!form.client_id || !form.summary) return
    setPublishing(true)
    try {
      const res = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        const clientName = mockClients.find(c => c.id === form.client_id)?.name || ''
        setPosts(ps => [{ id: Date.now().toString(), client_name: clientName, summary: form.summary, post_type: form.post_type, status: 'published', created_at: new Date().toISOString().slice(0, 10) }, ...ps])
        setForm({ client_id: '', post_type: 'update', summary: '', media_url: '', cta_type: '', cta_url: '' })
        setMsg({ ok: true, text: 'Post pubblicato su Google My Business!' })
      } else {
        setMsg({ ok: false, text: data.error || 'Errore pubblicazione' })
      }
    } catch {
      setMsg({ ok: false, text: 'Errore di connessione' })
    }
    setPublishing(false)
    setTimeout(() => setMsg(null), 4000)
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Post GMB</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '4px 0 0' }}>Crea e pubblica post su Google My Business</p>
      </div>

      {msg && (
        <div style={{ background: msg.ok ? '#34d39920' : '#f8717120', border: `1px solid ${msg.ok ? C.success : C.danger}`, borderRadius: 8, padding: '10px 16px', marginBottom: 20, color: msg.ok ? C.success : C.danger, fontSize: 14 }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Editor */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>Nuovo post</div>

          {/* AI helper */}
          <div style={{ background: '#1a1a2a', border: `1px solid ${C.primary}30`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: C.primary, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>
              Generatore AI
            </div>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Descrivi il post... es. 'offerta pizza margherita €5'"
              style={{ ...taStyle, minHeight: 70, marginBottom: 8 }}
            />
            <button
              onClick={generateAI}
              disabled={aiLoading || !aiPrompt.trim()}
              style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: (aiLoading || !aiPrompt.trim()) ? 0.5 : 1 }}
            >
              {aiLoading ? 'Generazione...' : 'Genera con Claude AI'}
            </button>
          </div>

          <Field label="Cliente *">
            <select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} style={inputStyle}>
              <option value="">Seleziona cliente...</option>
              {mockClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          <Field label="Tipo post">
            <select value={form.post_type} onChange={e => setForm(f => ({ ...f, post_type: e.target.value }))} style={inputStyle}>
              <option value="update">Aggiornamento</option>
              <option value="offer">Offerta</option>
              <option value="event">Evento</option>
            </select>
          </Field>

          <Field label="Testo post *">
            <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} style={taStyle} placeholder="Testo del post GMB..." />
            <div style={{ fontSize: 11, color: form.summary.length > 1500 ? C.danger : C.muted, textAlign: 'right', marginTop: 4 }}>{form.summary.length}/1500</div>
          </Field>

          <Field label="URL immagine (opzionale)">
            <input value={form.media_url} onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))} style={inputStyle} placeholder="https://..." />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="CTA tipo">
              <select value={form.cta_type} onChange={e => setForm(f => ({ ...f, cta_type: e.target.value }))} style={inputStyle}>
                <option value="">Nessuna</option>
                <option value="CALL">Chiama</option>
                <option value="BOOK">Prenota</option>
                <option value="SHOP">Acquista</option>
                <option value="LEARN_MORE">Scopri di più</option>
              </select>
            </Field>
            <Field label="CTA URL">
              <input value={form.cta_url} onChange={e => setForm(f => ({ ...f, cta_url: e.target.value }))} style={inputStyle} placeholder="https://..." />
            </Field>
          </div>

          <button
            onClick={publishPost}
            disabled={!form.client_id || !form.summary || publishing}
            style={{ width: '100%', background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: (!form.client_id || !form.summary || publishing) ? 0.5 : 1, marginTop: 4 }}
          >
            {publishing ? 'Pubblicazione in corso...' : 'Pubblica su GMB'}
          </button>
        </div>

        {/* Preview */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>Anteprima post</div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 16, color: '#111' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e53e3e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>G</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{mockClients.find(c => c.id === form.client_id)?.name || 'Nome attività'}</div>
                <div style={{ fontSize: 11, color: '#888' }}>Google My Business</div>
              </div>
            </div>
            {form.media_url && (
              <div style={{ width: '100%', height: 160, background: '#f0f0f0', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
                <img src={form.media_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
              </div>
            )}
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 12px', color: '#333' }}>
              {form.summary || <span style={{ color: '#aaa' }}>Il testo del tuo post apparirà qui...</span>}
            </p>
            {form.cta_type && (
              <div style={{ display: 'inline-block', background: '#1a73e8', color: '#fff', padding: '7px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600 }}>
                {form.cta_type === 'CALL' ? 'Chiama' : form.cta_type === 'BOOK' ? 'Prenota' : form.cta_type === 'SHOP' ? 'Acquista' : 'Scopri di più'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontSize: 15, fontWeight: 700, color: C.text }}>Storico post</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Cliente', 'Testo', 'Tipo', 'Stato', 'Data'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < posts.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <td style={{ padding: '12px 16px', color: C.text, fontSize: 14, fontWeight: 600 }}>{p.client_name}</td>
                <td style={{ padding: '12px 16px', color: C.muted, fontSize: 13, maxWidth: 300 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.summary}</div>
                </td>
                <td style={{ padding: '12px 16px', color: C.muted, fontSize: 13, textTransform: 'capitalize' }}>{p.post_type}</td>
                <td style={{ padding: '12px 16px' }}><StatusBadge status={p.status} /></td>
                <td style={{ padding: '12px 16px', color: C.muted, fontSize: 13 }}>{p.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
