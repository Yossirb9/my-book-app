import { NextRequest, NextResponse } from 'next/server'
import { createSupportTicket } from '@/lib/crm/service'

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.email || !body.subject || !body.message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const ticket = await createSupportTicket({
    email: body.email,
    fullName: body.fullName,
    phone: body.phone,
    subject: body.subject,
    message: body.message,
    bookId: body.bookId || null,
    orderId: body.orderId || null,
  })

  if (!ticket) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }

  return NextResponse.json({ ticketId: ticket.id })
}
