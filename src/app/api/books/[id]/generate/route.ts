import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { generatePageImage } from '@/lib/gemini/generateImage'
import { generateStory } from '@/lib/gemini/generateStory'
import { BookParams } from '@/types'

export const maxDuration = 300

export async function POST(
  req: NextRequest,
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

  let retry = false
  try {
    const body = await req.json()
    retry = Boolean(body?.retry)
  } catch {
    retry = false
  }

  try {
    const { data: book } = await supabase
      .from('books')
      .select('*, characters(*)')
      .eq('id', bookId)
      .eq('user_id', user.id)
      .single()

    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    if (!book.paid) return NextResponse.json({ error: 'Not paid' }, { status: 403 })

    if (book.status === 'ready') {
      return NextResponse.json({ success: true, status: 'ready' })
    }

    if (book.status === 'generating') {
      return NextResponse.json({ success: true, status: 'generating' })
    }

    if (book.status === 'failed' && !retry) {
      return NextResponse.json({ error: 'Retry required' }, { status: 409 })
    }

    if (retry) {
      await supabase.from('book_pages').delete().eq('book_id', bookId)
      await supabase
        .from('books')
        .update({
          pdf_digital_url: null,
          pdf_print_url: null,
        })
        .eq('id', bookId)
    }

    await supabase.from('books').update({ status: 'generating' }).eq('id', bookId)

    const bookParams = book.params as unknown as BookParams
    const pages = await generateStory(bookParams)

    const characterImageBase64s = await Promise.all(
      book.characters.map(async (character: { name: string; image_url?: string | null }) => {
        if (!character.image_url) return null

        try {
          const response = await fetch(character.image_url)
          const buffer = await response.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          const mimeType = response.headers.get('content-type') || 'image/jpeg'
          return { name: character.name, base64, mimeType }
        } catch {
          return null
        }
      })
    ).then((results) => results.filter(Boolean) as { name: string; base64: string; mimeType: string }[])

    await Promise.all(
      pages.map(async (page) => {
        let imageUrl: string | undefined

        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const imageBuffer = await generatePageImage(
              page.sceneDescription,
              bookParams.characters,
              bookParams,
              characterImageBase64s,
              page.charactersInScene
            )

            const filePath = `books/${bookId}/page-${page.pageNumber}.jpg`
            const { error: uploadError } = await supabase.storage
              .from('book-images')
              .upload(filePath, imageBuffer, { contentType: 'image/jpeg', upsert: true })

            if (!uploadError) {
              const { data: urlData } = supabase.storage.from('book-images').getPublicUrl(filePath)
              imageUrl = urlData.publicUrl
            }

            break
          } catch (imageError) {
            console.error(`Image generation attempt ${attempt} failed for page ${page.pageNumber}:`, imageError)
          }
        }

        await supabase.from('book_pages').insert({
          book_id: bookId,
          page_number: page.pageNumber,
          text: page.text,
          image_url: imageUrl,
          image_prompt: page.sceneDescription,
        })
      })
    )

    const pdfDigitalUrl = await generateBookPDF(bookId, pages, 'digital')
    const pdfPrintUrl = await generateBookPDF(bookId, pages, 'print')

    await supabase
      .from('books')
      .update({
        status: 'ready',
        pdf_digital_url: pdfDigitalUrl,
        pdf_print_url: pdfPrintUrl,
      })
      .eq('id', bookId)

    return NextResponse.json({ success: true, status: 'ready' })
  } catch (error) {
    console.error('Generation error:', error)
    await supabase.from('books').update({ status: 'failed' }).eq('id', bookId)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

async function generateBookPDF(
  bookId: string,
  pages: { pageNumber: number; text: string }[],
  type: 'digital' | 'print'
) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/books/${bookId}/pdf?type=${type}`, {
      method: 'POST',
    })

    if (!response.ok) return undefined
    const data = await response.json()
    return data.url as string | undefined
  } catch {
    return undefined
  }
}
