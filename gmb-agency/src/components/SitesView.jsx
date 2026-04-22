import { useState } from 'react'
import TemplateMedici from '../templates/TemplateMedici.jsx'
import TemplateAvvocati from '../templates/TemplateAvvocati.jsx'
import TemplateCommercialisti from '../templates/TemplateCommercialisti.jsx'
import TemplatePMI from '../templates/TemplatePMI.jsx'
import TemplateAltro from '../templates/TemplateAltro.jsx'

const C = { primary: '#7c6ef5', success: '#34d399', panel: '#111118', border: '#1e1e2e', text: '#e2e2f0', muted: '#6b6b8a', input: '#1a1a2a' }
const inputStyle = { width: '100%', background: C.input, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, boxSizing: 'border-box', outline: 'none' }

const TEMPLATES = [
  { id: 'medici',          label: 'Medici & Sanità',      desc: 'Stile teal/blu, professionale e rassicurante',  Component: TemplateMedici },
  { id: 'avvocati',        label: 'Avvocati & Legale',    desc: 'Dark navy/oro, prestigioso e autorevole',       Component: TemplateAvvocati },
  { id: 'commercialisti',  label: 'Commercialisti',       desc: 'Verde foresta, data-driven e affidabile',       Component: TemplateCommercialisti },
  { id: 'pmi',             label: 'PMI & Startup',        desc: 'Viola/rosa, energico e moderno',               Component: TemplatePMI },
  { id: 'altro',           label: 'Creativo / Altro',     desc: 'Dark neon, audace e futuristico',              Component: TemplateAltro },
]

const STEPS = ['Seleziona template', 'Dati azienda', 'Contenuti', 'Anteprima']

function StepBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: i < step ? C.success : i === step ? C.primary : C.input,
                border: `2px solid ${i < step ? C.success : i === step ? C.primary : C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: i <= step ? '#fff' : C.muted,
                flexShrink: 0,
              }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, color: i === step ? C.text : C.muted, fontWeight: i === step ? 600 : 400, whiteSpace: 'nowrap' }}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 1, background: i < step ? C.success : C.border, margin: '0 12px' }} />
          )}
        </div>
      ))}
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

export default function SitesView({ clients = [] }) {
  const [step, setStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [basics, setBasics] = useState({ client_id: '', nome: '', telefono: '', email: '', indirizzo: '', orari: '' })
  const [content, setContent] = useState({ descrizione: '', servizi: '' })
  const [preview, setPreview] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [done, setDone] = useState(false)

  const mockClients = clients.length ? clients : [
    { id: '1', name: 'Pizzeria Roma' },
    { id: '2', name: 'Studio Dentistico Belli' },
    { id: '4', name: 'Farmacia Centrale' },
  ]

  const TemplateComp = TEMPLATES.find(t => t.id === selectedTemplate)?.Component
  const templateData = {
    nome: basics.nome,
    telefono: basics.telefono,
    email: basics.email,
    indirizzo: basics.indirizzo,
    orari: basics.orari,
    descrizione: content.descrizione,
    servizi: content.servizi ? content.servizi.split('\n').filter(Boolean) : undefined,
  }

  async function publish() {
    setPublishing(true)
    await new Promise(r => setTimeout(r, 1200))
    setPublishing(false)
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ padding: 32, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#34d39920', border: `2px solid ${C.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
          ✓
        </div>
        <h2 style={{ color: C.text, margin: '0 0 12px', fontWeight: 800, fontSize: 24 }}>Sito pubblicato!</h2>
        <p style={{ color: C.muted, marginBottom: 28 }}>Il sito per <strong style={{ color: C.text }}>{basics.nome}</strong> è stato creato con successo.</p>
        <button onClick={() => { setStep(0); setSelectedTemplate(null); setBasics({ client_id: '', nome: '', telefono: '', email: '', indirizzo: '', orari: '' }); setContent({ descrizione: '', servizi: '' }); setDone(false) }}
          style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, cursor: 'pointer' }}>
          Crea altro sito
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Siti Web</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '4px 0 0' }}>Crea siti professionali per i tuoi clienti</p>
      </div>

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
        <StepBar step={step} />

        {/* Step 0: Template */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Scegli un template</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    border: `2px solid ${selectedTemplate === t.id ? C.primary : C.border}`,
                    borderRadius: 10,
                    padding: '18px 16px',
                    cursor: 'pointer',
                    background: selectedTemplate === t.id ? `${C.primary}10` : 'transparent',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 6 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>{t.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button disabled={!selectedTemplate} onClick={() => setStep(1)}
                style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', opacity: !selectedTemplate ? 0.4 : 1 }}>
                Avanti
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Basics */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Dati azienda</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Cliente">
                <select value={basics.client_id} onChange={e => setBasics(b => ({ ...b, client_id: e.target.value }))} style={inputStyle}>
                  <option value="">Seleziona...</option>
                  {mockClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Nome azienda *">
                <input value={basics.nome} onChange={e => setBasics(b => ({ ...b, nome: e.target.value }))} style={inputStyle} placeholder="Es. Studio Medico Rossi" />
              </Field>
              <Field label="Telefono">
                <input value={basics.telefono} onChange={e => setBasics(b => ({ ...b, telefono: e.target.value }))} style={inputStyle} placeholder="+39 02 1234567" />
              </Field>
              <Field label="Email">
                <input value={basics.email} onChange={e => setBasics(b => ({ ...b, email: e.target.value }))} style={inputStyle} placeholder="info@esempio.it" />
              </Field>
              <Field label="Indirizzo">
                <input value={basics.indirizzo} onChange={e => setBasics(b => ({ ...b, indirizzo: e.target.value }))} style={inputStyle} placeholder="Via Roma 1, Milano" />
              </Field>
              <Field label="Orari">
                <input value={basics.orari} onChange={e => setBasics(b => ({ ...b, orari: e.target.value }))} style={inputStyle} placeholder="Lun-Ven: 9:00-18:00" />
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button onClick={() => setStep(0)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>Indietro</button>
              <button disabled={!basics.nome} onClick={() => setStep(2)} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', opacity: !basics.nome ? 0.4 : 1 }}>Avanti</button>
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Contenuti</div>
            <Field label="Descrizione azienda">
              <textarea value={content.descrizione} onChange={e => setContent(c => ({ ...c, descrizione: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', minHeight: 100, fontFamily: 'inherit' }} placeholder="Breve descrizione dell'attività..." />
            </Field>
            <Field label="Servizi (uno per riga)">
              <textarea value={content.servizi} onChange={e => setContent(c => ({ ...c, servizi: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', minHeight: 120, fontFamily: 'inherit' }} placeholder={"Servizio 1\nServizio 2\nServizio 3"} />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>Indietro</button>
              <button onClick={() => setStep(3)} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>Anteprima</button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Anteprima sito</div>
              <button
                onClick={() => setPreview(p => !p)}
                style={{ background: `${C.primary}20`, border: `1px solid ${C.primary}40`, color: C.primary, borderRadius: 7, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}
              >
                {preview ? 'Chiudi anteprima' : 'Apri anteprima completa'}
              </button>
            </div>

            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', maxHeight: preview ? 'none' : 400, position: 'relative' }}>
              <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '167%', pointerEvents: 'none' }}>
                {TemplateComp && <TemplateComp data={templateData} />}
              </div>
              {!preview && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #111118)' }} />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button onClick={() => setStep(2)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>Indietro</button>
              <button onClick={publish} disabled={publishing}
                style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 800, cursor: 'pointer', fontSize: 15, opacity: publishing ? 0.6 : 1 }}>
                {publishing ? 'Pubblicazione...' : 'Pubblica sito'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
