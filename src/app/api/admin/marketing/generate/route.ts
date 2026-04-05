import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { generateMarketingAsset } from '@/lib/crm/service'

export async function POST(request: NextRequest) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const asset = await generateMarketingAsset({
    ...body,
    staffUserId: session.staffUser.id,
  })

  return NextResponse.json(asset)
}
