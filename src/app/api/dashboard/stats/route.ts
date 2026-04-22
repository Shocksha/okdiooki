import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalClients,
    activeProjects,
    pendingTasks,
    monthlyRevenue,
    totalRevenue,
    overdueInvoices,
    revenueByMonth,
    projectsByStatus,
    recentProjects,
    recentInvoices,
  ] = await Promise.all([
    prisma.client.count({ where: { status: 'ACTIVE' } }),
    prisma.project.count({ where: { status: { in: ['PLANNING', 'IN_PROGRESS', 'REVIEW'] } } }),
    prisma.task.count({ where: { status: { in: ['TODO', 'IN_PROGRESS'] } } }),
    prisma.invoice.aggregate({
      where: { status: 'PAID', issueDate: { gte: firstDayOfMonth } },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { total: true },
    }),
    prisma.invoice.count({ where: { status: 'OVERDUE' } }),
    // Revenue last 6 months
    prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT
        strftime('%Y-%m', issueDate) as month,
        SUM(total) as revenue
      FROM Invoice
      WHERE status = 'PAID'
        AND issueDate >= datetime('now', '-6 months')
      GROUP BY strftime('%Y-%m', issueDate)
      ORDER BY month ASC
    `,
    prisma.project.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.project.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' },
      include: { client: { select: { name: true } } },
    }),
    prisma.invoice.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { name: true } } },
    }),
  ])

  const recentActivity = [
    ...recentProjects.map((p) => ({
      type: 'project',
      title: p.name,
      subtitle: p.client.name,
      date: p.updatedAt.toISOString(),
      status: p.status,
    })),
    ...recentInvoices.map((i) => ({
      type: 'invoice',
      title: i.number,
      subtitle: i.client.name,
      date: i.createdAt.toISOString(),
      status: i.status,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return NextResponse.json({
    totalClients,
    activeProjects,
    pendingTasks,
    monthlyRevenue: monthlyRevenue._sum.total ?? 0,
    totalRevenue: totalRevenue._sum.total ?? 0,
    overdueInvoices,
    revenueByMonth,
    projectsByStatus: projectsByStatus.map((p) => ({
      status: p.status,
      count: p._count.id,
    })),
    recentActivity,
  })
}
