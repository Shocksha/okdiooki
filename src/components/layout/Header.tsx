'use client'

import { useSession } from 'next-auth/react'
import { Bell, Search } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/utils'

export default function Header() {
  const { data: session } = useSession()
  const role = (session?.user as { role?: string })?.role ?? 'EMPLOYEE'
  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Cerca..."
          className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors w-64"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[role] ?? role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
