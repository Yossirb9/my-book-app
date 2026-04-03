import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params
  const supabase = await createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('status, params')
    .eq('id', bookId)
    .single()

  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { count: pagesGenerated } = await supabase
    .from('book_pages')
    .select('*', { count: 'exact', head: true })
    .eq('book_id', bookId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = book.params as any
  const totalPages = p?.length === 'short' ? 10 : p?.length === 'medium' ? 18 : 28

  return NextResponse.json({
    status: book.status,
    pagesGenerated: pagesGenerated || 0,
    totalPages,
  })
}
