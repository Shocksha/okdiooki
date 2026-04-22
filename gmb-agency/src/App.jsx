import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar.jsx'
import DashboardView from './components/DashboardView.jsx'
import ClientsView from './components/ClientsView.jsx'
import PostsView from './components/PostsView.jsx'
import SitesView from './components/SitesView.jsx'
import SettingsView from './components/SettingsView.jsx'

const VIEWS = { dashboard: DashboardView, clients: ClientsView, posts: PostsView, sites: SitesView, settings: SettingsView }

export default function App() {
  const [view, setView] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [clients, setClients] = useState([])

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) setClients(await res.json())
    } catch {
      // backend not available in dev mode; mock data used inside views
    }
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const View = VIEWS[view] || VIEWS.dashboard

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#0a0a0e',
        color: '#e2e2f0',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      <Sidebar active={view} onNav={setView} collapsed={collapsed} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header
          style={{
            height: 56,
            background: '#111118',
            borderBottom: '1px solid #1e1e2e',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b6b8a',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
            title="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          </button>

          <div style={{ flex: 1 }} />

          <div
            style={{
              fontSize: 12,
              color: '#6b6b8a',
              background: '#1a1a2a',
              border: '1px solid #1e1e2e',
              borderRadius: 6,
              padding: '5px 12px',
            }}
          >
            {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#7c6ef5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: '#fff',
              cursor: 'pointer',
            }}
            title="Admin"
          >
            A
          </div>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <View clients={clients} onRefresh={fetchClients} />
        </main>
      </div>
    </div>
  )
}
