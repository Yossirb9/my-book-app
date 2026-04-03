'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Page {
  id: string
  page_number: number
  text: string
  image_url?: string
}

interface Book {
  id: string
  title: string
  pdf_digital_url?: string
  pdf_print_url?: string
  image_regenerations_left: number
  text_regenerations_left: number
}

export default function BookViewer({ book, pages }: { book: Book; pages: Page[] }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const current = pages[currentPage]
  const totalPages = pages.length

  const goNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1))

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev()
    }
    setTouchStart(null)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gray-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm">
        <Link href="/books" className="text-white/70 text-sm">← הספרים שלי</Link>
        <h1 className="text-white font-semibold text-sm truncate max-w-[160px]">{book.title}</h1>
        <a
          href={book.pdf_digital_url || '#'}
          download
          className={cn('text-sm', book.pdf_digital_url ? 'text-coral-400' : 'text-white/30 pointer-events-none')}
        >
          ⬇️ הורד
        </a>
      </div>

      {/* Page Display */}
      <div
        className="flex-1 flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <div className="flex-1 relative">
          {current?.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.image_url}
              alt={`עמוד ${current.page_number}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-coral-100 to-peach-300 flex items-center justify-center">
              <span className="text-6xl opacity-40">🎨</span>
            </div>
          )}
        </div>

        {/* Text Overlay */}
        <div className="bg-white px-5 py-4 min-h-[100px] flex items-center">
          <p className="text-gray-800 text-lg leading-relaxed font-medium text-right w-full">
            {current?.text}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-900 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="text-white/60 disabled:opacity-20 text-2xl px-2"
          >
            ›
          </button>

          {/* Page dots */}
          <div className="flex gap-1.5 items-center">
            {pages.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 4)).map((_, i) => {
              const pageIdx = Math.max(0, currentPage - 3) + i
              return (
                <button
                  key={pageIdx}
                  onClick={() => setCurrentPage(pageIdx)}
                  className={cn(
                    'rounded-full transition-all',
                    pageIdx === currentPage ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30'
                  )}
                />
              )
            })}
          </div>

          <button
            onClick={goNext}
            disabled={currentPage === totalPages - 1}
            className="text-white/60 disabled:opacity-20 text-2xl px-2"
          >
            ‹
          </button>
        </div>

        <p className="text-center text-white/40 text-xs mb-3">
          עמוד {currentPage + 1} מתוך {totalPages}
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-around bg-black/30 rounded-2xl py-3 px-2">
          <a
            href={book.pdf_digital_url || '#'}
            download
            className="flex flex-col items-center gap-1 text-white/70"
          >
            <span className="text-xl">⬇️</span>
            <span className="text-xs">הורד</span>
          </a>
          <a
            href={book.pdf_print_url || '#'}
            download
            className="flex flex-col items-center gap-1 text-white/70"
          >
            <span className="text-xl">🖨️</span>
            <span className="text-xs">הדפסה</span>
          </a>
          <Link
            href={`/book/${book.id}/edit`}
            className="flex flex-col items-center gap-1 text-white/70"
          >
            <span className="text-xl">✏️</span>
            <span className="text-xs">ערוך</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
