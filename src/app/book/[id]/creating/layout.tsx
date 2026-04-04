import { ReactNode } from 'react'
import { getBookById } from '@/lib/books'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await getBookById(id)

  if (!book) {
    return buildMetadata({ title: 'יצירת ספר' })
  }

  return buildMetadata({
    title: `יוצרים את ${book.title}`,
    description: `מסך מעקב אחרי יצירת הספר "${book.title}", כולל התקדמות וניסיון נוסף במקרה הצורך.`,
  })
}

export default function CreatingLayout({ children }: { children: ReactNode }) {
  return children
}
