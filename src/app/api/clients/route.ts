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

  const clients = await prisma.client.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { company: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {},
        status ? { status } : {},
      ],
    },
    include: {
      _count: { select: { projects: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, email, phone, company, address, website, status, notes } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Nome ed email sono obbligatori' }, { status: 400 })
  }

  const client = await prisma.client.create({
    data: { name, email, phone, company, address, website, status: status ?? 'ACTIVE', notes },
    include: { _count: { select: { projects: true, invoices: true } } },
  })

  return NextResponse.json(client, { status: 201 })
}
