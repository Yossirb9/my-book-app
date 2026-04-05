import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireStaffApiUser } from '@/lib/crm/auth'
import { resolveTicketWithRegenerateOverride } from '@/lib/crm/service'

export async function POST(
  request: NextRequest,
  context: RouteContext<'/api/admin/tickets/[id]/actions/regenerate-override'>
) {
  const session = await requireStaffApiUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  const body = await request.json()

  let pageId = body.pageId as string | null
  if (!pageId) {
    const adminSupabase = await createAdminClient()
    const { data: ticket } = await adminSupabase
      .from('support_tickets')
      .select('book_id')
      .eq('id', id)
      .single()

    if (ticket?.book_id) {
      const { data: firstPage } = await adminSupabase
        .from('book_pages')
        .select('id')
        .eq('book_id', ticket.book_id)
        .order('page_number', { ascending: true })
        .limit(1)
        .maybeSingle()

      pageId = firstPage?.id || null
    }
  }

  if (!pageId) {
    return NextResponse.json({ error: 'No page available for override' }, { status: 400 })
  }

  const imageUrl = await resolveTicketWithRegenerateOverride({
    ticketId: id,
    pageId,
    prompt: body.prompt,
    staffUserId: session.staffUser.id,
  })

  return NextResponse.json({ imageUrl })
}
