import { NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { getCustomerDetail } from '@/lib/crm/service'

export async function GET(_request: Request, context: RouteContext<'/api/admin/customers/[id]'>) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  const data = await getCustomerDetail(id)

  if (!data) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
