import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('project') ?? ''
  const assigneeId = searchParams.get('assignee') ?? ''
  const status = searchParams.get('status') ?? ''

  const tasks = await prisma.task.findMany({
    where: {
      AND: [
        projectId ? { projectId } : {},
        assigneeId ? { assigneeId } : {},
        status ? { status } : {},
      ],
    },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, status, priority, dueDate, estimatedHours, projectId, assigneeId } = body

  if (!title || !projectId) {
    return NextResponse.json({ error: 'Titolo e progetto sono obbligatori' }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status ?? 'TODO',
      priority: priority ?? 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      estimatedHours: estimatedHours ?? null,
      projectId,
      assigneeId: assigneeId || null,
    },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(task, { status: 201 })
}
