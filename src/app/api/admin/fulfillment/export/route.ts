import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { buildFulfillmentExport } from '@/lib/crm/service'

export async function GET(request: NextRequest) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const ids = request.nextUrl.searchParams.getAll('id')

  if (!ids.length) {
    return NextResponse.json({ error: 'Missing ids' }, { status: 400 })
  }

  const buffer = await buildFulfillmentExport(ids)
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="fulfillment-export-${Date.now()}.zip"`,
    },
  })
}
