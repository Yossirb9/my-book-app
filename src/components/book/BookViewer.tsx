'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const HTMLFlipBook = require('react-pageflip').default
import { cn } from '@/lib/utils'
import Link from 'next/link'

/* ─── Types ───────────────────────────────────────────────── */
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

/* ─── Front Cover ─────────────────────────────────────────── */
const CoverPage = React.forwardRef<HTMLDivElement, { title: string; coverImage?: string }>(
  ({ title, coverImage }, ref) => (
    <div
      ref={ref}
      className="relative overflow-hidden select-none"
      style={{ height: '100%', background: 'linear-gradient(160deg,#1a1a2e,#0f3460)' }}
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
  )
)
CoverPage.displayName = 'CoverPage'

/* ─── Back Cover ──────────────────────────────────────────── */
const BackCover = React.forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => (
  <div
    ref={ref}
    className="relative overflow-hidden select-none"
    style={{ height: '100%', background: 'linear-gradient(200deg,#0f3460,#1a1a2e)' }}
  >
    <div className="absolute inset-3 rounded-xl border border-white/15 pointer-events-none" />
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-white/20 text-sm font-medium" style={{ direction: 'rtl' }}>{title}</p>
    </div>
  </div>
))
BackCover.displayName = 'BackCover'

/* ─── Image Page (left side of spread) ───────────────────── */
const ImagePage = React.forwardRef<HTMLDivElement, { page: Page }>(({ page }, ref) => (
  <div ref={ref} className="relative overflow-hidden select-none bg-gray-900" style={{ height: '100%' }}>
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
    {/* Page number */}
    <div className="absolute bottom-0 inset-x-0 h-7 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1.5">
      <span className="text-white/40" style={{ fontSize: '0.55rem' }}>{page.page_number}</span>
    </div>
  </div>
))
ImagePage.displayName = 'ImagePage'

/* ─── Text Page (right side of spread) ───────────────────── */
const TextPage = React.forwardRef<HTMLDivElement, { page: Page }>(({ page }, ref) => (
  <div
    ref={ref}
    className="overflow-hidden select-none"
    style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fdf8f2' }}
  >
    {/* Top ornament */}
    <div className="shrink-0 flex items-center justify-center pt-6 pb-3">
      <svg width="64" height="10" viewBox="0 0 64 10">
        <line x1="0" y1="5" x2="22" y2="5" stroke="#d4b89a" strokeWidth="1"/>
        <circle cx="32" cy="5" r="3" fill="#d4b89a"/>
        <line x1="42" y1="5" x2="64" y2="5" stroke="#d4b89a" strokeWidth="1"/>
      </svg>
    </div>
    {/* Text */}
    <div className="flex-1 flex items-center overflow-hidden px-6 py-2">
      <p
        className="text-gray-800 text-right w-full"
        style={{
          direction: 'rtl',
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 500,
          lineHeight: 1.95,
          fontSize: 'clamp(0.78rem, 2vw, 1.05rem)',
        }}
      >
        {page.text}
      </p>
    </div>
    {/* Bottom ornament + number */}
    <div className="shrink-0 flex flex-col items-center pb-5 gap-2">
      <svg width="64" height="10" viewBox="0 0 64 10">
        <line x1="0" y1="5" x2="22" y2="5" stroke="#d4b89a" strokeWidth="1"/>
        <circle cx="32" cy="5" r="3" fill="#d4b89a"/>
        <line x1="42" y1="5" x2="64" y2="5" stroke="#d4b89a" strokeWidth="1"/>
      </svg>
      <span className="text-[#c4a882]" style={{ fontSize: '0.58rem' }}>{page.page_number}</span>
    </div>
  </div>
))
TextPage.displayName = 'TextPage'

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

  // Page structure:
  // 0: Cover    (hard, shown alone on right)
  // 1: Image_1  (left side of spread 1)
  // 2: Text_1   (right side of spread 1)
  // 3: Image_2  (left side of spread 2)
  // 4: Text_2   (right side of spread 2)
  // ...
  // 2N+1: Back cover (hard, shown alone)
  const totalFlip = 2 + pages.length * 2 // cover + back + N*2

  // Which DB page is currently visible (-1 = cover or back)
  const dbIdx = (flipIdx <= 0 || flipIdx >= totalFlip - 1)
    ? -1
    : Math.floor((flipIdx - 1) / 2)

  /* ── Measure available space → compute page dimensions ──── */
  const measureBook = useCallback(() => {
    if (!bookAreaRef.current) return
    const { width, height } = bookAreaRef.current.getBoundingClientRect()
    const availW = width - 140  // subtract arrows (≈70px each)
    const availH = height - 48  // subtract dots+label bar
    if (availW < 80 || availH < 80) return

    // On narrow screens: single-page portrait mode; wide: spread (2 pages)
    const isMobile = availW < 500
    const ratio = format === 'portrait' ? 297 / 210 : 1

    // page_width: in spread mode = half available width; in portrait mode = full
    const divider = isMobile ? 1 : 2
    const maxPageW = isMobile ? 340 : (format === 'portrait' ? 420 : 460)
    let w = Math.min(Math.floor(availW / divider), maxPageW)
    let h = Math.floor(w * ratio)
    if (h > availH) { h = availH; w = Math.floor(h / ratio) }
    // Ensure h > w for square format so library treats it as portrait-safe
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

  /* ── Navigation ─────────────────────────────────────────── */
  const goNext = () => bookRef.current?.pageFlip().flipNext()
  const goPrev = () => bookRef.current?.pageFlip().flipPrev()
  // Jump to a DB page: go to its Image page (left side of spread)
  const goToDbPage = (i: number) => bookRef.current?.pageFlip().turnToPage(1 + i * 2)

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
    setTouchStart(null)
  }

  const { w: pageW, h: pageH, portrait: isMobile } = bookCfg
  const isCover = flipIdx === 0
  const isBack = flipIdx >= totalFlip - 1

  return (
    <div className="flex flex-col bg-[#1a1a2e]" style={{ height: '100dvh' }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between px-3 md:px-6 bg-black/50 backdrop-blur-sm border-b border-white/10"
        style={{ height: '56px' }}
      >
        <Link href="/books" className="text-white/60 text-sm hover:text-white transition-colors whitespace-nowrap">
          ← הספרים שלי
        </Link>
        <h1 className="text-white font-semibold text-sm md:text-base truncate mx-2" style={{ maxWidth: '200px' }}>
          {book.title}
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/book/${book.id}/edit`}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm px-2.5 md:px-3 py-1.5 rounded-lg transition-colors"
          >
            ✏️ <span className="hidden sm:inline">ערוך</span>
          </Link>
          <a
            href={book.pdf_digital_url || '#'}
            download
            className={cn(
              'flex items-center gap-1.5 text-xs md:text-sm px-2.5 md:px-3 py-1.5 rounded-lg transition-colors',
              book.pdf_digital_url
                ? 'bg-coral-600 hover:bg-coral-500 text-white'
                : 'bg-white/5 text-white/30 pointer-events-none'
            )}
          >
            ⬇️ <span className="hidden sm:inline">הורד PDF</span>
          </a>
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
            onClick={() => bookRef.current?.pageFlip().turnToPage(0)}
            className={cn(
              'rounded-xl overflow-hidden border-2 transition-all shrink-0',
              isCover ? 'border-coral-500 shadow-lg shadow-coral-900/50' : 'border-transparent opacity-50 hover:opacity-80'
            )}
          >
            <div
              className="w-full relative overflow-hidden"
              style={{ aspectRatio: format === 'portrait' ? '210/297' : '1/1', background: 'linear-gradient(160deg,#1a1a2e,#0f3460)' }}
            >
              {pages[0]?.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pages[0].image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
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

          {/* DB page thumbnails */}
          {pages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => goToDbPage(idx)}
              className={cn(
                'rounded-xl overflow-hidden border-2 transition-all shrink-0',
                dbIdx === idx
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
          {/* Book + arrows */}
          <div
            ref={bookAreaRef}
            className="flex-1 min-h-0 flex items-center justify-center gap-2 md:gap-5 px-1 md:px-6 py-3"
          >
            {/* Prev › */}
            <button
              onClick={goPrev}
              disabled={isCover}
              className="shrink-0 text-white/50 hover:text-white disabled:opacity-20 select-none transition-colors"
              style={{ fontSize: '2.8rem', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
              aria-label="עמוד קודם"
            >
              ›
            </button>

            {/* Book */}
            {pageW > 0 && (
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
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                startZIndex={2}
                onFlip={(e: { data: number }) => setFlipIdx(e.data)}
                className=""
                style={{
                  boxShadow: '0 24px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)',
                }}
              >
                {/* 0: Front cover (hard page, shown alone) */}
                <CoverPage title={book.title} coverImage={pages[0]?.image_url} />

                {/* For each DB page: Image (left) + Text (right) */}
                {pages.map((p, i) => [
                  <ImagePage key={`img-${p.id}`} page={p} />,
                  <TextPage  key={`txt-${p.id}`} page={p} />,
                ])}

                {/* Last: Back cover (hard page, shown alone) */}
                <BackCover title={book.title} />
              </HTMLFlipBook>
            )}

            {/* Loading spinner */}
            {pageW === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Next ‹ */}
            <button
              onClick={goNext}
              disabled={isBack}
              className="shrink-0 text-white/50 hover:text-white disabled:opacity-20 select-none transition-colors"
              style={{ fontSize: '2.8rem', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
              aria-label="עמוד הבא"
            >
              ‹
            </button>
          </div>

          {/* ── Progress dots ─────────────────────────────── */}
          <div className="shrink-0 flex flex-col items-center gap-1 pb-3">
            <div className="flex gap-1.5 items-center">
              {/* Cover dot */}
              <button
                onClick={() => bookRef.current?.pageFlip().turnToPage(0)}
                className={cn('rounded-full transition-all', isCover ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60')}
              />
              {/* DB pages window */}
              {pages
                .slice(Math.max(0, dbIdx < 0 ? 0 : dbIdx - 2), Math.min(pages.length, dbIdx < 0 ? 5 : dbIdx + 4))
                .map((_, i) => {
                  const idx = Math.max(0, dbIdx < 0 ? 0 : dbIdx - 2) + i
                  return (
                    <button
                      key={idx}
                      onClick={() => goToDbPage(idx)}
                      className={cn('rounded-full transition-all', dbIdx === idx ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60')}
                    />
                  )
                })}
              {/* Back cover dot */}
              <button
                onClick={() => bookRef.current?.pageFlip().turnToPage(totalFlip - 1)}
                className={cn('rounded-full transition-all', isBack ? 'w-4 h-2 bg-coral-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60')}
              />
            </div>
            <p className="text-white/30 text-xs">
              {isCover ? 'כריכה קדמית' : isBack ? 'כריכה אחורית' : `עמוד ${dbIdx + 1} מתוך ${pages.length}`}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
