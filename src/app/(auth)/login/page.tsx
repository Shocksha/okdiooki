'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Globe, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o password non corretti. Riprova.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">WebAgency</h1>
        <p className="text-indigo-200 mt-1">Manager Platform</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accedi</h2>
        <p className="text-gray-500 text-sm mb-6">Inserisci le tue credenziali per continuare</p>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@webagency.com"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Credenziali Demo</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Admin:</span>
              <span className="font-mono">admin@webagency.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Manager:</span>
              <span className="font-mono">manager@webagency.com / manager123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Collaboratore:</span>
              <span className="font-mono">luca@webagency.com / employee123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
