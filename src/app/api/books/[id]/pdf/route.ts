import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Tables } from '@/lib/supabase/database.types'
import React from 'react'

type DbPage = Tables<'book_pages'> & { metadata?: Record<string, unknown> | null }

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
  const bookParams = book.params as any
  const isJournal = bookParams?.template === 'emotional_journal'
  const format = bookParams?.format || 'portrait'
  const pageSize = format === 'square' ? ([566, 566] as [number, number]) : 'A4'

  try {
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

    Font.register({
      family: 'Heebo',
      fonts: [
        { src: 'https://fonts.gstatic.com/s/heebo/v28/NGSpv5_NC0k9P_v6ZUCbLRAHxK1EiSyccg.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/heebo/v28/NGSpv5_NC0k9P_v6ZUCbLRAHxK1Ebiuccg.ttf', fontWeight: 700 },
      ],
    })

    const styles = StyleSheet.create({
      // Story styles
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
      // Journal styles
      journalChapterDivider: {
        backgroundColor: '#1a1a2e',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 0,
      },
      journalChapterOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(26,26,46,0.75)',
        padding: 40,
        flexDirection: 'column',
        gap: 8,
      },
      journalChapterNumber: {
        fontFamily: 'Heebo',
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'right',
        letterSpacing: 2,
      },
      journalChapterTitle: {
        fontFamily: 'Heebo',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'right',
      },
      journalAffirmationPage: {
        backgroundColor: '#FFF9F0',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 56,
      },
      journalAffirmationTitle: {
        fontFamily: 'Heebo',
        fontSize: 13,
        color: '#b8956a',
        textAlign: 'right',
        marginBottom: 16,
        letterSpacing: 1,
      },
      journalAffirmationText: {
        fontFamily: 'Heebo',
        fontSize: 22,
        lineHeight: 1.9,
        color: '#1a1a1a',
        textAlign: 'right',
        direction: 'rtl',
      },
      journalQuestionPage: {
        backgroundColor: '#f8f4ff',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 48,
      },
      journalQuestionTitle: {
        fontFamily: 'Heebo',
        fontSize: 13,
        color: '#7c6aaa',
        textAlign: 'right',
        marginBottom: 16,
      },
      journalQuestionText: {
        fontFamily: 'Heebo',
        fontSize: 18,
        lineHeight: 2,
        color: '#1a1a1a',
        textAlign: 'right',
        direction: 'rtl',
        marginBottom: 32,
      },
      journalWritingLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#c4b8e8',
        marginBottom: 20,
        width: '100%',
      },
      journalMemoryPage: {
        backgroundColor: '#fff8f0',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 48,
      },
      journalMemoryTitle: {
        fontFamily: 'Heebo',
        fontSize: 13,
        color: '#b8956a',
        textAlign: 'right',
        marginBottom: 16,
      },
      journalMemoryText: {
        fontFamily: 'Heebo',
        fontSize: 17,
        lineHeight: 2,
        color: '#1a1a1a',
        textAlign: 'right',
        direction: 'rtl',
        marginBottom: 32,
      },
      journalMemoryBox: {
        borderWidth: 1,
        borderColor: '#e0c9aa',
        borderStyle: 'dashed',
        borderRadius: 16,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      journalMemoryBoxText: {
        fontFamily: 'Heebo',
        fontSize: 12,
        color: '#c4a57a',
        textAlign: 'center',
      },
      journalPhotoPage: {
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
      },
      journalPhotoFrame: {
        borderWidth: 2,
        borderColor: '#e0c9aa',
        borderRadius: 16,
        width: '80%',
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      },
      journalPhotoFrameText: {
        fontFamily: 'Heebo',
        fontSize: 13,
        color: '#c4a57a',
        textAlign: 'center',
      },
      journalPhotoCaption: {
        fontFamily: 'Heebo',
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
      },
      journalDreamPage: {
        backgroundColor: '#f0f9ff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 56,
      },
      journalDreamTitle: {
        fontFamily: 'Heebo',
        fontSize: 13,
        color: '#5b9abf',
        textAlign: 'right',
        marginBottom: 16,
      },
      journalDreamText: {
        fontFamily: 'Heebo',
        fontSize: 20,
        lineHeight: 2,
        color: '#1a1a1a',
        textAlign: 'right',
        direction: 'rtl',
      },
      journalClosingPage: {
        backgroundColor: '#1a1a2e',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 56,
      },
      journalClosingTitle: {
        fontFamily: 'Heebo',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
      },
      journalClosingText: {
        fontFamily: 'Heebo',
        fontSize: 15,
        lineHeight: 2.1,
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        direction: 'rtl',
      },
    })

    const docChildren: React.ReactElement[] = []

    if (isJournal) {
      for (const page of sortedPages) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const meta = (page.metadata as any) || {}
        const pageType: string = meta.pageType || 'affirmation'
        const title: string = meta.title || ''
        const chapterNumber: number = meta.chapterNumber || 0
        const chapterTitle: string = meta.chapterTitle || ''

        if (pageType === 'cover') {
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `j-${page.id}`, size: pageSize, style: { backgroundColor: '#1a1a2e', padding: 0 } },
              page.image_url
                ? React.createElement(PDFImage, { src: page.image_url, style: styles.fullImage })
                : React.createElement(
                    View,
                    { style: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 56 } },
                    React.createElement(Text, { style: { fontFamily: 'Heebo', fontSize: 32, color: '#fff', textAlign: 'center' } }, title),
                    React.createElement(Text, { style: { fontFamily: 'Heebo', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 16, textAlign: 'center' } }, page.text || '')
                  )
            )
          )
        } else if (pageType === 'chapter_divider') {
          const overlay = React.createElement(
            View,
            { style: styles.journalChapterOverlay },
            React.createElement(Text, { style: styles.journalChapterNumber }, `פרק ${chapterNumber}`),
            React.createElement(Text, { style: styles.journalChapterTitle }, chapterTitle)
          )
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `j-${page.id}`, size: pageSize, style: styles.journalChapterDivider },
              page.image_url
                ? React.createElement(PDFImage, { src: page.image_url, style: styles.fullImage })
                : React.createElement(View, { style: { flex: 1, backgroundColor: '#1a1a2e' } }),
              overlay
            )
          )
        } else if (pageType === 'affirmation' || pageType === 'growth') {
          const pageEl = React.createElement(
            PDFPage,
            { key: `j-${page.id}`, size: pageSize, style: styles.journalAffirmationPage },
            React.createElement(Text, { style: styles.journalAffirmationTitle }, title),
            React.createElement(Text, { style: styles.journalAffirmationText }, page.text || '')
          )
          docChildren.push(pageEl)
        } else if (pageType === 'question') {
          const lines = Array.from({ length: 7 }, (_, i) =>
            React.createElement(View, { key: i, style: styles.journalWritingLine })
          )
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `j-${page.id}`, size: pageSize, style: styles.journalQuestionPage },
              React.createElement(Text, { style: styles.journalQuestionTitle }, title),
              React.createElement(Text, { style: styles.journalQuestionText }, page.text || ''),
              ...lines
            )
          )
        } else if (pageType === 'memory') {
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `j-${page.id}`, size: pageSize, style: styles.journalMemoryPage },
              React.createElement(Text, { style: styles.journalMemoryTitle }, title),
              React.createElement(Text, { style: styles.journalMemoryText }, page.text || ''),
              React.createElement(
                View,
                { style: styles.journalMemoryBox },
                React.createElement(Text, { style: styles.journalMemoryBoxText }, 'הדביקו תמונה כאן')
              )
            )
          )
        } else if (pageType === 'photo_placeholder') {
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `j-${page.id}`, size: pageSize, style: styles.journalPhotoPage },
              React.createElement(
                View,
                { style: styles.journalPhotoFrame },
                React.createElement(Text, { style: styles.journalPhotoFrameText }, '📷'),
                React.createElement(Text, { style: { ...styles.journalPhotoFrameText, marginTop: 8 } }, 'הדביקו תמונה כאן')
              ),
              React.createElement(Text, { style: styles.journalPhotoCaption }, page.text || title)
            )
          )
        } else if (pageType === 'dream') {
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `j-${page.id}`, size: pageSize, style: styles.journalDreamPage },
              React.createElement(Text, { style: styles.journalDreamTitle }, title),
              React.createElement(Text, { style: styles.journalDreamText }, page.text || '')
            )
          )
        } else if (pageType === 'closing') {
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `j-${page.id}`, size: pageSize, style: styles.journalClosingPage },
              page.image_url
                ? React.createElement(PDFImage, { src: page.image_url, style: { ...styles.fullImage, position: 'absolute', opacity: 0.3 } })
                : null,
              React.createElement(Text, { style: styles.journalClosingTitle }, title),
              React.createElement(Text, { style: styles.journalClosingText }, page.text || '')
            )
          )
        }
      }
    } else {
      // Story book layout
      const coverPage = sortedPages[0]

      // Ornament helper (— • —)
      const ornamentRow = () =>
        React.createElement(
          View,
          { style: { flexDirection: 'row', alignItems: 'center' } },
          React.createElement(View, { style: { width: 40, height: 1.5, backgroundColor: '#c9a87c' } }),
          React.createElement(View, { style: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#c9a87c', marginLeft: 5, marginRight: 5 } }),
          React.createElement(View, { style: { width: 40, height: 1.5, backgroundColor: '#c9a87c' } })
        )

      // ── Cover page: full image + overlay + double frame + title ──
      docChildren.push(
        React.createElement(
          PDFPage,
          { key: 'cover', size: pageSize, style: { backgroundColor: '#1a1a2e', padding: 0 } },
          // Background image
          coverPage?.image_url
            ? React.createElement(PDFImage, {
                src: coverPage.image_url,
                style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, objectFit: 'cover' },
              })
            : null,
          // Dark overlay
          React.createElement(View, {
            style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', opacity: 0.45 },
          }),
          // Outer frame (opacity on the view = white at 25%)
          React.createElement(View, {
            style: { position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, borderWidth: 1, borderColor: 'white', borderRadius: 8, opacity: 0.25 },
          }),
          // Inner frame (opacity on the view = white at 10%)
          React.createElement(View, {
            style: { position: 'absolute', top: 22, left: 22, right: 22, bottom: 22, borderWidth: 1, borderColor: 'white', borderRadius: 6, opacity: 0.10 },
          }),
          // Title section at bottom
          React.createElement(
            View,
            { style: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 52, paddingHorizontal: 40, alignItems: 'center' } },
            React.createElement(View, { style: { width: 48, height: 1, backgroundColor: 'white', marginBottom: 10, opacity: 0.5 } }),
            React.createElement(
              Text,
              { style: { fontFamily: 'Heebo', fontWeight: 700, fontSize: 30, color: '#ffffff', textAlign: 'center' } },
              book.title
            ),
            React.createElement(View, { style: { width: 48, height: 1, backgroundColor: 'white', marginTop: 10, marginBottom: 6, opacity: 0.5 } }),
            React.createElement(
              Text,
              { style: { fontFamily: 'Heebo', fontSize: 14, color: 'white', textAlign: 'center', opacity: 0.4 } },
              'ספר אישי'
            )
          )
        )
      )

      // ── Content pages: ALL pages, text first then image ──────────
      // sortedPages[0] image appears again here (without title) as the image
      // paired with the first text page — exactly like the book viewer spread.
      for (const page of sortedPages) {
        // Text page (FIRST)
        if (page.text) {
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `txt-${page.id}`, size: pageSize, style: { backgroundColor: '#fffbf5', padding: 0 } },
              // Top ornament — fixed position
              React.createElement(
                View,
                { style: { position: 'absolute', top: 36, left: 0, right: 0, alignItems: 'center' } },
                ornamentRow()
              ),
              // Text — centered
              React.createElement(
                View,
                { style: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 56, paddingVertical: 88 } },
                React.createElement(Text, { style: styles.storyText }, page.text)
              ),
              // Bottom ornament + page number — fixed position
              React.createElement(
                View,
                { style: { position: 'absolute', bottom: 28, left: 0, right: 0, alignItems: 'center' } },
                ornamentRow(),
                React.createElement(
                  Text,
                  { style: { fontFamily: 'Heebo', fontSize: 9, color: '#b8956a', marginTop: 6, textAlign: 'center' } },
                  String(page.page_number)
                )
              )
            )
          )
        }

        // Image page (AFTER text, no title overlay)
        if (page.image_url) {
          docChildren.push(
            React.createElement(
              PDFPage,
              { key: `img-${page.id}`, size: pageSize, style: styles.imagePage },
              React.createElement(PDFImage, { src: page.image_url, style: styles.fullImage })
            )
          )
        }
      }
    }

    const docElement = React.createElement(
      Document,
      { title: book.title, language: 'he' },
      ...docChildren
    )

    const pdfBuffer = await renderToBuffer(docElement)

    const filePath = `books/${bookId}/${type}.pdf`
    await supabase.storage.from('book-pdfs').upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

    const { data: urlData } = supabase.storage.from('book-pdfs').getPublicUrl(filePath)

    return NextResponse.json({ url: `${urlData.publicUrl}?v=${Date.now()}` })
  } catch (e) {
    console.error('PDF generation error:', e)
    return NextResponse.json({ error: 'PDF generation failed', details: String(e) }, { status: 500 })
  }
}
