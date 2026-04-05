'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const HTMLFlipBook = require('react-pageflip').default
import { cn } from '@/lib/utils'
import Link from 'next/link'
import BookEditor from './BookEditor'

/* ─── Types ───────────────────────────────────────────────── */
interface Page {
  id: string
  page_number: number
  text: string
  image_url?: string
  image_prompt?: string
}
interface Book {
  id: string
  title: string
  pdf_digital_url?: string
  pdf_print_url?: string
  image_regenerations_left: number
  text_regenerations_left: number
}

/* ─────────────────────────────────────────────────────────────
   STRATEGY: CSS scaleX(-1) mirror on the HTMLFlipBook wrapper.
   This guarantees RTL appearance (cover on RIGHT, pages flip
   right→left) regardless of react-pageflip internals.
   Every page component un-mirrors its OWN content with a nested
   scaleX(-1), so text/images appear normal.
   Page order in array: [TextPage, ImagePage] per spread.
   After mirror: Text appears on RIGHT, Image appears on LEFT ✓
   ───────────────────────────────────────────────────────────── */

/* ─── Front Cover ─────────────────────────────────────────── */
const CoverPage = React.forwardRef<HTMLDivElement, { title: string; coverImage?: string }>(
  ({ title, coverImage }, ref) => (
    <div ref={ref} style={{ height: '100%' }}>
      {/* Un-mirror: content looks normal, book wrapper mirrors it to RTL */}
      <div
        className="relative overflow-hidden select-none"
        style={{ transform: 'scaleX(-1)', height: '100%', background: 'linear-gradient(160deg,#1a1a2e,#0f3460)' }}
      >
        {coverImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/75" />
          </>
        )}
        <div className="absolute inset-3 rounded-xl border border-white/25 pointer-events-none" />
        <div className="absolute inset-5 rounded-lg border border-white/10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 flex flex-col items-center gap-2" style={{ direction: 'rtl' }}>
          <div className="w-12 h-px bg-white/50" />
          <h1
            className="text-white font-bold text-center leading-snug mt-1"
            style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.6rem)', textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
          >
            {title}
          </h1>
          <div className="w-12 h-px bg-white/50" />
          <p className="text-white/40 text-xs mt-1">ספר אישי</p>
        </div>
      </div>
    </div>
  )
)
CoverPage.displayName = 'CoverPage'

/* ─── Back Cover ──────────────────────────────────────────── */
const BackCover = React.forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => (
  <div ref={ref} style={{ height: '100%' }}>
    <div
      className="relative overflow-hidden select-none"
      style={{ transform: 'scaleX(-1)', height: '100%', background: 'linear-gradient(200deg,#0f3460,#1a1a2e)' }}
    >
      <div className="absolute inset-3 rounded-xl border border-white/15 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/20 text-sm font-medium" style={{ direction: 'rtl' }}>{title}</p>
      </div>
    </div>
  </div>
))
BackCover.displayName = 'BackCover'

/* ─── Text Page (RIGHT side of spread in RTL) ────────────── */
const TextPage = React.forwardRef<HTMLDivElement, { page: Page }>(({ page }, ref) => (
  <div ref={ref} style={{ height: '100%' }}>
    <div style={{ transform: 'scaleX(-1)', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Solid cream background — absolute so react-pageflip can't override it */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#fffbf5' }} />
      {/* Content layer */}
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Top ornament */}
        <div className="shrink-0 flex items-center justify-center pt-6 pb-3">
          <svg width="64" height="10" viewBox="0 0 64 10">
            <line x1="0" y1="5" x2="22" y2="5" stroke="#c9a87c" strokeWidth="1.5"/>
            <circle cx="32" cy="5" r="3.5" fill="#c9a87c"/>
            <line x1="42" y1="5" x2="64" y2="5" stroke="#c9a87c" strokeWidth="1.5"/>
          </svg>
        </div>
        {/* Text */}
        <div className="flex-1 flex items-center overflow-hidden px-6 py-4">
          <p
            style={{
              direction: 'rtl',
              fontFamily: "'Heebo', sans-serif",
              fontWeight: 600,
              lineHeight: 2.1,
              fontSize: 'clamp(0.85rem, 2.2vw, 1.1rem)',
              color: '#1a1a1a',
              textAlign: 'right',
              width: '100%',
            }}
          >
            {page.text}
          </p>
        </div>
        {/* Bottom ornament + number */}
        <div className="shrink-0 flex flex-col items-center pb-5 gap-2">
          <svg width="64" height="10" viewBox="0 0 64 10">
            <line x1="0" y1="5" x2="22" y2="5" stroke="#c9a87c" strokeWidth="1.5"/>
            <circle cx="32" cy="5" r="3.5" fill="#c9a87c"/>
            <line x1="42" y1="5" x2="64" y2="5" stroke="#c9a87c" strokeWidth="1.5"/>
          </svg>
          <span style={{ fontSize: '0.58rem', color: '#b8956a' }}>{page.page_number}</span>
        </div>
      </div>
    </div>
  </div>
))
TextPage.displayName = 'TextPage'

/* ─── Image Page (LEFT side of spread in RTL) ────────────── */
const ImagePage = React.forwardRef<HTMLDivElement, { page: Page }>(({ page }, ref) => (
  <div ref={ref} style={{ height: '100%' }}>
    <div className="relative overflow-hidden select-none bg-gray-900" style={{ transform: 'scaleX(-1)', height: '100%' }}>
      {page.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={page.image_url}
          alt={`עמוד ${page.page_number}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-50 to-pink-100 flex items-center justify-center">
          <span className="text-6xl opacity-20">🎨</span>
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 h-7 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1.5">
        <span className="text-white/40" style={{ fontSize: '0.55rem' }}>{page.page_number}</span>
      </div>
    </div>
  </div>
))
ImagePage.displayName = 'ImagePage'

/* ─── Main Viewer ─────────────────────────────────────────── */
export default function BookViewer({
  book,
  pages,
  format = 'portrait',
}: {
  book: Book
  pages: Page[]
  format?: 'square' | 'portrait'
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null)
  const bookAreaRef = useRef<HTMLDivElement>(null)
  const cfgRef = useRef({ w: 0, h: 0, portrait: false })
  const [bookCfg, setBookCfg] = useState({ w: 0, h: 0, portrait: false })
  const [bookKey, setBookKey] = useState(0)
  const [flipIdx, setFlipIdx] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [localPages, setLocalPages] = useState(pages)
  const [bookOpened, setBookOpened] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  const handleDownloadPdf = async () => {
    setPdfGenerating(true)
    try {
      const res = await fetch(`/api/books/${book.id}/pdf?type=digital`, { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        const a = document.createElement('a')
        a.href = data.url
        a.download = `${book.title}.pdf`
        a.click()
      } else {
        alert('שגיאה ביצירת ה-PDF, נסה שוב')
      }
    } catch {
      alert('שגיאה ביצירת ה-PDF, נסה שוב')
    } finally {
      setPdfGenerating(false)
    }
  }

  // Page structure (mirrored book, LTR internally):
  // 0: Cover    (hard, shown alone → appears on RIGHT after mirror)
  // 1: TextPage_1  (index 1 → appears on RIGHT after mirror)
  // 2: ImagePage_1 (index 2 → appears on LEFT after mirror)
  // 3: TextPage_2
  // 4: ImagePage_2
  // ...
  // 2N+1: Back cover (hard, shown alone)
  const totalFlip = 2 + pages.length * 2

  const dbIdx = (flipIdx <= 0 || flipIdx >= totalFlip - 1)
    ? -1
    : Math.floor((flipIdx - 1) / 2)

  /* ── Measure available space ─────────────────────────────── */
  const measureBook = useCallback(() => {
    if (!bookAreaRef.current) return
    const { width, height } = bookAreaRef.current.getBoundingClientRect()
    const availW = width - 140
    const availH = height - 48
    if (availW < 80 || availH < 80) return

    const isMobile = availW < 500
    const ratio = format === 'portrait' ? 297 / 210 : 1

    const divider = isMobile ? 1 : 2
    const maxPageW = isMobile ? 340 : (format === 'portrait' ? 420 : 460)
    let w = Math.min(Math.floor(availW / divider), maxPageW)
    let h = Math.floor(w * ratio)
    if (h > availH) { h = availH; w = Math.floor(h / ratio) }
    if (format === 'square' && h <= w) h = w + 1

    const cur = cfgRef.current
    if (Math.abs(w - cur.w) > 15 || Math.abs(h - cur.h) > 15 || isMobile !== cur.portrait) {
      const cfg = { w, h, portrait: isMobile }
      cfgRef.current = cfg
      setBookCfg(cfg)
      setBookKey((k) => k + 1)
    }
  }, [format])

  useEffect(() => {
    const t = setTimeout(measureBook, 80)
    window.addEventListener('resize', measureBook)
    return () => { clearTimeout(t); window.removeEventListener('resize', measureBook) }
  }, [measureBook])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!bookOpened) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        bookRef.current?.pageFlip().flipNext()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        bookRef.current?.pageFlip().flipPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [bookOpened])

  /* ── Navigation ──────────────────────────────────────────── */
  const goNext = () => bookRef.current?.pageFlip().flipNext()
  const goPrev = () => bookRef.current?.pageFlip().flipPrev()

  const goToDbPage = (i: number) => {
    const targetPage = 1 + i * 2
    if (!bookOpened) {
      setBookOpened(true)
      setTimeout(() => bookRef.current?.pageFlip().turnToPage(targetPage), 200)
    } else {
      bookRef.current?.pageFlip().turnToPage(targetPage)
    }
  }

  const openBook = () => {
    setBookOpened(true)
    setTimeout(() => bookRef.current?.pageFlip().flipNext(), 150)
  }

  // Swipe (touch)
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev()
      else goNext()
    }
    setTouchStart(null)
  }

  // Mouse drag on the book (replaces react-pageflip's reversed internal drag)
  const handleMouseDown = (e: React.MouseEvent) => setMouseStart(e.clientX)
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStart === null) return
    const diff = mouseStart - e.clientX
    if (Math.abs(diff) > 30) {
      if (diff > 0) goPrev()
      else goNext()
    }
    setMouseStart(null)
  }
  const handleMouseLeave = () => setMouseStart(null)

  const { w: pageW, h: pageH, portrait: isMobile } = bookCfg
  const isCover = flipIdx === 0 || !bookOpened
  const isBack = bookOpened && flipIdx >= totalFlip - 1

  return (
    <div className="flex flex-col bg-[#1a1a2e]" style={{ height: '100dvh' }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between gap-2 border-b border-white/10 bg-black/50 px-3 backdrop-blur-sm md:px-6"
        style={{ height: '56px' }}
      >
        <Link href="/books" className="text-xs text-white/60 transition-colors hover:text-white md:text-sm">
          ← הספרים שלי
        </Link>
        <h1 className="mx-1 min-w-0 flex-1 truncate text-center text-sm font-semibold text-white md:mx-2 md:text-base" style={{ maxWidth: '220px' }}>
          {book.title}
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm px-2.5 md:px-3 py-1.5 rounded-lg transition-colors"
          >
            ✏️ <span className="hidden sm:inline">ערוך</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfGenerating}
            className="flex items-center gap-1.5 bg-coral-600 hover:bg-coral-500 disabled:opacity-60 disabled:cursor-wait text-white text-xs md:text-sm px-2.5 md:px-3 py-1.5 rounded-lg transition-colors"
          >
            {pdfGenerating ? '⏳' : '⬇️'}
            <span className="hidden sm:inline">{pdfGenerating ? 'יוצר PDF...' : 'הורד PDF'}</span>
          </button>
          {book.pdf_print_url && (
            <a
              href={book.pdf_print_url}
              download
              className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-lg transition-colors"
            >
              🖨️ להדפסה
            </a>
          )}
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-44 bg-black/30 border-r border-white/10 overflow-y-auto py-3 gap-2 px-2.5 shrink-0">
          <p className="text-white/40 text-xs text-center mb-1">כל העמודים</p>

          {/* Cover thumbnail */}
          <button
            onClick={() => {
              if (bookOpened) bookRef.current?.pageFlip().turnToPage(0)
              // If not opened: cover is already visible (static), do nothing
            }}
            className={cn(
              'rounded-xl overflow-hidden border-2 transition-all shrink-0',
              isCover ? 'border-coral-500 shadow-lg shadow-coral-900/50' : 'border-transparent opacity-50 hover:opacity-80'
            )}
          >
            <div
              className="w-full relative overflow-hidden"
              style={{ aspectRatio: format === 'portrait' ? '210/297' : '1/1', background: 'linear-gradient(160deg,#1a1a2e,#0f3460)' }}
            >
              {localPages[0]?.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={localPages[0].image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              )}
              <div className="absolute inset-0 flex items-end justify-center pb-2">
                <span className="text-white text-xs font-bold text-center px-1 leading-tight" style={{ direction: 'rtl', textShadow: '0 1px 4px rgba(0,0,0,0.9)', fontSize: '0.6rem' }}>
                  {book.title.length > 22 ? book.title.slice(0, 22) + '…' : book.title}
                </span>
              </div>
            </div>
            <div className="bg-gray-900/80 py-1">
              <p className="text-white/50 text-xs text-center">כריכה</p>
            </div>
          </button>

          {/* Page thumbnails */}
          {localPages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => goToDbPage(idx)}
              className={cn(
                'rounded-xl overflow-hidden border-2 transition-all shrink-0',
                !isCover && !isBack && dbIdx === idx
                  ? 'border-coral-500 shadow-lg shadow-coral-900/50'
                  : 'border-transparent opacity-50 hover:opacity-80'
              )}
            >
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={`עמוד ${p.page_number}`} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-coral-100 to-orange-200 flex items-center justify-center text-xs text-gray-500">
                  {p.page_number}
                </div>
              )}
              <div className="bg-gray-900/80 py-1">
                <p className="text-white/50 text-xs text-center">{p.page_number}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* ── Main ────────────────────────────────────────── */}
        <main
          className="flex-1 flex flex-col min-h-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Book area */}
          <div
            ref={bookAreaRef}
            className="flex-1 min-h-0 flex items-center justify-center px-1 md:px-6 py-3"
          >
            {/* ── CLOSED: static cover ──────────────────── */}
            {!bookOpened && (
              <div className="flex flex-col items-center gap-5">
                <div
                  className="relative cursor-pointer select-none"
                  style={{
                    width: pageW > 0 ? pageW : 260,
                    height: pageH > 0 ? pageH : 370,
                    boxShadow: '8px 12px 50px rgba(0,0,0,0.85), -3px 0 8px rgba(0,0,0,0.4)',
                    borderRadius: '3px 6px 6px 3px',
                    overflow: 'hidden',
                    transform: 'scaleX(-1)',
                  }}
                  onClick={openBook}
                >
                  <CoverPage title={book.title} coverImage={localPages[0]?.image_url} />
                </div>
                <button
                  onClick={openBook}
                  className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                >
                  <span>פתח את הספר</span>
                  <span style={{ fontSize: '1.1rem' }}>‹</span>
                </button>
              </div>
            )}

            {/* ── OPEN: mirrored flip book ───────────────── */}
            {bookOpened && (
              /* dir="ltr" prevents RTL flex from visually swapping the buttons */
              <div className="flex items-center justify-center gap-2 md:gap-5 w-full h-full" dir="ltr">
                {/* LEFT button = previous page */}
                <button
                  onClick={goPrev}
                  disabled={flipIdx <= 0}
                  className="shrink-0 text-white/50 hover:text-white disabled:opacity-20 select-none transition-colors"
                  style={{ fontSize: '2.8rem', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                  aria-label="עמוד קודם"
                >
                  ‹
                </button>

                {pageW > 0 && (
                  /* scaleX(-1) mirror: makes LTR book appear RTL (cover on right, pages flip right→left) */
                  <div
                    style={{ transform: 'scaleX(-1)', cursor: 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                  >
                    <HTMLFlipBook
                      key={bookKey}
                      ref={bookRef}
                      width={pageW}
                      height={pageH}
                      size="fixed"
                      minWidth={pageW}
                      maxWidth={pageW}
                      minHeight={pageH}
                      maxHeight={pageH}
                      usePortrait={isMobile}
                      showCover={true}
                      flippingTime={680}
                      maxShadowOpacity={0.55}
                      drawShadow={true}
                      startPage={0}
                      autoSize={false}
                      mobileScrollSupport={false}
                      clickEventForward={true}
                      useMouseEvents={false}
                      swipeDistance={30}
                      showPageCorners={true}
                      disableFlipByClick={false}
                      startZIndex={2}
                      onFlip={(e: { data: number }) => {
                        setFlipIdx(e.data)
                        // Close book smoothly when user navigates back to cover
                        if (e.data === 0) {
                          setTimeout(() => setBookOpened(false), 750)
                        }
                      }}
                      style={{
                        boxShadow: '0 24px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)',
                      }}
                    >
                      <CoverPage title={book.title} coverImage={localPages[0]?.image_url} />
                      {localPages.map((p) => [
                        // Text first → appears on RIGHT in mirrored view ✓
                        <TextPage  key={`txt-${p.id}`} page={p} />,
                        // Image second → appears on LEFT in mirrored view ✓
                        <ImagePage key={`img-${p.id}`} page={p} />,
                      ])}
                      <BackCover title={book.title} />
                    </HTMLFlipBook>
                  </div>
                )}

                {pageW === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}

                {/* RIGHT button = next page */}
                <button
                  onClick={goNext}
                  disabled={isBack}
                  className="shrink-0 text-white/50 hover:text-white disabled:opacity-20 select-none transition-colors"
                  style={{ fontSize: '2.8rem', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                  aria-label="עמוד הבא"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* ── Progress dots ─────────────────────────────── */}
          <div className="shrink-0 flex flex-col items-center gap-1 pb-3">
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => {
                  if (bookOpened) bookRef.current?.pageFlip().turnToPage(0)
                }}
                className={cn('rounded-full transition-all', isCover ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60')}
              />
              {localPages
                .slice(Math.max(0, dbIdx < 0 ? 0 : dbIdx - 2), Math.min(localPages.length, dbIdx < 0 ? 5 : dbIdx + 4))
                .map((_, i) => {
                  const idx = Math.max(0, dbIdx < 0 ? 0 : dbIdx - 2) + i
                  return (
                    <button
                      key={idx}
                      onClick={() => goToDbPage(idx)}
                      className={cn('rounded-full transition-all', !isCover && !isBack && dbIdx === idx ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60')}
                    />
                  )
                })}
              <button
                onClick={() => {
                  if (bookOpened) bookRef.current?.pageFlip().turnToPage(totalFlip - 1)
                }}
                className={cn('rounded-full transition-all', isBack ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60')}
              />
            </div>
            <p className="text-white/30 text-xs">
              {isCover ? 'כריכה קדמית' : isBack ? 'כריכה אחורית' : `עמוד ${dbIdx + 1} מתוך ${localPages.length}`}
            </p>
          </div>
        </main>
      </div>

      {/* ── Editor Overlay ───────────────────────────────────── */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex justify-start" dir="rtl">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditor(false)}
          />
          {/* Panel slides in from the right (start in RTL) */}
          <div className="relative w-full max-w-sm bg-[#FFF9F0] h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-base">עריכת הספר</h2>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <BookEditor
                book={book}
                pages={localPages}
                onPagesChange={setLocalPages}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
