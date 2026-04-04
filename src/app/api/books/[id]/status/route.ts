import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params
  const supabase = await createAdminClient()
  const sessionClient = await createClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { data: book } = await supabase
    .from('books')
    .select('status, params')
    .eq('id', bookId)
    .eq('user_id', user.id)
    .single()

  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { count: pagesGenerated } = await supabase
    .from('book_pages')
    .select('*', { count: 'exact', head: true })
    .eq('book_id', bookId)

  const paramsData = book.params as { length?: 'short' | 'medium' | 'long' } | null
  const totalPages =
    paramsData?.length === 'short' ? 10 : paramsData?.length === 'medium' ? 18 : 28

  return NextResponse.json({
    status: book.status,
    pagesGenerated: pagesGenerated || 0,
    totalPages,
  })
}
