import { Reveal, Particles, GLOBAL_STYLES } from './shared.jsx'

const COLORS = {
  primary: '#0891b2',
  secondary: '#0e7490',
  accent: '#06b6d4',
  light: '#ecfeff',
  dark: '#0c1a2e',
  text: '#1e293b',
  muted: '#64748b',
}

function CrossIcon({ size = 24, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="10" y="3" width="4" height="18" rx="2" fill={color} />
      <rect x="3" y="10" width="18" height="4" rx="2" fill={color} />
    </svg>
  )
}

function HeartIcon({ size = 24, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function PulseRing({ style = {} }) {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: `3px solid ${COLORS.accent}`,
        animation: 'pulsate 2s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export default function TemplateMedici({ data = {} }) {
  const {
    nome = 'Dr. Marco Rossi',
    specializzazione = 'Medico di Medicina Generale',
    telefono = '+39 02 1234567',
    email = 'info@studiomedico.it',
    indirizzo = 'Via della Salute 15, Milano',
    orari = 'Lun-Ven: 9:00-13:00 / 15:00-19:00',
    servizi = ['Visite generali', 'Prevenzione', 'Medicina del lavoro', 'Certificazioni'],
    descrizione = 'Studio medico professionale con oltre 20 anni di esperienza al servizio dei pazienti.',
    recensioni = [],
  } = data

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.text, background: '#fff' }}>

        {/* Hero */}
        <section
          style={{
            position: 'relative',
            background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.secondary} 100%)`,
            color: '#fff',
            padding: '100px 24px 80px',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          <Particles count={15} color="rgba(6,182,212,0.2)" />
          <div style={{ position: 'absolute', top: -40, left: -40, opacity: 0.08 }}>
            <PulseRing style={{ width: 300, height: 300 }} />
          </div>
          <div style={{ position: 'absolute', bottom: -60, right: -60, opacity: 0.06 }}>
            <PulseRing style={{ width: 400, height: 400 }} />
          </div>

          <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(6,182,212,0.2)',
                border: '1px solid rgba(6,182,212,0.4)',
                borderRadius: 999,
                padding: '6px 16px',
                fontSize: 13,
                marginBottom: 24,
                animation: 'slideInUp 0.6s ease',
              }}
            >
              <CrossIcon size={14} color={COLORS.accent} />
              {specializzazione}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                margin: '0 0 16px',
                lineHeight: 1.1,
                animation: 'slideInUp 0.6s 0.1s ease both',
              }}
            >
              {nome}
            </h1>

            <p
              style={{
                fontSize: 18,
                opacity: 0.85,
                margin: '0 0 40px',
                animation: 'slideInUp 0.6s 0.2s ease both',
              }}
            >
              {descrizione}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
                animation: 'slideInUp 0.6s 0.3s ease both',
              }}
            >
              <a
                href={`tel:${telefono}`}
                style={{
                  background: COLORS.accent,
                  color: '#fff',
                  padding: '14px 32px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                Prenota visita
              </a>
              <a
                href="#servizi"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  padding: '14px 32px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Scopri i servizi
              </a>
            </div>
          </div>
        </section>

        {/* Info strip */}
        <section
          style={{
            background: COLORS.light,
            padding: '32px 24px',
            borderBottom: `3px solid ${COLORS.accent}`,
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 24,
              textAlign: 'center',
            }}
          >
            {[
              { label: 'Telefono', value: telefono },
              { label: 'Email', value: email },
              { label: 'Indirizzo', value: indirizzo },
              { label: 'Orari', value: orari },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: COLORS.primary, marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15, color: COLORS.text }}>{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="servizi" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, color: COLORS.dark, margin: 0 }}>
                I nostri servizi
              </h2>
              <div style={{ width: 60, height: 4, background: COLORS.accent, borderRadius: 2, margin: '16px auto 0' }} />
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 24,
            }}
          >
            {servizi.map((s, i) => (
              <Reveal key={s} delay={i * 80} direction="up">
                <div
                  style={{
                    background: COLORS.light,
                    border: `1px solid ${COLORS.accent}30`,
                    borderRadius: 12,
                    padding: '28px 20px',
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 12px 32px ${COLORS.accent}30`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <CrossIcon size={32} color={COLORS.primary} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.dark }}>{s}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Recensioni */}
        {recensioni.length > 0 && (
          <section style={{ background: COLORS.light, padding: '80px 24px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <Reveal>
                <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, color: COLORS.dark, margin: '0 0 48px' }}>
                  Cosa dicono i pazienti
                </h2>
              </Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {recensioni.map((r, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: '24px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <HeartIcon key={j} size={16} color={j < (r.stars || 5) ? '#f59e0b' : '#e2e8f0'} />
                        ))}
                      </div>
                      <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 16px', color: COLORS.text }}>"{r.testo}"</p>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.primary }}>{r.nome}</div>
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
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
            padding: '80px 24px',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <Reveal>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, margin: '0 0 16px' }}>
              Prenota la tua visita oggi
            </h2>
            <p style={{ opacity: 0.9, fontSize: 17, margin: '0 0 32px' }}>
              Siamo qui per prenderci cura della tua salute
            </p>
            <a
              href={`tel:${telefono}`}
              style={{
                display: 'inline-block',
                background: '#fff',
                color: COLORS.primary,
                padding: '16px 40px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: 17,
              }}
            >
              Chiama ora: {telefono}
            </a>
          </Reveal>
        </section>

        {/* Footer */}
        <footer
          style={{
            background: COLORS.dark,
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            padding: '24px',
            fontSize: 13,
          }}
        >
          © {new Date().getFullYear()} {nome} — {indirizzo}
        </footer>
      </div>
    </>
  )
}
