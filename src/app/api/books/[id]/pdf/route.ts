import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { buildBookHTML } from '@/lib/pdf/generatePDF'
import { BookPage } from '@/types'
import { Tables } from '@/lib/supabase/database.types'

type DbPage = Tables<'book_pages'>

export const maxDuration = 120

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as 'digital' | 'print' || 'digital'

  const supabase = await createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('*, book_pages(*)')
    .eq('id', bookId)
    .single()

  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Map DB snake_case to our BookPage type
  const pages: BookPage[] = (book.book_pages as DbPage[])
    .sort((a, b) => a.page_number - b.page_number)
    .map((p) => ({
      id: p.id,
      bookId: p.book_id,
      pageNumber: p.page_number,
      text: p.text || '',
      imageUrl: p.image_url || undefined,
      imagePrompt: p.image_prompt || undefined,
      regenerationsLeft: 3,
    }))

  const html = buildBookHTML(
    pages,
    book.title,
    type,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (book.params as any)?.format || 'square'
  )

  // Use puppeteer to generate PDF
  try {
    const puppeteer = await import('puppeteer-core')
    // Try to find Chrome
    const executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      (process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : '/usr/bin/google-chrome-stable')

    const browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isSquare = (book.params as any)?.format === 'square'
    const pdfBuffer = await page.pdf({
      width: isSquare ? '200mm' : '210mm',
      height: isSquare ? '200mm' : '297mm',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    await browser.close()

    // Upload to Supabase Storage
    const filePath = `books/${bookId}/${type}.pdf`
    await supabase.storage.from('book-pdfs').upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

    const { data: urlData } = supabase.storage.from('book-pdfs').getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (e) {
    console.error('PDF generation error:', e)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
