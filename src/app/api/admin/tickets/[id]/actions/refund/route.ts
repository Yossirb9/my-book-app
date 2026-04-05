import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { resolveTicketWithRefund } from '@/lib/crm/service'

export async function POST(request: NextRequest, context: RouteContext<'/api/admin/tickets/[id]/actions/refund'>) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'נדרשת הרשאת צוות.' }, { status: 401 })
  const { id } = await context.params
  const body = await request.json()

  try {
    await resolveTicketWithRefund({
      ticketId: id,
      amount: Number(body.amount) || 0,
      staffUserId: session.staffUser.id,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'הזיכוי נכשל.' },
      { status: 400 }
    )
  }
}
