'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  Euro,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { DashboardStats } from '@/types'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const PIE_COLORS = ['#6366f1', '#3b82f6', '#f59e0b', '#10b981', '#f97316', '#ef4444']

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!stats) return null

  const kpis = [
    {
      label: 'Clienti Attivi',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-blue-500',
      href: '/clients',
    },
    {
      label: 'Progetti in Corso',
      value: stats.activeProjects,
      icon: FolderKanban,
      color: 'bg-indigo-500',
      href: '/projects',
    },
    {
      label: 'Task Aperti',
      value: stats.pendingTasks,
      icon: CheckSquare,
      color: 'bg-yellow-500',
      href: '/tasks',
    },
    {
      label: 'Fatturato Mese',
      value: formatCurrency(stats.monthlyRevenue),
      icon: Euro,
      color: 'bg-green-500',
      href: '/invoices',
    },
    {
      label: 'Fatturato Totale',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-purple-500',
      href: '/invoices',
    },
    {
      label: 'Fatture Scadute',
      value: stats.overdueInvoices,
      icon: AlertTriangle,
      color: 'bg-red-500',
      href: '/invoices',
    },
  ]

  const revenueData = stats.revenueByMonth.map((r) => ({
    ...r,
    month: new Date(r.month + '-01').toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }),
  }))

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Panoramica della tua web agency</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Fatturato Ultimi 6 Mesi</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Fatturato']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              Nessun dato disponibile
            </div>
          )}
        </div>

        {/* Projects by status pie */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Progetti per Stato</h2>
          {stats.projectsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.projectsByStatus.map((p) => ({
                    name: STATUS_LABELS[p.status] ?? p.status,
                    value: p.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.projectsByStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              Nessun progetto
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Attività Recenti</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {stats.recentActivity.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Nessuna attività recente</div>
          )}
          {stats.recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                    item.type === 'project' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'
                  )}
                >
                  {item.type === 'project' ? 'P' : 'F'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[item.status])}>
                  {STATUS_LABELS[item.status] ?? item.status}
                </span>
                <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
