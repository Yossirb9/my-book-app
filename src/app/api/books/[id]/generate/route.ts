import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateStory } from '@/lib/gemini/generateStory'
import { generatePageImage } from '@/lib/gemini/generateImage'
import { BookParams } from '@/types'

export const maxDuration = 300 // 5 min

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params
  const supabase = await createAdminClient()

  try {
    // Fetch book
    const { data: book } = await supabase
      .from('books')
      .select('*, characters(*)')
      .eq('id', bookId)
      .single()

    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    if (!book.paid) return NextResponse.json({ error: 'Not paid' }, { status: 403 })

    // Mark as generating
    await supabase.from('books').update({ status: 'generating' }).eq('id', bookId)

    const bookParams: BookParams = book.params as unknown as BookParams

    // 1. Generate story with Gemini
    const pages = await generateStory(bookParams)

    // 2. Fetch character images from Supabase storage
    const characterImageBase64s = await Promise.all(
      book.characters.map(async (char: { name: string; image_url?: string | null }) => {
        if (!char.image_url) return null
        try {
          const res = await fetch(char.image_url)
          const buffer = await res.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          const mimeType = res.headers.get('content-type') || 'image/jpeg'
          return { name: char.name, base64, mimeType }
        } catch {
          return null
        }
      })
    ).then((r) => r.filter(Boolean) as { name: string; base64: string; mimeType: string }[])

    // 3. Generate images + save pages
    for (const page of pages) {
      // Generate image with Gemini — always send ALL character refs for consistency
      let imageUrl: string | undefined
      try {
        const imageBuffer = await generatePageImage(
          page.sceneDescription,
          bookParams.characters,
          bookParams,
          characterImageBase64s
          // no scene filter — always send all refs so Gemini never forgets a face
        )

        // Upload to Supabase Storage
        const filePath = `books/${bookId}/page-${page.pageNumber}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(filePath, imageBuffer, { contentType: 'image/jpeg', upsert: true })

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('book-images').getPublicUrl(filePath)
          imageUrl = urlData.publicUrl
        }
      } catch (imgErr) {
        console.error(`Image generation failed for page ${page.pageNumber}:`, imgErr)
      }

      // Insert page
      await supabase.from('book_pages').insert({
        book_id: bookId,
        page_number: page.pageNumber,
        text: page.text,
        image_url: imageUrl,
        image_prompt: page.sceneDescription,
      })
    }

    // 4. Generate PDFs
    const pdfDigitalUrl = await generateBookPDF(bookId, pages, 'digital', supabase)
    const pdfPrintUrl = await generateBookPDF(bookId, pages, 'print', supabase)

    // 5. Mark ready
    await supabase.from('books').update({
      status: 'ready',
      pdf_digital_url: pdfDigitalUrl,
      pdf_print_url: pdfPrintUrl,
    }).eq('id', bookId)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Generation error:', e)
    await supabase.from('books').update({ status: 'failed' }).eq('id', bookId)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

async function generateBookPDF(
  bookId: string,
  pages: { pageNumber: number; text: string }[],
  type: 'digital' | 'print',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _supabase: unknown
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/books/${bookId}/pdf?type=${type}`,
      { method: 'POST' }
    )
    if (!res.ok) return undefined
    const data = await res.json()
    return data.url
  } catch {
    return undefined
  }
}
