import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { resolveTicketWithCoupon } from '@/lib/crm/service'

export async function POST(request: NextRequest, context: RouteContext<'/api/admin/tickets/[id]/actions/coupon'>) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'נדרשת הרשאת צוות.' }, { status: 401 })
  const { id } = await context.params
  const body = await request.json()

  try {
    const promotion = await resolveTicketWithCoupon({
      ticketId: id,
      amount: Number(body.amount) || 20,
      kind: body.kind === 'fixed' ? 'fixed' : 'percentage',
      staffUserId: session.staffUser.id,
    })

    return NextResponse.json(promotion)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'יצירת הקופון נכשלה.' },
      { status: 400 }
    )
  }
}
