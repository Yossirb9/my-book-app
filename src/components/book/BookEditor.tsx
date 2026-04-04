'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

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
  image_regenerations_left: number
  text_regenerations_left: number
}

type EditMode = 'text' | 'image' | 'prompt'

export default function BookEditor({
  book,
  pages,
  onPagesChange,
}: {
  book: Book
  pages: Page[]
  onPagesChange?: (pages: Page[]) => void
}) {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [editMode, setEditMode] = useState<EditMode | null>(null)
  const [editText, setEditText] = useState('')
  const [editPrompt, setEditPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [imageRegen, setImageRegen] = useState(book.image_regenerations_left)
  const [textRegen, setTextRegen] = useState(book.text_regenerations_left)
  const [localPages, setLocalPages] = useState(pages)

  const updatePages = (updatedPages: Page[]) => {
    setLocalPages(updatedPages)
    onPagesChange?.(updatedPages)
  }

  const openEdit = (page: Page, mode: EditMode) => {
    setSelectedPage(page)
    setEditMode(mode)
    setEditText(page.text)
    setEditPrompt(page.image_prompt || '')
    setMessage('')
  }

  const handleSaveText = async () => {
    if (!selectedPage) return

    setLoading(true)
    try {
      const response = await fetch(`/api/books/${book.id}/page/${selectedPage.id}/text`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      })

      if (!response.ok) throw new Error('שמירת הטקסט נכשלה.')

      updatePages(localPages.map((page) => (page.id === selectedPage.id ? { ...page, text: editText } : page)))
      setTextRegen((value) => value - 1)
      setMessage('הטקסט עודכן בהצלחה.')
      setEditMode(null)
    } catch {
      setMessage('לא הצלחנו לשמור את הטקסט.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenImage = async () => {
    if (!selectedPage) return

    setLoading(true)
    try {
      const response = await fetch(`/api/books/${book.id}/page/${selectedPage.id}/regenerate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: editMode === 'prompt' ? editPrompt : undefined }),
      })

      if (!response.ok) throw new Error('יצירת התמונה נכשלה.')
      const data = await response.json()

      updatePages(
        localPages.map((page) =>
          page.id === selectedPage.id ? { ...page, image_url: data.imageUrl, image_prompt: editPrompt || page.image_prompt } : page
        )
      )
      setImageRegen((value) => value - 1)
      setMessage('התמונה הוחלפה בהצלחה.')
      setEditMode(null)
    } catch {
      setMessage('לא הצלחנו ליצור תמונה חדשה כרגע.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col pb-8" dir="rtl">
      <div className="mx-4 mt-4 rounded-[2rem] border border-coral-100 bg-coral-50 p-4">
        <p className="text-sm font-semibold text-gray-900">מה חשוב לדעת לפני עריכה?</p>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          שינוי טקסט שומר את הנוסח החדש במקום הקיים. יצירת תמונה מחדש מחליפה את התמונה הנוכחית, ואין כרגע היסטוריית גרסאות לחזרה אחורה.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-700">
          <span className="rounded-full bg-white px-3 py-1 font-semibold">עריכות טקסט שנותרו: {textRegen}</span>
          <span className="rounded-full bg-white px-3 py-1 font-semibold">עריכות תמונה שנותרו: {imageRegen}</span>
        </div>
      </div>

      <div className="px-4 pt-5">
        <p className="mb-3 text-sm font-semibold text-gray-900">בחרו עמוד לעריכה</p>
        <div className="grid grid-cols-3 gap-2">
          {localPages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-2xl border-2 transition-all',
                selectedPage?.id === page.id ? 'border-coral-500 shadow-md shadow-coral-100' : 'border-gray-100'
              )}
            >
              {page.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.image_url} alt={`עמוד ${page.page_number}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-coral-50 to-orange-100 text-sm font-semibold text-gray-500">
                  עמוד {page.page_number}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/45 py-1 text-xs text-white">{page.page_number}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedPage ? (
        <div className="mx-4 mt-4 rounded-[2rem] border border-white bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">עמוד {selectedPage.page_number}</p>
              <p className="text-xs text-gray-500">בחרו פעולה אחת ברורה לכל שינוי.</p>
            </div>
            <span className="rounded-full bg-[#FFF9F0] px-3 py-1 text-xs font-semibold text-coral-700">
              ללא היסטוריה
            </span>
          </div>

          <div className="rounded-[1.5rem] bg-gray-50 p-3 text-sm leading-7 text-gray-600">{selectedPage.text}</div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => openEdit(selectedPage, 'text')}
              disabled={textRegen <= 0}
              className="w-full rounded-2xl border-2 border-coral-200 px-4 py-3 text-sm font-semibold text-coral-700 transition-colors hover:bg-coral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              עריכת טקסט ({textRegen} נותרו)
            </button>
            <button
              onClick={() => openEdit(selectedPage, 'image')}
              disabled={imageRegen <= 0}
              className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              יצירת תמונה מחדש ({imageRegen} נותרו)
            </button>
            <button
              onClick={() => openEdit(selectedPage, 'prompt')}
              disabled={imageRegen <= 0}
              className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              שינוי הנחיה לתמונה
            </button>
          </div>
        </div>
      ) : null}

      {message ? (
        <div className="mx-4 mt-4 rounded-[1.5rem] bg-green-50 px-4 py-3 text-center text-sm text-green-700">
          {message}
        </div>
      ) : null}

      {editMode && selectedPage ? (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/50">
          <div className="w-full max-w-md rounded-t-[2rem] bg-white p-6" dir="rtl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editMode === 'text'
                    ? 'עריכת טקסט'
                    : editMode === 'image'
                    ? 'יצירת תמונה מחדש'
                    : 'שינוי הנחיה לתמונה'}
                </h3>
                <p className="text-sm text-gray-500">
                  {editMode === 'text'
                    ? 'הטקסט החדש יחליף את הטקסט הקיים בעמוד הזה.'
                    : 'התמונה החדשה תחליף את התמונה הקיימת, ללא גרסת גיבוי.'}
                </p>
              </div>
              <button onClick={() => setEditMode(null)} className="text-2xl text-gray-400 hover:text-gray-700">
                ×
              </button>
            </div>

            {editMode === 'text' ? (
              <>
                <textarea
                  rows={5}
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-coral-400"
                />
                <button
                  onClick={handleSaveText}
                  disabled={loading}
                  className="mt-4 w-full rounded-full bg-coral-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'שומרים...' : 'שמרו טקסט חדש'}
                </button>
              </>
            ) : editMode === 'prompt' ? (
              <>
                <textarea
                  rows={5}
                  value={editPrompt}
                  onChange={(event) => setEditPrompt(event.target.value)}
                  placeholder="תארו מה חשוב שיראה בתמונה החדשה: מיקום, הבעה, צבעוניות, סצנה."
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-coral-400"
                />
                <button
                  onClick={handleRegenImage}
                  disabled={loading}
                  className="mt-4 w-full rounded-full bg-coral-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'מכינים תמונה...' : 'צרו תמונה חדשה'}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm leading-7 text-gray-600">
                  בלחיצה הבאה ניצור תמונה חדשה על בסיס ההנחיה הקיימת ונחליף את התמונה הנוכחית בעמוד זה.
                </p>
                <button
                  onClick={handleRegenImage}
                  disabled={loading}
                  className="mt-4 w-full rounded-full bg-coral-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'מכינים תמונה...' : 'החליפו את התמונה'}
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
