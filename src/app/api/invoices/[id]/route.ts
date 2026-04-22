import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { id: true, name: true, company: true, email: true, address: true } },
      project: { select: { id: true, name: true } },
      items: true,
    },
  })

  if (!invoice) return NextResponse.json({ error: 'Fattura non trovata' }, { status: 404 })

  return NextResponse.json(invoice)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { status, notes, dueDate, items, tax } = body

  let updateData: Record<string, unknown> = { status, notes }

  if (dueDate) updateData.dueDate = new Date(dueDate)

  if (items) {
    const subtotal = items.reduce((s: number, i: { total: number }) => s + i.total, 0)
    const taxAmount = subtotal * ((tax ?? 0) / 100)
    updateData = { ...updateData, subtotal, tax: taxAmount, total: subtotal + taxAmount }

    // Delete and recreate items
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: params.id } })
    await prisma.invoiceItem.createMany({
      data: items.map((item: { description: string; quantity: number; unitPrice: number; total: number }) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        invoiceId: params.id,
      })),
    })
  }

  const invoice = await prisma.invoice.update({
    where: { id: params.id },
    data: updateData,
    include: {
      client: { select: { id: true, name: true, company: true, email: true, address: true } },
      project: { select: { id: true, name: true } },
      items: true,
    },
  })

  return NextResponse.json(invoice)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.invoice.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
