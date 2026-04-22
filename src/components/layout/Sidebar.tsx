'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  FileText,
  UserCheck,
  Settings,
  Globe,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clienti', icon: Users },
  { href: '/projects', label: 'Progetti', icon: FolderKanban },
  { href: '/tasks', label: 'Task', icon: CheckSquare },
  { href: '/time-tracking', label: 'Ore Lavorate', icon: Clock },
  { href: '/invoices', label: 'Fatture', icon: FileText },
  { href: '/team', label: 'Team', icon: UserCheck },
  { href: '/settings', label: 'Impostazioni', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">WebAgency</p>
          <p className="text-gray-400 text-xs">Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gray-700/50">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Esci
        </button>
      </div>
    </aside>
  )
}
