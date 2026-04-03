import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { generatePageImage } from '@/lib/gemini/generateImage'

export const maxDuration = 120

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  const { id: bookId, pageId } = await params
  const supabase = await createClient()
  const adminSupabase = await createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: book } = await supabase
    .from('books')
    .select('user_id, image_regenerations_left, params')
    .eq('id', bookId)
    .single()

  if (!book || book.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (book.image_regenerations_left <= 0) {
    return NextResponse.json({ error: 'No regenerations left' }, { status: 403 })
  }

  const { data: page } = await supabase
    .from('book_pages')
    .select('image_prompt, image_url')
    .eq('id', pageId)
    .single()

  const body = await req.json()
  const prompt = body.prompt || page?.image_prompt || ''

  // Fetch character images
  const { data: characters } = await supabase.from('characters').select('*').eq('book_id', bookId)

  const characterImageBase64s = await Promise.all(
    (characters || []).map(async (char: { name: string; image_url?: string | null }) => {
      if (!char.image_url) return null
      try {
        const res = await fetch(char.image_url)
        const buffer = await res.arrayBuffer()
        return {
          name: char.name,
          base64: Buffer.from(buffer).toString('base64'),
          mimeType: res.headers.get('content-type') || 'image/jpeg',
        }
      } catch { return null }
    })
  ).then((r) => r.filter(Boolean) as { name: string; base64: string; mimeType: string }[])

  // Generate new image
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookParams = book.params as any
  const imageBuffer = await generatePageImage(
    prompt,
    bookParams.characters,
    bookParams,
    characterImageBase64s
  )

  // Upload
  const filePath = `books/${bookId}/page-${pageId}-regen-${Date.now()}.jpg`
  await adminSupabase.storage.from('book-images').upload(filePath, imageBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  const { data: urlData } = adminSupabase.storage.from('book-images').getPublicUrl(filePath)

  // Update DB
  await supabase.from('book_pages').update({
    image_url: urlData.publicUrl,
    image_prompt: prompt,
  }).eq('id', pageId)

  await supabase.from('books').update({
    image_regenerations_left: book.image_regenerations_left - 1,
  }).eq('id', bookId)

  await supabase.from('regeneration_log').insert({
    book_id: bookId,
    page_id: pageId,
    type: 'image',
    old_value: page?.image_url,
    new_value: urlData.publicUrl,
  })

  return NextResponse.json({ imageUrl: urlData.publicUrl })
}
