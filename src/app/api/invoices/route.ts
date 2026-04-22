import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInvoiceNumber } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''
  const clientId = searchParams.get('client') ?? ''

  const invoices = await prisma.invoice.findMany({
    where: {
      AND: [
        status ? { status } : {},
        clientId ? { clientId } : {},
      ],
    },
    include: {
      client: { select: { id: true, name: true, company: true, email: true, address: true } },
      project: { select: { id: true, name: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(invoices)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { clientId, projectId, dueDate, notes, tax, items } = body

  if (!clientId || !dueDate || !items?.length) {
    return NextResponse.json({ error: 'Cliente, scadenza e almeno un articolo sono obbligatori' }, { status: 400 })
  }

  const subtotal = items.reduce((s: number, i: { total: number }) => s + i.total, 0)
  const taxAmount = subtotal * ((tax ?? 0) / 100)
  const total = subtotal + taxAmount

  const invoice = await prisma.invoice.create({
    data: {
      number: generateInvoiceNumber(),
      status: 'DRAFT',
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      subtotal,
      tax: taxAmount,
      total,
      notes,
      clientId,
      projectId: projectId || null,
      items: {
        create: items.map((item: { description: string; quantity: number; unitPrice: number; total: number }) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
      },
    },
    include: {
      client: { select: { id: true, name: true, company: true, email: true, address: true } },
      project: { select: { id: true, name: true } },
      items: true,
    },
  })

  return NextResponse.json(invoice, { status: 201 })
}
