import { useState } from 'react'

const C = { primary: '#7c6ef5', success: '#34d399', danger: '#f87171', panel: '#111118', border: '#1e1e2e', text: '#e2e2f0', muted: '#6b6b8a', input: '#1a1a2a' }
const inputStyle = { width: '100%', background: C.input, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, boxSizing: 'border-box', outline: 'none' }

function Section({ title, desc, children }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{title}</div>
        {desc && <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, color: C.muted, marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? C.primary : C.input,
        border: `1px solid ${checked ? C.primary : C.border}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }}
      />
    </div>
  )
}

export default function SettingsView() {
  const [googleClientId, setGoogleClientId] = useState('')
  const [googleClientSecret, setGoogleClientSecret] = useState('')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [emailNotif, setEmailNotif] = useState(false)
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Impostazioni</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '4px 0 0' }}>Configurazione API e preferenze</p>
      </div>

      {saved && (
        <div style={{ background: '#34d39920', border: `1px solid ${C.success}`, borderRadius: 8, padding: '10px 16px', marginBottom: 20, color: C.success, fontSize: 14 }}>
          Impostazioni salvate correttamente
        </div>
      )}

      <Section title="Google OAuth" desc="Credenziali per l'autenticazione Google My Business">
        <Field label="Client ID" hint="Da Google Cloud Console > Credenziali > OAuth 2.0">
          <input value={googleClientId} onChange={e => setGoogleClientId(e.target.value)} style={inputStyle} placeholder="xxx.apps.googleusercontent.com" type="password" />
        </Field>
        <Field label="Client Secret">
          <input value={googleClientSecret} onChange={e => setGoogleClientSecret(e.target.value)} style={inputStyle} placeholder="GOCSPX-..." type="password" />
        </Field>
        <div style={{ background: '#1a1a2a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          <strong style={{ color: C.text }}>Redirect URI da configurare:</strong>
          <br />
          <code style={{ color: C.primary }}>{window.location.origin}/api/auth/callback</code>
        </div>
      </Section>

      <Section title="Anthropic Claude AI" desc="API key per la generazione di contenuti AI">
        <Field label="API Key" hint="Da console.anthropic.com > API Keys">
          <input value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)} style={inputStyle} placeholder="sk-ant-api03-..." type="password" />
        </Field>
        <div style={{ background: '#1a1a2a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: C.muted }}>
          Modello in uso: <strong style={{ color: C.text }}>claude-sonnet-4-20250514</strong>
        </div>
      </Section>

      <Section title="Supabase" desc="Database PostgreSQL per clienti, post e siti">
        <Field label="Project URL">
          <input value={supabaseUrl} onChange={e => setSupabaseUrl(e.target.value)} style={inputStyle} placeholder="https://xxx.supabase.co" />
        </Field>
        <Field label="Service Role Key" hint="Chiave con accesso completo (solo server-side)">
          <input value={supabaseKey} onChange={e => setSupabaseKey(e.target.value)} style={inputStyle} placeholder="eyJh..." type="password" />
        </Field>
      </Section>

      <Section title="Preferenze" desc="Comportamenti automatici della piattaforma">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Rinnovo token automatico</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Rinnova i token GMB prima della scadenza</div>
          </div>
          <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Notifiche email</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Avvisi per token scaduti e pubblicazioni fallite</div>
          </div>
          <Toggle checked={emailNotif} onChange={setEmailNotif} />
        </div>
      </Section>

      <Section title="Informazioni" desc="Versione e stato della piattaforma">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Versione', value: '1.0.0' },
            { label: 'Runtime', value: 'Vercel Node.js 20' },
            { label: 'Database', value: 'Supabase PostgreSQL' },
            { label: 'AI Model', value: 'claude-sonnet-4-20250514' },
          ].map(r => (
            <div key={r.label} style={{ background: '#1a1a2a', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{r.label}</div>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{r.value}</div>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={save}
          style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
        >
          Salva impostazioni
        </button>
      </div>
    </div>
  )
}
