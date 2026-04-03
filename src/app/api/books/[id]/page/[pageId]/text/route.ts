import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  const { id: bookId, pageId } = await params
  const supabase = await createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('text_regenerations_left')
    .eq('id', bookId)
    .single()

  if (!book) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (book.text_regenerations_left <= 0) {
    return NextResponse.json({ error: 'No regenerations left' }, { status: 403 })
  }

  const { text } = await req.json()

  // Get old text for log
  const { data: page } = await supabase.from('book_pages').select('text').eq('id', pageId).single()

  await supabase.from('book_pages').update({ text }).eq('id', pageId).eq('book_id', bookId)
  await supabase.from('books').update({ text_regenerations_left: book.text_regenerations_left - 1 }).eq('id', bookId)
  await supabase.from('regeneration_log').insert({
    book_id: bookId,
    page_id: pageId,
    type: 'text',
    old_value: page?.text,
    new_value: text,
  })

  return NextResponse.json({ success: true })
}
