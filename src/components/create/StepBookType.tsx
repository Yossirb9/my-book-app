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

  return (
    <CreateShell step={1} badge="בחירה מתוך קטלוג">
      <div className="space-y-10">

        {BOOK_CATEGORIES.map((category) => (
          <section key={category.id}>

            {/* כותרת קטגוריה */}
            <div className="mb-4 flex flex-col gap-1 rounded-[1.5rem] border border-black/5 bg-white px-5 py-4 shadow-sm">
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
                      'group relative overflow-hidden rounded-[2rem] border p-5 text-right transition-all',
                      selected
                        ? 'border-coral-300 bg-[linear-gradient(160deg,#fff8f1_0%,#fde7dd_100%)] shadow-[0_22px_45px_rgba(232,124,83,0.14)]'
                        : 'border-black/5 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(23,25,37,0.09)]'
                    )}
                  >
                    {/* פס עליון בהover */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#e87c53_0%,#ffb347_100%)] opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-4">
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

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-[#FFF9F0] px-3 py-1">סיפור אישי</span>
                        <span className="rounded-full bg-[#FFF9F0] px-3 py-1">עברית מלאה</span>
                        <span className="rounded-full bg-[#FFF9F0] px-3 py-1">PDF דיגיטלי</span>
                      </div>
                      <span className="text-sm font-semibold text-coral-700">בחרו והמשיכו ←</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ))}

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
