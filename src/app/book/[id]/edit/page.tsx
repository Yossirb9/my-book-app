import { notFound } from 'next/navigation'
import BookEditor from '@/components/book/BookEditor'
import { getBookById } from '@/lib/books'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await getBookById(id)

  if (!book) {
    return buildMetadata({ title: 'עריכת ספר' })
  }

  return buildMetadata({
    title: `עריכת ${book.title}`,
    description: `עריכת טקסטים ואיורים עבור הספר "${book.title}".`,
  })
}

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await getBookById(id)

  if (!book || book.status !== 'ready') notFound()

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

  return (
    <BookEditor
      book={{
        id: book.id,
        title: book.title,
        image_regenerations_left: book.image_regenerations_left,
        text_regenerations_left: book.text_regenerations_left,
      }}
      pages={pages}
    />
  )
}
