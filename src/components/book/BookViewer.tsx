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

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
    setTouchStart(null)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gray-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-black/40 backdrop-blur-sm">
        <Link href="/books" className="text-white/70 text-sm">← הספרים שלי</Link>
        <h1 className="text-white font-semibold text-sm md:text-base truncate max-w-[200px]">{book.title}</h1>
        <div className="flex items-center gap-3">
          <Link href={`/book/${book.id}/edit`} className="hidden md:flex items-center gap-1.5 text-coral-400 text-sm font-medium hover:text-coral-300 transition-colors">
            ✏️ ערוך
          </Link>
          <a
            href={book.pdf_digital_url || '#'}
            download
            className={cn('text-sm', book.pdf_digital_url ? 'text-coral-400 hover:text-coral-300' : 'text-white/30 pointer-events-none')}
          >
            ⬇️ הורד
          </a>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT: sidebar + main ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Sidebar — page thumbnails */}
        <aside className="hidden md:flex flex-col w-52 bg-black/30 border-l border-white/10 overflow-y-auto py-4 gap-2 px-3">
          <p className="text-white/40 text-xs text-center mb-2">כל העמודים</p>
          {pages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(idx)}
              className={cn(
                'rounded-xl overflow-hidden border-2 transition-all shrink-0',
                idx === currentPage ? 'border-coral-500 shadow-lg shadow-coral-900' : 'border-transparent opacity-60 hover:opacity-90'
              )}
            >
              {page.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.image_url} alt={`עמוד ${page.page_number}`} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-coral-100 to-peach-300 flex items-center justify-center text-xs text-gray-500">
                  {page.page_number}
                </div>
              )}
              <div className="bg-gray-900 py-1">
                <p className="text-white/50 text-xs text-center">{page.page_number}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* Main Book Area */}
        <div
          className="flex-1 flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Book Page — image + text like a real book page */}
          <div className="flex-1 overflow-y-auto bg-white flex flex-col">
            {/* Full image — no cropping, always shows complete illustration */}
            <div className="w-full bg-gray-900">
              {current?.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.image_url}
                  alt={`עמוד ${current.page_number}`}
                  className="w-full h-auto block"
                  style={{ maxHeight: '70vh', objectFit: 'contain', margin: '0 auto' }}
                />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-coral-100 to-peach-300 flex items-center justify-center">
                  <span className="text-6xl opacity-40">🎨</span>
                </div>
              )}
            </div>
            {/* Text */}
            <div className="bg-white px-5 md:px-12 py-5 md:py-8 flex-1">
              <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-medium text-right w-full max-w-3xl mx-auto">
                {current?.text}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-900 px-4 md:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between mb-2 md:mb-3 max-w-2xl mx-auto">
              <button onClick={goPrev} disabled={currentPage === 0} className="text-white/60 disabled:opacity-20 text-3xl px-3 hover:text-white transition-colors">›</button>
              <div className="flex gap-1.5 items-center">
                {pages.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 4)).map((_, i) => {
                  const pageIdx = Math.max(0, currentPage - 3) + i
                  return (
                    <button key={pageIdx} onClick={() => setCurrentPage(pageIdx)} className={cn('rounded-full transition-all', pageIdx === currentPage ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60')} />
                  )
                })}
              </div>
              <button onClick={goNext} disabled={currentPage === totalPages - 1} className="text-white/60 disabled:opacity-20 text-3xl px-3 hover:text-white transition-colors">‹</button>
            </div>
            <p className="text-center text-white/40 text-xs mb-3">עמוד {currentPage + 1} מתוך {totalPages}</p>

            {/* Action Bar */}
            <div className="flex items-center justify-around md:justify-center md:gap-8 bg-black/30 rounded-2xl py-3 px-2 max-w-lg mx-auto">
              <a href={book.pdf_digital_url || '#'} download className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors">
                <span className="text-xl">⬇️</span>
                <span className="text-xs">הורד PDF</span>
              </a>
              <a href={book.pdf_print_url || '#'} download className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors">
                <span className="text-xl">🖨️</span>
                <span className="text-xs">להדפסה</span>
              </a>
              <Link href={`/book/${book.id}/edit`} className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors">
                <span className="text-xl">✏️</span>
                <span className="text-xs">ערוך</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
