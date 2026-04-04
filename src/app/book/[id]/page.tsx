import { notFound, redirect } from 'next/navigation'
import BookViewer from '@/components/book/BookViewer'
import { getBookById } from '@/lib/books'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await getBookById(id)

  if (!book) {
    return buildMetadata({ title: 'ספר לא נמצא' })
  }

  return buildMetadata({
    title: book.title,
    description: `קריאה בספר "${book.title}", כולל הורדת PDF וכניסה לעריכה בסיסית.`,
  })
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await getBookById(id)

  if (!book) notFound()

  if (book.status === 'generating' || book.status === 'failed') redirect(`/book/${id}/creating`)
  if (book.status === 'draft') redirect('/create')

  const rawPages = (book.book_pages as Array<{
    id: string
    page_number: number
    text: string | null
    image_url: string | null
    image_prompt: string | null
  }>) || []

  const pages = rawPages
    .sort((left, right) => left.page_number - right.page_number)
    .map((page) => ({
      id: page.id,
      page_number: page.page_number,
      text: page.text ?? '',
      image_url: page.image_url ?? undefined,
      image_prompt: page.image_prompt ?? undefined,
    }))

  const format = (book.params as { format?: string } | null)?.format === 'square' ? 'square' : 'portrait'

  return (
    <BookViewer
      book={{
        id: book.id,
        title: book.title,
        pdf_digital_url: book.pdf_digital_url ?? undefined,
        pdf_print_url: book.pdf_print_url ?? undefined,
        image_regenerations_left: book.image_regenerations_left,
        text_regenerations_left: book.text_regenerations_left,
      }}
      pages={pages}
      format={format}
    />
  )
}
