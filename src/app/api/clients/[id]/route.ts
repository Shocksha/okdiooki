import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      projects: {
        include: { _count: { select: { tasks: true } } },
        orderBy: { createdAt: 'desc' },
      },
      invoices: { orderBy: { createdAt: 'desc' } },
      _count: { select: { projects: true, invoices: true } },
    },
  })

  if (!client) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })

  return NextResponse.json(client)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, email, phone, company, address, website, status, notes } = body

  const client = await prisma.client.update({
    where: { id: params.id },
    data: { name, email, phone, company, address, website, status, notes },
    include: { _count: { select: { projects: true, invoices: true } } },
  })

  return NextResponse.json(client)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.client.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
