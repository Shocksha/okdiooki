import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = { primary: '#7c6ef5', accent: '#f472b6', success: '#34d399', warning: '#fbbf24', bg: '#0a0a0e', panel: '#111118', border: '#1e1e2e', text: '#e2e2f0', muted: '#6b6b8a' }

const MOCK_REVENUE = [
  { month: 'Nov', value: 3200 },
  { month: 'Dic', value: 4100 },
  { month: 'Gen', value: 2900 },
  { month: 'Feb', value: 5200 },
  { month: 'Mar', value: 4800 },
  { month: 'Apr', value: 6100 },
]

const MOCK_POSTS = [
  { month: 'Nov', gmb: 12, site: 5 },
  { month: 'Dic', gmb: 18, site: 8 },
  { month: 'Gen', gmb: 9,  site: 4 },
  { month: 'Feb', gmb: 24, site: 11 },
  { month: 'Mar', gmb: 20, site: 9 },
  { month: 'Apr', gmb: 31, site: 14 },
]

const MOCK_PIE = [
  { name: 'Attivi', value: 14, color: COLORS.success },
  { name: 'Token scaduto', value: 3, color: COLORS.warning },
  { name: 'Senza token', value: 2, color: COLORS.muted },
]

function KpiCard({ label, value, sub, color = COLORS.primary }) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: '20px 24px',
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 20 }}>{title}</div>
      {children}
    </div>
  )
}

const tipStyle = { background: '#1a1a2e', border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13 }

export default function DashboardView({ clients = [] }) {
  const active = clients.filter(c => c.token_status === 'active').length
  const expired = clients.filter(c => c.token_status === 'expired').length

  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.text, margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: '4px 0 0' }}>Panoramica agenzia</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <KpiCard label="Clienti totali" value={clients.length || 19} sub="Profili GMB" color={COLORS.primary} />
        <KpiCard label="Token attivi" value={active || 14} sub="Connessi a Google" color={COLORS.success} />
        <KpiCard label="Token scaduti" value={expired || 3} sub="Da rinnovare" color={COLORS.warning} />
        <KpiCard label="Post questo mese" value="31" sub="+55% vs mese scorso" color={COLORS.accent} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Fatturato mensile (€)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_REVENUE}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Area type="monotone" dataKey="value" stroke={COLORS.primary} strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Stato clienti">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={MOCK_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {MOCK_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {MOCK_PIE.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                <span style={{ color: COLORS.muted }}>{p.name}</span>
                <span style={{ marginLeft: 'auto', color: COLORS.text, fontWeight: 600 }}>{p.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Posts chart */}
      <Card title="Post pubblicati per mese">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MOCK_POSTS} barGap={4}>
            <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tipStyle} />
            <Bar dataKey="gmb" name="GMB" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="site" name="Sito" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
