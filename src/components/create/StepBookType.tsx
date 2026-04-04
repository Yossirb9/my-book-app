'use client'

import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { StepProgress } from '@/components/ui/StepProgress'
import { useCreateBookStore } from '@/store/createBookStore'
import { BookTemplate } from '@/types'
import { useState } from 'react'

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
    <div className="flex min-h-dvh flex-col">
      <div className="flex items-start justify-between gap-4 px-4 pt-7 pb-5 md:px-6">
        <Link href="/" className="pt-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800">
          חזרה
        </Link>
        <StepProgress currentStep={1} />
        <div className="w-12" />
      </div>

      <div className="px-4 pb-4 md:px-6">
        <Badge variant="new" className="mb-3">
          בוחרים כיוון וממשיכים הלאה
        </Badge>
        <h1 className="text-2xl font-black text-gray-900 md:text-3xl">איזה ספר תרצו ליצור?</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
          מתחילים בבחירת רעיון. בהמשך נוסיף דמויות, התאמה אישית ותצוגת אישור לפני שהספר יוצא ליצירה.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 md:px-6">
        {CATEGORIES.map((category, index) => (
          <button
            key={category.label}
            type="button"
            onClick={() => setActiveCategory(index)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeCategory === index
                ? 'bg-coral-500 text-white shadow-md shadow-coral-200'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:text-coral-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-24 md:px-6">
        <div className="mb-4 rounded-[2rem] bg-white/80 p-4 ring-1 ring-white shadow-sm">
          <p className="text-sm font-semibold text-gray-900">{CATEGORIES[activeCategory].label}</p>
          <p className="mt-1 text-sm text-gray-500">{CATEGORIES[activeCategory].hint}</p>
        </div>

        <div className="grid gap-3">
          {CATEGORIES[activeCategory].templates.map((template) => {
            const selected = params.template === template.id

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelect(template.id)}
                className={`rounded-[2rem] border-2 p-5 text-right transition-all ${
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-lg shadow-coral-100'
                    : 'border-white bg-white shadow-sm hover:border-coral-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">{template.title}</h2>
                      {template.badge ? <Badge variant={template.badge === 'חדש' ? 'new' : 'popular'}>{template.badge}</Badge> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{template.desc}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-coral-700">
                    {template.price}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="rounded-full bg-[#FFF9F0] px-3 py-1">PDF דיגיטלי</span>
                  <span className="rounded-full bg-[#FFF9F0] px-3 py-1">הדפסה ביתית</span>
                  <span className="rounded-full bg-[#FFF9F0] px-3 py-1">עברית מלאה</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-auto border-t border-white/80 bg-white/70 px-4 py-4 text-sm text-gray-500 backdrop-blur md:px-6">
        כל בחירה כאן היא רק התחלה. אפשר לחזור אחורה, לשנות תבנית ולחדד את הספר לפני האישור הסופי.
      </div>
    </div>
  )
}
