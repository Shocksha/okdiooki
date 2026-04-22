import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''
  const clientId = searchParams.get('client') ?? ''

  const projects = await prisma.project.findMany({
    where: {
      AND: [
        search ? { name: { contains: search } } : {},
        status ? { status } : {},
        clientId ? { clientId } : {},
      ],
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, status, priority, startDate, endDate, budget, clientId } = body

  if (!name || !clientId) {
    return NextResponse.json({ error: 'Nome e cliente sono obbligatori' }, { status: 400 })
  }

  const userId = (session.user as { id: string }).id

  const project = await prisma.project.create({
    data: {
      name,
      description,
      status: status ?? 'PLANNING',
      priority: priority ?? 'MEDIUM',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      budget: budget ? parseFloat(budget) : null,
      clientId,
      createdById: userId,
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { tasks: true } },
    },
  })

  return NextResponse.json(project, { status: 201 })
}
