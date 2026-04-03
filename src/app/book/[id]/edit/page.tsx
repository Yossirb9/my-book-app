import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BookEditor from '@/components/book/BookEditor'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('*, book_pages(*)')
    .eq('id', id)
    .single()

  if (!book || book.status !== 'ready') notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPages = (book as any).book_pages as Array<{
    id: string; page_number: number; text: string | null;
    image_url: string | null; image_prompt: string | null
  }>

  const pages = rawPages
    .sort((a, b) => a.page_number - b.page_number)
    .map((p) => ({
      id: p.id,
      page_number: p.page_number,
      text: p.text ?? '',
      image_url: p.image_url ?? undefined,
      image_prompt: p.image_prompt ?? undefined,
    }))

  return <BookEditor book={{
    id: book.id,
    title: book.title,
    image_regenerations_left: book.image_regenerations_left,
    text_regenerations_left: book.text_regenerations_left,
  }} pages={pages} />
}
