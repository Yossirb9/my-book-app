import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { bulkUpdateFulfillmentStatuses } from '@/lib/crm/service'

export async function POST(request: NextRequest) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()

  if (!Array.isArray(body.fulfillmentIds) || !body.status) {
    return NextResponse.json({ error: 'Missing fulfillmentIds or status' }, { status: 400 })
  }

  const data = await bulkUpdateFulfillmentStatuses(body.fulfillmentIds, body.status, session.staffUser.id)
  return NextResponse.json({ updated: data.length })
}
