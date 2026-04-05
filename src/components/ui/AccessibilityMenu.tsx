'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type AccessibilityState = {
  fontScale: 'base' | 'large' | 'xlarge'
  contrast: boolean
  underlineLinks: boolean
  disableMotion: boolean
}

const STORAGE_KEY = 'site-accessibility-settings'

const DEFAULT_STATE: AccessibilityState = {
  fontScale: 'base',
  contrast: false,
  underlineLinks: false,
  disableMotion: false,
}

function applyStateToDocument(state: AccessibilityState) {
  const body = document.body
  body.dataset.fontScale = state.fontScale
  body.dataset.highContrast = state.contrast ? 'true' : 'false'
  body.dataset.underlineLinks = state.underlineLinks ? 'true' : 'false'
  body.dataset.reduceMotion = state.disableMotion ? 'true' : 'false'
}

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [settings, setSettings] = useState<AccessibilityState>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_STATE
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        return DEFAULT_STATE
      }

      return { ...DEFAULT_STATE, ...(JSON.parse(saved) as AccessibilityState) }
    } catch {
      return DEFAULT_STATE
    }
  })

  useEffect(() => {
    applyStateToDocument(settings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const actions = useMemo(
    () => [
      {
        label: 'טקסט רגיל',
        active: settings.fontScale === 'base',
        onClick: () => setSettings((current) => ({ ...current, fontScale: 'base' })),
      },
      {
        label: 'טקסט גדול',
        active: settings.fontScale === 'large',
        onClick: () => setSettings((current) => ({ ...current, fontScale: 'large' })),
      },
      {
        label: 'טקסט גדול מאוד',
        active: settings.fontScale === 'xlarge',
        onClick: () => setSettings((current) => ({ ...current, fontScale: 'xlarge' })),
      },
      {
        label: 'ניגודיות גבוהה',
        active: settings.contrast,
        onClick: () => setSettings((current) => ({ ...current, contrast: !current.contrast })),
      },
      {
        label: 'הדגשת קישורים',
        active: settings.underlineLinks,
        onClick: () => setSettings((current) => ({ ...current, underlineLinks: !current.underlineLinks })),
      },
      {
        label: 'הפחתת תנועה',
        active: settings.disableMotion,
        onClick: () => setSettings((current) => ({ ...current, disableMotion: !current.disableMotion })),
      },
    ],
    [settings]
  )

  const textSizeActions = actions.slice(0, 3)
  const displayActions = actions.slice(3)

  return (
    <div ref={containerRef} className="fixed bottom-5 left-5 z-50">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-coral-200 bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-[0_12px_30px_rgba(26,26,46,0.12)] transition hover:border-coral-400 hover:text-coral-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral-50 text-coral-600">א</span>
        נגישות
      </button>

      {isOpen ? (
        <div
          id="accessibility-menu"
          role="dialog"
          aria-label="תפריט נגישות"
          className="mt-3 w-[min(92vw,348px)] rounded-[1.6rem] border border-coral-100 bg-white p-4 shadow-[0_18px_44px_rgba(26,26,46,0.14)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-black text-gray-900">התאמות נגישות</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                התאמות מהירות לקריאה, ניגודיות, קישורים ותנועה. אפשר לסגור גם עם מקש `Esc`.
              </p>
            </div>
            <button
              type="button"
              aria-label="סגירת תפריט נגישות"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
            >
              סגור
            </button>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-500">גודל טקסט</p>
            <div className="mt-2 grid gap-2">
              {textSizeActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  aria-pressed={action.active}
                  onClick={action.onClick}
                  className={cn(
                    'rounded-2xl border px-4 py-3 text-right text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200',
                    action.active
                      ? 'border-coral-500 bg-coral-50 text-coral-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-coral-300 hover:text-coral-700'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-500">התאמות תצוגה</p>
            <div className="mt-2 grid gap-2">
              {displayActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  aria-pressed={action.active}
                  onClick={action.onClick}
                  className={cn(
                    'rounded-2xl border px-4 py-3 text-right text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200',
                    action.active
                      ? 'border-coral-500 bg-coral-50 text-coral-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-coral-300 hover:text-coral-700'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-coral-100 bg-coral-50/70 px-4 py-3 text-sm leading-6 text-gray-700">
            <p className="font-semibold text-gray-900">מה מופעל עכשיו?</p>
            <p className="mt-1">
              גודל טקסט: {settings.fontScale === 'base' ? 'רגיל' : settings.fontScale === 'large' ? 'גדול' : 'גדול מאוד'}
              {' · '}
              ניגודיות: {settings.contrast ? 'פעילה' : 'כבויה'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSettings(DEFAULT_STATE)}
            className="mt-4 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
          >
            איפוס התאמות
          </button>
        </div>
      ) : null}
    </div>
  )
}
