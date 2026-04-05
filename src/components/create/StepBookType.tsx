'use client'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CreateShell from '@/components/create/CreateShell'
import { useCreateBookStore } from '@/store/createBookStore'
import { BookTemplate } from '@/types'
import { BOOK_CATEGORIES } from '@/lib/bookTemplates'
import { cn } from '@/lib/utils'

export default function StepBookType() {
  const { nextStep, params, setTemplate } = useCreateBookStore()

  const handleSelect = (id: BookTemplate) => {
    setTemplate(id)
    nextStep()
  }

  // הפרדה: ספרי ילדים רגילים vs יומן העצמה
  const bookCategories = BOOK_CATEGORIES.filter((c) => c.id !== 'journal')
  const journalCategory = BOOK_CATEGORIES.find((c) => c.id === 'journal')

  return (
    <CreateShell step={1} badge="בחירה מתוך קטלוג">
      <div className="space-y-10">

        {/* ספרי ילדים — קטגוריות */}
        {bookCategories.map((category) => (
          <section key={category.id}>

            {/* כותרת קטגוריה */}
            <div className="mb-4 flex flex-col gap-1 rounded-[1.5rem] border border-black/5 bg-white px-4 py-4 shadow-sm sm:px-5">
              <p className="text-lg font-black text-[#161625]">{category.label}</p>
              <p className="text-sm leading-6 text-gray-500">{category.hint}</p>
            </div>

            {/* כרטיסי תבניות */}
            <div className="grid gap-3 xl:grid-cols-2">
              {category.templates.map((template) => {
                const selected = params.template === template.id

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelect(template.id)}
                    className={cn(
                      'group relative overflow-hidden rounded-[2rem] border p-4 text-right transition-all sm:p-5',
                      selected
                        ? 'border-coral-300 bg-[linear-gradient(160deg,#fff8f1_0%,#fde7dd_100%)] shadow-[0_22px_45px_rgba(232,124,83,0.14)]'
                        : 'border-black/5 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(23,25,37,0.09)]'
                    )}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#e87c53_0%,#ffb347_100%)] opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-black text-[#161625]">{template.title}</h2>
                          {template.badge ? (
                            <Badge variant={template.badge === 'חדש' ? 'new' : 'popular'}>
                              {template.badge}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="max-w-sm text-sm leading-6 text-gray-600">{template.desc}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-semibold text-coral-700">
                        {template.price}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-[#FFF9F0] px-3 py-1">סיפור אישי</span>
                        <span className="rounded-full bg-[#FFF9F0] px-3 py-1">עברית מלאה</span>
                        <span className="rounded-full bg-[#FFF9F0] px-3 py-1">24 עמודים</span>
                      </div>
                      <span className="text-sm font-semibold text-coral-700">בחרו והמשיכו ←</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ))}

        {/* יומן העצמה — נפרד */}
        {journalCategory ? (
          <section>
            <div className="mb-4 flex flex-col gap-1 rounded-[1.5rem] border border-[#1a1a2e]/10 bg-[#1a1a2e] px-5 py-4 shadow-sm">
              <p className="text-lg font-black text-teal-300">{journalCategory.label}</p>
              <p className="text-sm leading-6 text-white/60">{journalCategory.hint}</p>
            </div>

            <div className="grid gap-3">
              {journalCategory.templates.map((template) => {
                const selected = params.template === template.id

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelect(template.id)}
                    className={cn(
                      'group relative overflow-hidden rounded-[2rem] border p-5 text-right transition-all',
                      selected
                        ? 'border-teal-400 bg-[#1a1a2e] shadow-[0_22px_45px_rgba(26,26,46,0.22)]'
                        : 'border-[#1a1a2e]/10 bg-[#1a1a2e]/5 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(26,26,46,0.12)]'
                    )}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-teal-400 opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className={cn('text-xl font-black', selected ? 'text-white' : 'text-[#1a1a2e]')}>
                            {template.title}
                          </h2>
                          {template.badge ? (
                            <Badge variant="new">{template.badge}</Badge>
                          ) : null}
                        </div>
                        <p className={cn('max-w-sm text-sm leading-6', selected ? 'text-white/70' : 'text-gray-600')}>
                          {template.desc}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-teal-400/20 px-3 py-1 text-xs font-semibold text-teal-700">
                        {template.price}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">שאלות לשיח</span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">משפטי חיזוק</span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">עמודי זיכרון</span>
                      </div>
                      <span className={cn('text-sm font-semibold', selected ? 'text-teal-300' : 'text-teal-700')}>
                        בחרו והמשיכו ←
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ) : null}

      </div>

      {/* כפתור המשך — מופיע רק אחרי בחירה */}
      <div className="lg:min-w-[18rem]">
        <Button
          size="lg"
          onClick={() => params.template && nextStep()}
          disabled={!params.template}
          className="w-full lg:min-w-[18rem]"
        >
          המשיכו לפרטי הספר
        </Button>
      </div>
    </CreateShell>
  )
}
