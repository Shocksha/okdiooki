import { Reveal, Particles, GLOBAL_STYLES } from './shared.jsx'

const COLORS = {
  primary: '#00ffd5',
  secondary: '#00c4a7',
  dark: '#050c10',
  panel: '#0d1a1f',
  border: '#0d3a3a',
  text: '#e0f7f4',
  muted: '#5fa8a0',
  accent: '#ff3cac',
}

function HexGrid() {
  const hexes = Array.from({ length: 6 }, (_, i) => ({
    x: (i % 3) * 90 + (Math.floor(i / 3) % 2 === 0 ? 0 : 45),
    y: Math.floor(i / 3) * 80,
    delay: i * 0.3,
  }))
  return (
    <svg width="300" height="200" viewBox="0 0 300 200" fill="none" opacity="0.12">
      {hexes.map((h, i) => (
        <polygon
          key={i}
          points={`${h.x + 36},${h.y} ${h.x + 72},${h.y + 20} ${h.x + 72},${h.y + 60} ${h.x + 36},${h.y + 80} ${h.x},${h.y + 60} ${h.x},${h.y + 20}`}
          stroke={COLORS.primary}
          strokeWidth="1"
          fill="none"
          style={{ animation: `pulsate ${2 + i * 0.4}s ${h.delay}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  )
}

function ScanLineIcon({ size = 32, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="8" height="3" fill={color} />
      <rect x="2" y="2" width="3" height="8" fill={color} />
      <rect x="22" y="2" width="8" height="3" fill={color} />
      <rect x="27" y="2" width="3" height="8" fill={color} />
      <rect x="2" y="27" width="8" height="3" fill={color} />
      <rect x="2" y="22" width="3" height="8" fill={color} />
      <rect x="22" y="27" width="8" height="3" fill={color} />
      <rect x="27" y="22" width="3" height="8" fill={color} />
      <line x1="16" y1="8" x2="16" y2="24" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <line x1="8" y1="16" x2="24" y2="16" stroke={color} strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

function GlitchText({ children, style = {} }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export default function TemplateAltro({ data = {} }) {
  const {
    nome = 'Studio Creativo Nexus',
    claim = 'Design senza confini',
    telefono = '+39 02 3334444',
    email = 'hello@nexus.studio',
    indirizzo = 'Via Tortona 12, Milano',
    orari = 'Sempre connessi',
    descrizione = 'Trasformiamo idee radicali in esperienze digitali che ridefiniscono il confine tra arte e tecnologia.',
    servizi = [
      { title: 'Identità visiva', desc: 'Brand design iconico che rimane impresso nella memoria.' },
      { title: 'Web experience', desc: 'Siti che sorprendono, coinvolgono e convertono.' },
      { title: 'Motion design', desc: 'Animazioni e video che danno vita al tuo brand.' },
      { title: 'Digital strategy', desc: 'Strategia digitale integrata per la crescita online.' },
    ],
    progetti = [],
    recensioni = [],
  } = data

  return (
    <>
      <style>{`
        ${GLOBAL_STYLES}
        .neon-border {
          box-shadow: 0 0 0 1px ${COLORS.border}, 0 0 20px rgba(0,255,213,0.05);
        }
        .neon-border:hover {
          box-shadow: 0 0 0 1px ${COLORS.primary}60, 0 0 30px rgba(0,255,213,0.12);
        }
      `}</style>
      <div style={{ fontFamily: "'Courier New', 'Courier', monospace", background: COLORS.dark, color: COLORS.text, minHeight: '100vh' }}>

        {/* Scanline effect overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,213,0.012) 2px, rgba(0,255,213,0.012) 4px)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />

        {/* Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(5,12,16,0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ScanLineIcon size={24} color={COLORS.primary} />
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.primary,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {nome}
            </span>
          </div>
          <a
            href={`mailto:${email}`}
            style={{
              color: COLORS.primary,
              textDecoration: 'none',
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase',
              border: `1px solid ${COLORS.primary}50`,
              padding: '8px 20px',
              borderRadius: 2,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${COLORS.primary}15` }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Contatto
          </a>
        </header>

        {/* Hero */}
        <section
          style={{
            position: 'relative',
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            padding: '80px 32px',
            overflow: 'hidden',
          }}
        >
          <Particles count={30} color="rgba(0,255,213,0.15)" />

          {/* Hex grid decoration */}
          <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }}>
            <HexGrid />
          </div>

          {/* Grid lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${COLORS.border}40 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border}40 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              opacity: 0.3,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
            <div
              style={{
                display: 'inline-block',
                fontSize: 11,
                letterSpacing: 5,
                textTransform: 'uppercase',
                color: COLORS.primary,
                marginBottom: 28,
                animation: 'slideInUp 0.7s ease both',
              }}
            >
              &#62;&#62; {claim} &#60;&#60;
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                fontWeight: 900,
                lineHeight: 1,
                margin: '0 0 28px',
                letterSpacing: -2,
                animation: 'slideInUp 0.7s 0.1s ease both',
              }}
            >
              <GlitchText>
                <span style={{ color: '#fff' }}>WE </span>
                <span style={{ color: COLORS.primary }}>CREATE</span>
              </GlitchText>
              <br />
              <GlitchText>
                <span style={{ color: '#fff' }}>THE </span>
                <span style={{ color: COLORS.accent }}>FUTURE</span>
              </GlitchText>
            </h1>

            <p
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: COLORS.muted,
                margin: '0 0 48px',
                maxWidth: 520,
                animation: 'slideInUp 0.7s 0.2s ease both',
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              {descrizione}
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'slideInUp 0.7s 0.3s ease both' }}>
              <a
                href={`mailto:${email}`}
                style={{
                  background: COLORS.primary,
                  color: COLORS.dark,
                  padding: '16px 40px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  fontWeight: 900,
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}
              >
                Inizia progetto
              </a>
              <a
                href="#lavori"
                style={{
                  border: `1px solid ${COLORS.primary}50`,
                  color: COLORS.primary,
                  padding: '16px 40px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}
              >
                Portfolio
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="lavori" style={{ padding: '80px 32px', background: COLORS.panel }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <Reveal>
              <div style={{ marginBottom: 56 }}>
                <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: COLORS.primary, marginBottom: 16 }}>
                  // CAPABILITIES
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, margin: 0, letterSpacing: -1 }}>
                  What we do best
                </h2>
              </div>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2 }}>
              {servizi.map((s, i) => (
                <Reveal key={s.title} delay={i * 80} direction="up">
                  <div
                    className="neon-border"
                    style={{
                      background: COLORS.dark,
                      border: `1px solid ${COLORS.border}`,
                      padding: '32px',
                      cursor: 'default',
                      transition: 'border-color 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = COLORS.primary + '60'
                      e.currentTarget.style.boxShadow = `0 0 30px rgba(0,255,213,0.1)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = COLORS.border
                      e.currentTarget.style.boxShadow = ''
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: COLORS.primary,
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                        marginBottom: 12,
                        opacity: 0.7,
                      }}
                    >
                      0{i + 1}
                    </div>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        margin: '0 0 10px',
                        letterSpacing: -0.5,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: COLORS.muted,
                        margin: 0,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
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
                <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: COLORS.primary, marginBottom: 16 }}>
                  // CLIENT_FEEDBACK
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, margin: '0 0 48px', letterSpacing: -1 }}>
                  Cosa dicono
                </h2>
              </Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {recensioni.map((r, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        borderLeft: `3px solid ${COLORS.primary}`,
                        padding: '24px',
                        background: COLORS.panel,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      <p style={{ fontSize: 15, lineHeight: 1.7, margin: '0 0 16px', color: COLORS.text, fontStyle: 'italic' }}>
                        "{r.testo}"
                      </p>
                      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, letterSpacing: 2, textTransform: 'uppercase' }}>
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
            position: 'relative',
            background: COLORS.panel,
            borderTop: `1px solid ${COLORS.border}`,
            padding: '80px 32px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <Particles count={20} color="rgba(0,255,213,0.1)" />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${COLORS.border}30 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border}30 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <Reveal>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: COLORS.primary, marginBottom: 16 }}>
                // NEXT_LEVEL
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: 900,
                  margin: '0 0 20px',
                  letterSpacing: -1,
                }}
              >
                Pronto a collaborare?
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: COLORS.muted,
                  margin: '0 0 40px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}
              >
                Parliamo del tuo progetto. Nessun briefing troppo folle.
              </p>
              <a
                href={`mailto:${email}`}
                style={{
                  display: 'inline-block',
                  background: COLORS.primary,
                  color: COLORS.dark,
                  padding: '18px 52px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  fontWeight: 900,
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                Scrivici ora
              </a>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer
          style={{
            background: '#020608',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            borderTop: `1px solid ${COLORS.border}`,
            fontSize: 12,
            color: COLORS.muted,
          }}
        >
          <div>{nome} &mdash; {indirizzo}</div>
          <div>{email} &middot; {orari}</div>
          <div>© {new Date().getFullYear()}</div>
        </footer>
      </div>
    </>
  )
}
