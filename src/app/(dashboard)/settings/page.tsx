'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Save, Loader2, User, Shield, Palette, Bell } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/utils'

export default function SettingsPage() {
  const { data: session } = useSession()
  const role = (session?.user as { role?: string })?.role ?? ''
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({ name: session?.user?.name ?? '', email: session?.user?.email ?? '', position: '', phone: '' })

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const userId = (session?.user as { id?: string })?.id
    if (userId) {
      await fetch(`/api/team/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile', label: 'Profilo', icon: User },
    { id: 'security', label: 'Sicurezza', icon: Shield },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
    { id: 'appearance', label: 'Aspetto', icon: Palette },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
        <p className="text-gray-500 text-sm mt-1">Gestisci il tuo account e le preferenze</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Informazioni Personali</h2>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                    {session?.user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{session?.user?.name}</p>
                    <p className="text-sm text-gray-500">{ROLE_LABELS[role] ?? role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
                    <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={profile.email} disabled className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Posizione</label>
                    <input value={profile.position} onChange={(e) => setProfile({...profile, position: e.target.value})} placeholder="es. Senior Developer" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefono</label>
                    <input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Salvataggio...' : 'Salva modifiche'}
                  </button>
                  {saved && <span className="text-sm text-green-600 font-medium">Salvato!</span>}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Sicurezza Account</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password attuale</label>
                  <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nuova password</label>
                  <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Conferma nuova password</label>
                  <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-sm" />
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                  <Shield className="w-4 h-4" /> Aggiorna Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Preferenze Notifiche</h2>
              <div className="space-y-4">
                {[
                  { label: 'Nuovi task assegnati', desc: 'Ricevi una notifica quando ti viene assegnato un task' },
                  { label: 'Scadenze in avvicinamento', desc: 'Avviso 2 giorni prima della scadenza di un task' },
                  { label: 'Aggiornamenti progetto', desc: 'Notifiche sui cambiamenti di stato dei progetti' },
                  { label: 'Nuove fatture', desc: 'Avviso quando viene creata o pagata una fattura' },
                ].map(({ label, desc }, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <button className="relative w-11 h-6 bg-indigo-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Aspetto</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Tema</p>
                  <div className="grid grid-cols-3 gap-3 max-w-sm">
                    {['Chiaro', 'Scuro', 'Sistema'].map((theme) => (
                      <button key={theme} className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${theme === 'Chiaro' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Lingua</p>
                  <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Italiano</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
