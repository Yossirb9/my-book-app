'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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

export default function BookEditor({ book, pages }: { book: Book; pages: Page[] }) {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [editMode, setEditMode] = useState<EditMode | null>(null)
  const [editText, setEditText] = useState('')
  const [editPrompt, setEditPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [imageRegen, setImageRegen] = useState(book.image_regenerations_left)
  const [textRegen, setTextRegen] = useState(book.text_regenerations_left)
  const [localPages, setLocalPages] = useState(pages)

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
      const res = await fetch(`/api/books/${book.id}/page/${selectedPage.id}/text`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      })
      if (!res.ok) throw new Error('שגיאה')
      setLocalPages((prev) =>
        prev.map((p) => (p.id === selectedPage.id ? { ...p, text: editText } : p))
      )
      setTextRegen((n) => n - 1)
      setMessage('הטקסט עודכן בהצלחה ✅')
      setEditMode(null)
    } catch {
      setMessage('שגיאה בשמירה')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenImage = async () => {
    if (!selectedPage) return
    setLoading(true)
    try {
      const res = await fetch(`/api/books/${book.id}/page/${selectedPage.id}/regenerate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: editMode === 'prompt' ? editPrompt : undefined }),
      })
      if (!res.ok) throw new Error('שגיאה')
      const data = await res.json()
      setLocalPages((prev) =>
        prev.map((p) => (p.id === selectedPage.id ? { ...p, image_url: data.imageUrl } : p))
      )
      setImageRegen((n) => n - 1)
      setMessage('התמונה עודכנה בהצלחה ✅')
      setEditMode(null)
    } catch {
      setMessage('שגיאה בייצור תמונה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#FFF9F0]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <Link href={`/book/${book.id}`} className="text-gray-400 text-sm">← חזרה לספר</Link>
        <h2 className="font-bold text-gray-800">עריכת הספר</h2>
        <div className="w-16" />
      </div>

      {/* Regen Counter */}
      <div className="mx-4 bg-peach-300/40 rounded-2xl p-3 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">תיקונים שנותרו:</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🎨</span>
            <span className="text-sm text-gray-600">תמונות: <strong>{imageRegen}/3</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">✏️</span>
            <span className="text-sm text-gray-600">טקסט: <strong>{textRegen}/3</strong></span>
          </div>
        </div>
      </div>

      {/* Page Grid */}
      <div className="px-4 mb-4">
        <p className="font-semibold text-gray-700 mb-2">בחרו עמוד לעריכה</p>
        <div className="grid grid-cols-3 gap-2">
          {localPages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className={cn(
                'aspect-square rounded-xl overflow-hidden border-2 transition-all relative',
                selectedPage?.id === page.id
                  ? 'border-coral-500 shadow-md'
                  : 'border-gray-100'
              )}
            >
              {page.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.image_url} alt={`עמוד ${page.page_number}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-coral-50 to-peach-300/30 flex items-center justify-center text-2xl">
                  📄
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/40 py-0.5">
                <p className="text-white text-xs text-center">{page.page_number}</p>
              </div>
              {selectedPage?.id === page.id && (
                <div className="absolute top-1 right-1 bg-coral-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Actions for selected page */}
      {selectedPage && (
        <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="font-semibold text-gray-700 mb-3">עמוד {selectedPage.page_number} נבחר</p>

          {/* Current text preview */}
          <p className="text-sm text-gray-500 mb-3 bg-gray-50 rounded-xl p-2 text-right">
            {selectedPage.text}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => openEdit(selectedPage, 'text')}
              disabled={textRegen <= 0}
              className="w-full py-2.5 border-2 border-coral-200 rounded-xl text-coral-600 font-medium text-sm hover:bg-coral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✏️ ערוך טקסט ({textRegen} נותרו)
            </button>
            <button
              onClick={() => openEdit(selectedPage, 'image')}
              disabled={imageRegen <= 0}
              className="w-full py-2.5 border-2 border-purple-200 rounded-xl text-purple-600 font-medium text-sm hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🎨 צור תמונה מחדש ({imageRegen} נותרו)
            </button>
            <button
              onClick={() => openEdit(selectedPage, 'prompt')}
              disabled={imageRegen <= 0}
              className="w-full py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🔧 שנה הנחיה לתמונה
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="mx-4 mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Edit Modal */}
      {editMode && selectedPage && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">
                {editMode === 'text' ? 'עריכת טקסט' : editMode === 'image' ? 'יצירת תמונה מחדש' : 'שינוי הנחיה'}
              </h3>
              <button onClick={() => setEditMode(null)} className="text-gray-400 text-xl">✕</button>
            </div>

            {editMode === 'text' ? (
              <>
                <textarea
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-coral-400 resize-none"
                />
                <button
                  onClick={handleSaveText}
                  disabled={loading}
                  className="w-full mt-3 bg-coral-500 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                >
                  {loading ? 'שומר...' : 'שמור שינויים'}
                </button>
              </>
            ) : editMode === 'prompt' ? (
              <>
                <textarea
                  rows={4}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-coral-400 resize-none"
                  placeholder="תאר את הסצנה שתרצה לצייר..."
                />
                <button
                  onClick={handleRegenImage}
                  disabled={loading}
                  className="w-full mt-3 bg-purple-500 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                >
                  {loading ? 'מצייר...' : 'צור תמונה חדשה'}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  התמונה הנוכחית תוחלף בתמונה חדשה עם אותה הנחיה מקורית.
                </p>
                <button
                  onClick={handleRegenImage}
                  disabled={loading}
                  className="w-full bg-purple-500 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                >
                  {loading ? 'מצייר...' : '🎨 צור תמונה מחדש'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
