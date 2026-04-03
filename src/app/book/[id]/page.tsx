import { createAdminClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import BookViewer from '@/components/book/BookViewer'

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('*, book_pages(*)')
    .eq('id', id)
    .single()

  if (!book) notFound()

  if (book.status === 'generating') redirect(`/book/${id}/creating`)
  if (book.status === 'draft') redirect('/create')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPages = (book as any).book_pages as Array<{
    id: string; page_number: number; text: string | null; image_url: string | null
  }>

  const pages = rawPages
    .sort((a, b) => a.page_number - b.page_number)
    .map((p) => ({
      id: p.id,
      page_number: p.page_number,
      text: p.text ?? '',
      image_url: p.image_url ?? undefined,
    }))

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
    />
  )
}
