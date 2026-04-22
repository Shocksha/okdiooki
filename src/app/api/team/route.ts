import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      position: true,
      phone: true,
      createdAt: true,
      _count: { select: { assignedTasks: true, timeEntries: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as { role?: string }).role
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name, email, password, role: userRole, position, phone } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Nome, email e password sono obbligatori' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email già in uso' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: userRole ?? 'EMPLOYEE', position, phone },
    select: { id: true, email: true, name: true, role: true, position: true, phone: true, createdAt: true },
  })

  return NextResponse.json(user, { status: 201 })
}
