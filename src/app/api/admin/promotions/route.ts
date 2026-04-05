import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { createPromotion, listPromotions } from '@/lib/crm/service'

export async function GET() {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'נדרשת הרשאת צוות.' }, { status: 401 })
  const data = await listPromotions()
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'נדרשת הרשאת צוות.' }, { status: 401 })
  const body = await request.json()
  const promotion = await createPromotion(body)
  return NextResponse.json(promotion)
}
