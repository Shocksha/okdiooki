import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { id: true, name: true, company: true } },
      createdBy: { select: { id: true, name: true } },
      tasks: {
        include: { assignee: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      timeEntries: {
        include: { user: { select: { id: true, name: true } }, task: { select: { id: true, title: true } } },
        orderBy: { date: 'desc' },
        take: 10,
      },
      _count: { select: { tasks: true } },
    },
  })

  if (!project) return NextResponse.json({ error: 'Progetto non trovato' }, { status: 404 })

  return NextResponse.json(project)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, status, priority, startDate, endDate, budget, spent } = body

  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      name,
      description,
      status,
      priority,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      budget: budget != null ? parseFloat(budget) : null,
      spent: spent != null ? parseFloat(spent) : undefined,
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { tasks: true } },
    },
  })

  return NextResponse.json(project)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
