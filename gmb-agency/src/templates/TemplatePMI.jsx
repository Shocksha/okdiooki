import { Reveal, Particles, GLOBAL_STYLES } from './shared.jsx'

const COLORS = {
  primary: '#7c3aed',
  secondary: '#6d28d9',
  accent: '#ec4899',
  light: '#fdf4ff',
  dark: '#1e0a3c',
  text: '#1e1b4b',
  muted: '#6b7280',
  gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
}

function GearIcon({ size = 40, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="6" stroke={color} strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 20 + 9 * Math.cos(rad)
        const y1 = 20 + 9 * Math.sin(rad)
        const x2 = 20 + 14 * Math.cos(rad)
        const y2 = 20 + 14 * Math.sin(rad)
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />
      })}
    </svg>
  )
}

function RocketIcon({ size = 48, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 4C24 4 36 8 36 24C36 34 28 42 24 44C20 42 12 34 12 24C12 8 24 4 24 4Z" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="22" r="4" fill={color} />
      <path d="M14 32 L8 38 L10 44 L16 42 L18 36Z" fill={color} opacity="0.7" />
      <path d="M34 32 L40 38 L38 44 L32 42 L30 36Z" fill={color} opacity="0.7" />
    </svg>
  )
}

function ArrowRightIcon({ color = '#fff' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M12 6l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FeatureCard({ title, desc, index }) {
  const gradients = [
    'linear-gradient(135deg, #7c3aed20, #ec489920)',
    'linear-gradient(135deg, #ec489920, #f9731620)',
    'linear-gradient(135deg, #0ea5e920, #7c3aed20)',
    'linear-gradient(135deg, #22c55e20, #0ea5e920)',
    'linear-gradient(135deg, #f59e0b20, #ef444420)',
    'linear-gradient(135deg, #8b5cf620, #ec489920)',
  ]
  return (
    <div
      style={{
        background: gradients[index % gradients.length],
        border: '1px solid rgba(124,58,237,0.15)',
        borderRadius: 16,
        padding: '28px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <GearIcon size={32} color={COLORS.primary} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', color: COLORS.text }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: COLORS.muted }}>{desc}</p>
    </div>
  )
}

export default function TemplatePMI({ data = {} }) {
  const {
    nome = 'TechBuild Srl',
    settore = 'Soluzioni tecnologiche per PMI',
    telefono = '+39 02 7654321',
    email = 'ciao@techbuild.it',
    indirizzo = 'Via dell\'Innovazione 22, Milano',
    orari = 'Lun-Ven: 8:30-18:30',
    descrizione = 'Aiutiamo le PMI a crescere con soluzioni digitali su misura, veloci e convenienti.',
    servizi = [
      { title: 'Siti web professionali', desc: 'Design moderno e performante, ottimizzato per i motori di ricerca.' },
      { title: 'E-commerce', desc: 'Negozio online completo con gestione ordini e pagamenti sicuri.' },
      { title: 'Marketing digitale', desc: 'Campagne Google e social media per aumentare visibilità e vendite.' },
      { title: 'CRM & Gestionale', desc: 'Software personalizzato per gestire clienti, vendite e fatturazione.' },
      { title: 'App mobile', desc: 'Applicazioni iOS e Android per raggiungere i tuoi clienti ovunque.' },
      { title: 'Supporto 24/7', desc: 'Assistenza tecnica dedicata sempre disponibile per la tua azienda.' },
    ],
    recensioni = [],
  } = data

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#fff', color: COLORS.text }}>

        {/* Navbar */}
        <nav
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(124,58,237,0.1)',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: COLORS.gradient, borderRadius: 10, padding: 8 }}>
              <RocketIcon size={24} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, background: COLORS.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {nome}
            </span>
          </div>
          <a
            href={`tel:${telefono}`}
            style={{
              background: COLORS.gradient,
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 99,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Contattaci
          </a>
        </nav>

        {/* Hero */}
        <section
          style={{
            position: 'relative',
            background: COLORS.dark,
            overflow: 'hidden',
            padding: '100px 32px 80px',
            textAlign: 'center',
          }}
        >
          <Particles count={25} color="rgba(236,72,153,0.15)" />

          {/* Gradient blobs */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              left: -100,
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
              animation: 'blobMove 12s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -100,
              right: -100,
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)',
              animation: 'blobMove 15s 3s ease-in-out infinite reverse',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-block',
                background: COLORS.gradient,
                padding: '2px',
                borderRadius: 99,
                marginBottom: 28,
                animation: 'slideInUp 0.7s ease both',
              }}
            >
              <div
                style={{
                  background: COLORS.dark,
                  borderRadius: 99,
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#c4b5fd',
                  letterSpacing: 1,
                }}
              >
                {settore}
              </div>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: '0 0 24px',
                color: '#fff',
                animation: 'slideInUp 0.7s 0.1s ease both',
              }}
            >
              Fai crescere il tuo{' '}
              <span
                style={{
                  background: COLORS.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                business digitale
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.7)',
                margin: '0 0 48px',
                animation: 'slideInUp 0.7s 0.2s ease both',
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
                animation: 'slideInUp 0.7s 0.3s ease both',
              }}
            >
              <a
                href={`mailto:${email}`}
                style={{
                  background: COLORS.gradient,
                  color: '#fff',
                  padding: '16px 40px',
                  borderRadius: 99,
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Inizia ora <ArrowRightIcon />
              </a>
              <a
                href="#servizi"
                style={{
                  border: '2px solid rgba(196,181,253,0.3)',
                  color: '#c4b5fd',
                  padding: '16px 40px',
                  borderRadius: 99,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Scopri i servizi
              </a>
            </div>
          </div>

          {/* Floating rocket */}
          <div
            style={{
              position: 'absolute',
              right: 80,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.15,
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            <RocketIcon size={200} color="#c4b5fd" />
          </div>
        </section>

        {/* Services */}
        <section id="servizi" style={{ padding: '80px 32px', background: COLORS.light }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: COLORS.primary,
                    marginBottom: 12,
                  }}
                >
                  Cosa offriamo
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 900,
                    margin: 0,
                    background: COLORS.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Soluzioni per ogni esigenza
                </h2>
              </div>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {servizi.map((s, i) => (
                <Reveal key={s.title} delay={i * 80} direction="up">
                  <FeatureCard {...s} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Recensioni */}
        {recensioni.length > 0 && (
          <section style={{ padding: '80px 32px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
              <Reveal>
                <h2
                  style={{
                    textAlign: 'center',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 900,
                    margin: '0 0 48px',
                    background: COLORS.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  I nostri clienti parlano
                </h2>
              </Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {recensioni.map((r, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(236,72,153,0.05))',
                        border: '1px solid rgba(124,58,237,0.12)',
                        borderRadius: 16,
                        padding: '28px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                        {Array.from({ length: r.stars || 5 }).map((_, j) => (
                          <div key={j} style={{ color: '#f59e0b', fontSize: 16 }}>&#9733;</div>
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
            background: COLORS.gradient,
            padding: '80px 32px',
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Particles count={15} color="rgba(255,255,255,0.1)" />
          <Reveal>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, margin: '0 0 16px', position: 'relative', zIndex: 1 }}>
              Pronto a decollare?
            </h2>
            <p style={{ opacity: 0.9, fontSize: 18, margin: '0 0 36px', position: 'relative', zIndex: 1 }}>
              Parliamo del tuo progetto — prima call gratuita.
            </p>
            <a
              href={`tel:${telefono}`}
              style={{
                display: 'inline-block',
                background: '#fff',
                color: COLORS.primary,
                padding: '18px 48px',
                borderRadius: 99,
                textDecoration: 'none',
                fontWeight: 900,
                fontSize: 17,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Chiamaci: {telefono}
            </a>
          </Reveal>
        </section>

        {/* Footer */}
        <footer
          style={{
            background: COLORS.dark,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            padding: '28px 24px',
            fontSize: 13,
          }}
        >
          <div style={{ marginBottom: 4 }}>
            {nome} — {indirizzo}
          </div>
          <div>
            {email} &middot; {orari}
          </div>
          <div style={{ marginTop: 8, opacity: 0.4 }}>
            © {new Date().getFullYear()} — Tutti i diritti riservati
          </div>
        </footer>
      </div>
    </>
  )
}
