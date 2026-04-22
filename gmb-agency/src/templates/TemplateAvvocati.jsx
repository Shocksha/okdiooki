import { Reveal, Particles, GLOBAL_STYLES } from './shared.jsx'

const COLORS = {
  primary: '#b8973a',
  secondary: '#9a7d2a',
  dark: '#0d1117',
  navy: '#0f1929',
  text: '#e8e3d5',
  muted: '#8b8070',
  light: '#1a2236',
  border: '#2a3248',
}

function ScalesIcon({ size = 48, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="8" x2="32" y2="56" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="8" x2="48" y2="8" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="8" r="3" fill={color} />
      <line x1="16" y1="8" x2="8" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="8" x2="24" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M6 28 Q16 34 26 28" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="48" y1="8" x2="40" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="8" x2="56" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 28 Q48 22 58 28" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="24" y="54" width="16" height="4" rx="2" fill={color} />
    </svg>
  )
}

function CheckmarkIcon({ color = COLORS.primary }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10l4 4 8-8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GoldDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
      <div style={{ flex: 1, height: 1, background: COLORS.primary, opacity: 0.4 }} />
      <div style={{ width: 6, height: 6, background: COLORS.primary, transform: 'rotate(45deg)' }} />
      <div style={{ flex: 1, height: 1, background: COLORS.primary, opacity: 0.4 }} />
    </div>
  )
}

export default function TemplateAvvocati({ data = {} }) {
  const {
    nome = 'Avv. Chiara Bianchi',
    studio = 'Studio Legale Bianchi & Associati',
    telefono = '+39 02 9876543',
    email = 'info@studiolegalebianchi.it',
    indirizzo = 'Via Montenapoleone 8, Milano',
    orari = 'Lun-Ven: 9:30-18:00',
    specializzazioni = ['Diritto civile', 'Diritto commerciale', 'Diritto del lavoro', 'Recupero crediti'],
    descrizione = "Studio legale di eccellenza con venticinque anni di esperienza nelle più complesse controversie civili e commerciali.",
    valori = ['Riservatezza assoluta', 'Efficienza e puntualità', 'Consulenza personalizzata', 'Aggiornamento continuo'],
    recensioni = [],
  } = data

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ fontFamily: "'Garamond', 'Georgia', serif", background: COLORS.dark, color: COLORS.text }}>

        {/* Header */}
        <header
          style={{
            background: COLORS.navy,
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '16px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ScalesIcon size={32} color={COLORS.primary} />
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 1, color: COLORS.primary }}>
              {studio}
            </span>
          </div>
          <a
            href={`tel:${telefono}`}
            style={{
              color: COLORS.primary,
              textDecoration: 'none',
              fontSize: 14,
              letterSpacing: 0.5,
              border: `1px solid ${COLORS.primary}60`,
              padding: '8px 20px',
              borderRadius: 4,
            }}
          >
            {telefono}
          </a>
        </header>

        {/* Hero */}
        <section
          style={{
            position: 'relative',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '80px 40px',
          }}
        >
          <Particles count={12} color="rgba(184,151,58,0.08)" />

          {/* Decorative vertical lines */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(to bottom, transparent, ${COLORS.primary}, transparent)` }} />

          <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: COLORS.primary,
                marginBottom: 24,
                animation: 'slideInUp 0.7s ease both',
              }}
            >
              Studio Legale · Dal 1998
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                margin: '0 0 24px',
                fontStyle: 'italic',
                animation: 'slideInUp 0.7s 0.1s ease both',
              }}
            >
              {nome}
            </h1>

            <GoldDivider />

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.8,
                color: 'rgba(232,227,213,0.75)',
                margin: '0 0 48px',
                maxWidth: 600,
                animation: 'slideInUp 0.7s 0.2s ease both',
              }}
            >
              {descrizione}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                animation: 'slideInUp 0.7s 0.3s ease both',
              }}
            >
              <a
                href={`mailto:${email}`}
                style={{
                  background: COLORS.primary,
                  color: COLORS.dark,
                  padding: '16px 36px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontFamily: "'Segoe UI', sans-serif",
                }}
              >
                Consulenza gratuita
              </a>
              <a
                href="#aree"
                style={{
                  border: `1px solid ${COLORS.primary}60`,
                  color: COLORS.primary,
                  padding: '16px 36px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontFamily: "'Segoe UI', sans-serif",
                }}
              >
                Aree di pratica
              </a>
            </div>
          </div>

          {/* Right decoration */}
          <div
            style={{
              position: 'absolute',
              right: 60,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.06,
            }}
          >
            <ScalesIcon size={320} color={COLORS.primary} />
          </div>
        </section>

        {/* Areas of Practice */}
        <section id="aree" style={{ background: COLORS.light, padding: '80px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Reveal>
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: COLORS.primary, marginBottom: 12 }}>
                  Competenze
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: 400, fontStyle: 'italic', margin: 0 }}>
                  Aree di specializzazione
                </h2>
                <GoldDivider />
              </div>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
              {specializzazioni.map((s, i) => (
                <Reveal key={s} delay={i * 100} direction="left">
                  <div
                    style={{
                      padding: '32px',
                      border: `1px solid ${COLORS.border}`,
                      background: COLORS.dark,
                      cursor: 'default',
                      transition: 'border-color 0.3s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 2, height: 32, background: COLORS.primary }} />
                      <h3 style={{ margin: 0, fontWeight: 400, fontSize: 19, fontStyle: 'italic' }}>{s}</h3>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ padding: '80px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Reveal>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: 400, fontStyle: 'italic', marginBottom: 48, textAlign: 'center' }}>
                I nostri valori
              </h2>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {valori.map((v, i) => (
                <Reveal key={v} delay={i * 80}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CheckmarkIcon color={COLORS.primary} />
                    <span style={{ fontSize: 16, color: COLORS.text }}>{v}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {recensioni.length > 0 && (
          <section style={{ background: COLORS.light, padding: '80px 40px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <Reveal>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: 400, fontStyle: 'italic', marginBottom: 48, textAlign: 'center' }}>
                  Testimonianze
                </h2>
              </Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {recensioni.map((r, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        borderLeft: `3px solid ${COLORS.primary}`,
                        padding: '28px',
                        background: COLORS.dark,
                      }}
                    >
                      <p style={{ fontStyle: 'italic', fontSize: 15, lineHeight: 1.7, margin: '0 0 16px', opacity: 0.85 }}>
                        "{r.testo}"
                      </p>
                      <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, color: COLORS.primary, textTransform: 'uppercase', fontFamily: "'Segoe UI', sans-serif" }}>
                        {r.nome}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          style={{
            background: COLORS.primary,
            padding: '80px 40px',
            textAlign: 'center',
            color: COLORS.dark,
          }}
        >
          <Reveal>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 400, fontStyle: 'italic', margin: '0 0 12px' }}>
              Una questione legale da risolvere?
            </h2>
            <p style={{ fontSize: 17, margin: '0 0 36px', opacity: 0.8, fontFamily: "'Segoe UI', sans-serif" }}>
              La prima consulenza è gratuita e riservata.
            </p>
            <a
              href={`tel:${telefono}`}
              style={{
                display: 'inline-block',
                background: COLORS.dark,
                color: COLORS.primary,
                padding: '18px 48px',
                borderRadius: 2,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 3,
                textTransform: 'uppercase',
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              Contattaci ora
            </a>
          </Reveal>
        </section>

        {/* Footer */}
        <footer
          style={{
            background: '#060a10',
            padding: '32px 40px',
            textAlign: 'center',
            color: COLORS.muted,
            fontSize: 13,
            fontFamily: "'Segoe UI', sans-serif",
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ marginBottom: 8 }}>{studio}</div>
          <div>{indirizzo} &middot; {telefono} &middot; {email}</div>
          <div style={{ marginTop: 8, opacity: 0.5 }}>
            © {new Date().getFullYear()} — Tutti i diritti riservati
          </div>
        </footer>
      </div>
    </>
  )
}
