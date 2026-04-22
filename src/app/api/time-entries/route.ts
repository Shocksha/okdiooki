import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('project') ?? ''
  const userId = searchParams.get('user') ?? ''

  const entries = await prisma.timeEntry.findMany({
    where: {
      AND: [
        projectId ? { projectId } : {},
        userId ? { userId } : {},
      ],
    },
    include: {
      project: { select: { id: true, name: true } },
      task: { select: { id: true, title: true } },
      user: { select: { id: true, name: true } },
    },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { description, hours, date, projectId, taskId } = body

  if (!hours || !projectId) {
    return NextResponse.json({ error: 'Ore e progetto sono obbligatori' }, { status: 400 })
  }

  const userId = (session.user as { id: string }).id

  const entry = await prisma.timeEntry.create({
    data: {
      description,
      hours: parseFloat(hours),
      date: date ? new Date(date) : new Date(),
      projectId,
      taskId: taskId || null,
      userId,
    },
    include: {
      project: { select: { id: true, name: true } },
      task: { select: { id: true, title: true } },
      user: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
