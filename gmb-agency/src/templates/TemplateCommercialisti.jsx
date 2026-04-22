import { Reveal, Particles, GLOBAL_STYLES } from './shared.jsx'

const COLORS = {
  primary: '#16a34a',
  secondary: '#15803d',
  accent: '#22c55e',
  dark: '#0a1f12',
  bg: '#f0fdf4',
  card: '#ffffff',
  text: '#14532d',
  muted: '#4b7a5a',
  border: '#bbf7d0',
}

function ChartBarIcon({ size = 40, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="20" width="8" height="16" rx="2" fill={color} opacity="0.5" />
      <rect x="16" y="12" width="8" height="24" rx="2" fill={color} opacity="0.75" />
      <rect x="28" y="6" width="8" height="30" rx="2" fill={color} />
    </svg>
  )
}

function TrendUpIcon({ size = 20, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 14 L7 10 L11 12 L17 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6 H17 V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderTop: `3px solid ${COLORS.primary}`,
        borderRadius: 8,
        padding: '28px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: COLORS.primary, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: '8px 0 4px' }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.muted }}>{sub}</div>}
    </div>
  )
}

export default function TemplateCommercialisti({ data = {} }) {
  const {
    nome = 'Dott. Andrea Verdi',
    studio = 'Studio Commercialisti Verdi & Partners',
    telefono = '+39 011 5556789',
    email = 'info@studioverdi.it',
    indirizzo = 'Corso Francia 45, Torino',
    orari = 'Lun-Ven: 9:00-18:00',
    servizi = [
      'Contabilità e bilancio',
      'Dichiarazioni fiscali',
      'Consulenza societaria',
      'Gestione paghe',
      'Revisione legale',
      'Pianificazione fiscale',
    ],
    descrizione = 'Studio di commercialisti con approccio data-driven. Trasformiamo i numeri in decisioni strategiche per la tua impresa.',
    stats = [
      { label: 'Clienti attivi', value: '250+', sub: 'Aziende e professionisti' },
      { label: 'Anni di esperienza', value: '18', sub: 'Sul mercato dal 2006' },
      { label: 'Risparmio medio', value: '23%', sub: 'Carico fiscale clienti' },
    ],
    recensioni = [],
  } = data

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#fff', color: COLORS.text }}>

        {/* Hero */}
        <section
          style={{
            position: 'relative',
            background: `linear-gradient(135deg, ${COLORS.dark} 0%, #0d3320 100%)`,
            color: '#fff',
            padding: '100px 24px 80px',
            overflow: 'hidden',
          }}
        >
          <Particles count={18} color="rgba(34,197,94,0.15)" />

          {/* Animated bar chart decoration */}
          <div style={{ position: 'absolute', right: 60, bottom: 0, opacity: 0.08 }}>
            <ChartBarIcon size={360} color={COLORS.accent} />
          </div>

          <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 4,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 28,
                color: COLORS.accent,
                animation: 'slideInUp 0.6s ease both',
              }}
            >
              <TrendUpIcon size={14} color={COLORS.accent} />
              Consulenza fiscale e societaria
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                margin: '0 0 20px',
                animation: 'slideInUp 0.6s 0.1s ease both',
              }}
            >
              {studio}
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                opacity: 0.85,
                margin: '0 0 48px',
                maxWidth: 580,
                animation: 'slideInUp 0.6s 0.2s ease both',
              }}
            >
              {descrizione}
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'slideInUp 0.6s 0.3s ease both' }}>
              <a
                href={`mailto:${email}`}
                style={{
                  background: COLORS.accent,
                  color: COLORS.dark,
                  padding: '15px 32px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                Richiedi consulenza
              </a>
              <a
                href="#servizi"
                style={{
                  border: '2px solid rgba(34,197,94,0.4)',
                  color: COLORS.accent,
                  padding: '15px 32px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                I nostri servizi
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: COLORS.bg, padding: '60px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <StatCard {...s} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="servizi" style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: COLORS.primary, marginBottom: 8 }}>
                Cosa facciamo
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, margin: 0 }}>
                Servizi professionali
              </h2>
              <div style={{ width: 48, height: 4, background: COLORS.accent, borderRadius: 2, marginTop: 16 }} />
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {servizi.map((s, i) => (
              <Reveal key={s} delay={i * 70} direction="up">
                <div
                  style={{
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = COLORS.primary
                    e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.primary}20`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.borderColor = COLORS.border
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: `${COLORS.primary}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <TrendUpIcon size={18} color={COLORS.primary} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{s}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact bar */}
        <section
          style={{
            background: COLORS.bg,
            borderTop: `1px solid ${COLORS.border}`,
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '32px 24px',
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 20,
              textAlign: 'center',
            }}
          >
            {[
              { label: 'Indirizzo', value: indirizzo },
              { label: 'Telefono', value: telefono },
              { label: 'Email', value: email },
              { label: 'Orari', value: orari },
            ].map((c) => (
              <div key={c.label}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.primary, marginBottom: 6 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 14, color: COLORS.text }}>{c.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recensioni */}
        {recensioni.length > 0 && (
          <section style={{ padding: '80px 24px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <Reveal>
                <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, margin: '0 0 48px' }}>
                  Cosa dicono di noi
                </h2>
              </Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {recensioni.map((r, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div
                      style={{
                        background: COLORS.bg,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 10,
                        padding: '24px',
                        position: 'relative',
                      }}
                    >
                      <div style={{ fontSize: 40, lineHeight: 1, color: COLORS.primary, opacity: 0.3, fontWeight: 900, marginBottom: 8 }}>"</div>
                      <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 16px' }}>{r.testo}</p>
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
            background: `linear-gradient(135deg, ${COLORS.dark}, #0d3320)`,
            padding: '80px 24px',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <Reveal>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, margin: '0 0 16px' }}>
              Ottimizza la tua fiscalità
            </h2>
            <p style={{ opacity: 0.8, fontSize: 17, margin: '0 0 36px' }}>
              Prima consulenza gratuita — nessun impegno.
            </p>
            <a
              href={`tel:${telefono}`}
              style={{
                background: COLORS.accent,
                color: COLORS.dark,
                padding: '18px 44px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 900,
                fontSize: 17,
                display: 'inline-block',
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
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            padding: '24px',
            fontSize: 13,
          }}
        >
          © {new Date().getFullYear()} {studio} — P.IVA e CF disponibili su richiesta
        </footer>
      </div>
    </>
  )
}
