import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Tables } from '@/lib/supabase/database.types'
import React from 'react'

type DbPage = Tables<'book_pages'>

export const maxDuration = 120

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params
  const { searchParams } = new URL(req.url)
  const type = (searchParams.get('type') as 'digital' | 'print') || 'digital'

  const supabase = await createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('*, book_pages(*)')
    .eq('id', bookId)
    .single()

  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const sortedPages = ((book.book_pages as DbPage[]) || [])
    .sort((a, b) => a.page_number - b.page_number)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const format = (book.params as any)?.format || 'portrait'
  const pageSize = format === 'square' ? ([566, 566] as [number, number]) : 'A4'

  try {
    // Use @react-pdf/renderer — works on Vercel serverless (no Chrome needed)
    const {
      renderToBuffer,
      Document,
      Page: PDFPage,
      Image: PDFImage,
      View,
      Text,
      StyleSheet,
      Font,
    } = await import('@react-pdf/renderer')

    // Register Hebrew font for text rendering
    Font.register({
      family: 'Heebo',
      src: 'https://fonts.gstatic.com/s/heebo/v26/NGSpv5_NC0k9P_v6ZUCbLRAHxK1EiS2cd5OQf.woff2',
    })

    const styles = StyleSheet.create({
      coverPage: {
        backgroundColor: '#1a1a2e',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 0,
      },
      imagePage: {
        backgroundColor: '#111',
        padding: 0,
        flexDirection: 'column',
      },
      fullImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
      textPage: {
        backgroundColor: '#fffbf5',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
      },
      storyText: {
        fontFamily: 'Heebo',
        fontSize: 16,
        lineHeight: 2.2,
        color: '#1a1a1a',
        textAlign: 'right',
        direction: 'rtl',
      },
      pageNumber: {
        fontFamily: 'Heebo',
        fontSize: 10,
        color: '#b8956a',
        marginTop: 24,
        textAlign: 'center',
      },
      ornamentLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#c9a87c',
        width: 60,
        marginBottom: 24,
      },
    })

    // Build the PDF document using React.createElement (no JSX in .ts file)
    const docChildren: React.ReactElement[] = []

    // Cover page
    const coverPage = sortedPages[0]
    if (coverPage?.image_url) {
      docChildren.push(
        React.createElement(
          PDFPage,
          { key: 'cover', size: pageSize, style: styles.coverPage },
          React.createElement(PDFImage, { src: coverPage.image_url, style: styles.fullImage })
        )
      )
    }

    // Story pages: image page + text page for each
    for (const page of sortedPages) {
      // Image page
      if (page.image_url) {
        docChildren.push(
          React.createElement(
            PDFPage,
            { key: `img-${page.id}`, size: pageSize, style: styles.imagePage },
            React.createElement(PDFImage, { src: page.image_url, style: styles.fullImage })
          )
        )
      }

      // Text page
      if (page.text) {
        docChildren.push(
          React.createElement(
            PDFPage,
            { key: `txt-${page.id}`, size: pageSize, style: styles.textPage },
            React.createElement(View, { style: styles.ornamentLine }),
            React.createElement(Text, { style: styles.storyText }, page.text),
            React.createElement(Text, { style: styles.pageNumber }, String(page.page_number))
          )
        )
      }
    }

    const docElement = React.createElement(
      Document,
      { title: book.title, language: 'he' },
      ...docChildren
    )

    const pdfBuffer = await renderToBuffer(docElement)

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
    return NextResponse.json({ error: 'PDF generation failed', details: String(e) }, { status: 500 })
  }
}
