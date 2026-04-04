'use client'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CreateShell from '@/components/create/CreateShell'
import { useCreateBookStore } from '@/store/createBookStore'
import { BookTemplate } from '@/types'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type TemplateItem = {
  id: BookTemplate
  title: string
  desc: string
  price: string
  badge?: string
}

const CATEGORIES: { label: string; hint: string; templates: TemplateItem[] }[] = [
  {
    label: 'הכי מבוקשים',
    hint: 'ספרים שמתאימים לרגעים גדולים במשפחה',
    templates: [
      { id: 'birthday_child', title: 'יום הולדת', desc: 'ספר חגיגי שבו הילד או הילדה הם גיבורי הסיפור.', price: 'החל מ־₪89', badge: 'הכי אהוב' },
      { id: 'new_sibling', title: 'אח או אחות חדשים', desc: 'מעבר עדין ושמח שמחבר בין כל בני הבית.', price: 'החל מ־₪89' },
      { id: 'emotional_journal', title: 'יומן רגשי משפחתי', desc: 'ספר אישי שמספר על הקשר, השגרה והלב של הבית.', price: 'החל מ־₪99', badge: 'חדש' },
      { id: 'self_confidence', title: 'ביטחון עצמי', desc: 'סיפור שמדגיש כוחות, מסוגלות והצלחות קטנות.', price: 'החל מ־₪89' },
    ],
  },
  {
    label: 'מעברים וגדילה',
    hint: 'לרגעים שדורשים תיווך, הכנה והרגעה',
    templates: [
      { id: 'first_day_school', title: 'יום ראשון בגן או בבית הספר', desc: 'הכנה רגועה ליום חדש עם צוות, חברים וסקרנות.', price: 'החל מ־₪89' },
      { id: 'potty_training', title: 'גמילה מחיתולים', desc: 'ספר שנותן תחושת מסוגלות וחגיגה סביב השינוי.', price: 'החל מ־₪89' },
      { id: 'goodbye_pacifier', title: 'נפרדים מהמוצץ', desc: 'סיפור רך שמייצר טקס פרידה חיובי וברור.', price: 'החל מ־₪89' },
      { id: 'first_haircut', title: 'תספורת ראשונה', desc: 'מעבר קטן שמרגיש גדול, עם הרבה ביטחון בדרך.', price: 'החל מ־₪89' },
      { id: 'lost_tooth', title: 'השן הראשונה', desc: 'ספר שובב על שינוי חדש, סקרנות וחיוך רחב.', price: 'החל מ־₪89' },
    ],
  },
  {
    label: 'משפחה וקשר',
    hint: 'ספרים שמייצרים קרבה, שייכות וזיכרון',
    templates: [
      { id: 'family_love', title: 'ספר אהבה משפחתי', desc: 'מתנה אישית ומרגשת לכל המשפחה, בעברית מלאה.', price: 'החל מ־₪99' },
      { id: 'new_pet', title: 'חיית מחמד חדשה', desc: 'חיבור בין ילד, אחריות והרפתקה קטנה בבית.', price: 'החל מ־₪89' },
      { id: 'two_homes', title: 'שני בתים', desc: 'סיפור שמחבר בין שגרות שונות ותחושת ביטחון רציפה.', price: 'החל מ־₪89' },
    ],
  },
  {
    label: 'אומץ והרפתקה',
    hint: 'כשצריך יותר ביטחון, דמיון ותחושת ניצחון',
    templates: [
      { id: 'fear_of_dark', title: 'פחד מהחושך', desc: 'סיפור מעודד שמחליף פחד בסקרנות ובשליטה.', price: 'החל מ־₪89' },
      { id: 'independence_day', title: 'יום העצמאות', desc: 'סיפור ישראלי חגיגי עם תחושת גאווה ושייכות.', price: 'החל מ־₪89' },
    ],
  },
]

export default function StepBookType() {
  const { nextStep, params, setTemplate } = useCreateBookStore()
  const [activeCategory, setActiveCategory] = useState(0)

  const handleSelect = (id: BookTemplate) => {
    setTemplate(id)
    nextStep()
  }

  return (
    <CreateShell step={1} badge="בחירה מתוך קטלוג">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category, index) => (
            <button
              key={category.label}
              type="button"
              onClick={() => setActiveCategory(index)}
              className={cn(
                'rounded-full px-4 py-2.5 text-sm font-semibold transition-all',
                activeCategory === index
                  ? 'bg-[#171925] text-white shadow-[0_12px_25px_rgba(23,25,37,0.25)]'
                  : 'bg-white text-gray-600 ring-1 ring-black/8 hover:text-coral-700'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        <section className="rounded-[2rem] border border-black/5 bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-lg font-black text-[#161625]">{CATEGORIES[activeCategory].label}</p>
              <p className="mt-1 text-sm leading-7 text-gray-500">{CATEGORIES[activeCategory].hint}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-[#FFF9F0] px-3 py-1">עברית מלאה</span>
              <span className="rounded-full bg-[#FFF9F0] px-3 py-1">PDF דיגיטלי</span>
              <span className="rounded-full bg-[#FFF9F0] px-3 py-1">מוכן להדפסה</span>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          {CATEGORIES[activeCategory].templates.map((template) => {
            const selected = params.template === template.id

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelect(template.id)}
                className={cn(
                  'group relative overflow-hidden rounded-[2.2rem] border p-6 text-right transition-all',
                  selected
                    ? 'border-coral-300 bg-[linear-gradient(160deg,#fff8f1_0%,#fde7dd_100%)] shadow-[0_22px_45px_rgba(232,124,83,0.14)]'
                    : 'border-black/5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-[0_26px_45px_rgba(23,25,37,0.10)]'
                )}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#e87c53_0%,#ffb347_100%)] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black text-[#161625]">{template.title}</h2>
                      {template.badge ? <Badge variant={template.badge === 'חדש' ? 'new' : 'popular'}>{template.badge}</Badge> : null}
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-gray-600">{template.desc}</p>
                  </div>
                  <span className="rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-semibold text-coral-700">
                    {template.price}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-[#FFF9F0] px-3 py-1">סיפור אישי</span>
                    <span className="rounded-full bg-[#FFF9F0] px-3 py-1">תהליך מודרך</span>
                    <span className="rounded-full bg-[#FFF9F0] px-3 py-1">מתאים למשפחה</span>
                  </div>
                  <span className="text-sm font-semibold text-coral-700">בחרו והמשיכו</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="lg:min-w-[18rem]">
        <Button size="lg" onClick={() => params.template && nextStep()} disabled={!params.template} className="w-full lg:min-w-[18rem]">
          המשיכו לפרטי הספר
        </Button>
      </div>
    </CreateShell>
  )
}
