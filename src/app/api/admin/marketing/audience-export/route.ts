import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { exportAudience } from '@/lib/crm/service'

export async function POST(request: NextRequest) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'נדרשת הרשאת צוות.' }, { status: 401 })
  const body = await request.json()
  const result = await exportAudience({
    ...body,
    staffUserId: session.staffUser.id,
  })

  if (!result.exportRow) {
    return NextResponse.json({ error: 'יצירת קובץ הייצוא נכשלה.' }, { status: 500 })
  }

  return NextResponse.json({
    id: result.exportRow.id,
    fileName: result.exportRow.file_name,
    csv: result.csv,
  })
}
