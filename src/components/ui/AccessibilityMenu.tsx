'use client'

import { useEffect, useMemo, useState } from 'react'
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

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-full border border-coral-200 bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-[0_12px_30px_rgba(26,26,46,0.12)] transition hover:border-coral-400 hover:text-coral-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
      >
        נגישות
      </button>

      {isOpen ? (
        <div
          id="accessibility-menu"
          role="dialog"
          aria-label="תפריט נגישות"
          className="mt-3 w-[min(92vw,320px)] rounded-[1.6rem] border border-coral-100 bg-white p-4 shadow-[0_18px_44px_rgba(26,26,46,0.14)]"
        >
          <p className="text-base font-black text-gray-900">התאמות נגישות</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            התפריט מאפשר התאמות תצוגה ונועד לסייע לעמידה בהנחיות נגישות מקובלות, כולל ניווט מקלדת,
            ניגודיות, טקסט קריא והפחתת תנועה.
          </p>

          <div className="mt-4 grid gap-2">
            {actions.map((action) => (
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
