import { NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { getDashboardData } from '@/lib/crm/service'

export async function GET() {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await getDashboardData()
  return NextResponse.json(data)
}
