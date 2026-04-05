'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { BOOK_CATEGORIES } from '@/lib/bookTemplates'

const HERO_FEATURES = [
  'עד 5 דמויות בספר אחד',
  'ספרים מותאמים אישית לרגעים משמעותיים',
  '12 עמודי תוכן ו-12 תמונות אישיות',
  'מוכן בתוך כמה דקות',
]

const BOOK_PRODUCT = {
  price: 'מ-129₪',
  image: '/1.png',
  imageAlt: 'ילדה בתוך ספר קסום',
}

const JOURNAL_PRODUCT = {
  badge: 'חדש',
  eyebrow: 'מוצר שגדל עם הילד',
  title: 'יומן ההעצמה המשפחתי',
  description:
    'לא סיפור אלא תיעוד. שאלות שיח, משפטי כוח, רגעי גאווה וזיכרונות. מוצר שמשפחות שומרות שנים.',
  price: 'מ-199₪',
  cta: 'צרו יומן העצמה',
  href: '/create?template=emotional_journal',
  image: '/2.png',
  imageAlt: 'ילדה גיבורת על על עננים',
}

const JOURNAL_CHAPTERS = [
  {
    num: '01',
    title: 'מי אני',
    items: 'השם שלי · הדברים שאני אוהב/ת · מה מיוחד בי · האנשים שלי · מה משמח אותי',
  },
  {
    num: '02',
    title: 'רגעים של גדילה',
    items: 'משהו שהצלחתי · רגע שהייתי אמיץ/ה · משהו חדש שלמדתי · רגע שהתאכזבתי ולמדתי ממנו',
  },
  {
    num: '03',
    title: 'שיחות עם אמא/אבא',
    items: 'ממה אני גאה בעצמי · מה ההורה אוהב בי · זיכרון אהוב שלנו · מתי הרגשתי אהוב/ה',
  },
  {
    num: '04',
    title: 'תמונות ורגעים',
    items: 'עמודי תמונות עם כיתובים אישיים · "זה היה יום חשוב כי..." · "כאן ממש צחקתי"',
  },
  {
    num: '05',
    title: 'העתיד שלי',
    items: 'חלום שלי · משהו שאני רוצה ללמוד · מה אני מאחל/ת לעצמי',
  },
]

const JOURNAL_FOR = ['יום הולדת', 'סוף שנה', 'לפני כיתה א׳', 'לידת אח/ות', 'מתנה מסבא/סבתא', 'שנה משמעותית']

const HOW_IT_WORKS = [
  {
    title: 'בוחרים נושא',
    description: 'מתחילים מתבנית ספר שמתאימה לרגע המשפחתי: יום הולדת, אח חדש, פחד מהחושך ועוד.',
  },
  {
    title: 'מוסיפים דמויות ותמונה אחת לכל דמות',
    description: 'שם, תפקיד ותמונה ברורה אחת הם כל מה שצריך כדי שהאיור ירגיש אישי ואמין.',
  },
  {
    title: 'מוסיפים את הפרטים שעושים את ההבדל',
    description: 'כאן מוסיפים את הלב של הסיפור: המסר, הקשר המשפחתי והפרטים הקטנים שהופכים את הכל לאישי.',
  },
  {
    title: 'מאשרים ומחכים כמה דקות',
    description: 'בתוך כמה דקות הספר מוכן, כתוב, מאויר ומוכן ל-PDF. אפשר לקרוא, להוריד ולעדכן.',
  },
]

const FAQ = [
  {
    question: 'האם חייבים להתחבר לפני שמתחילים?',
    answer:
      'לא. אפשר למלא את כל שלבי היצירה, ורק לפני ההתחלה בפועל נבקש להתחבר כדי לשמור את הספר על החשבון שלכם.',
  },
  {
    question: 'כמה תמונות צריך להעלות?',
    answer: 'כרגע תמונה ברורה אחת לכל דמות מספיקה. עדיף פנים גלויות ותאורה טובה.',
  },
  {
    question: 'כמה זמן לוקח עד שהספר מוכן?',
    answer: 'ברוב המקרים הספר מוכן בתוך כ-3 עד 5 דקות, בהתאם לנושא ולפרטים שמילאתם.',
  },
  {
    question: 'מה קורה עם התמונות שאנחנו מעלים?',
    answer:
      'התמונות משמשות רק ליצירת הספר האישי שלכם. אנחנו מציגים את זה כבר בתהליך כדי להוריד אי-ודאות ולחזק אמון.',
  },
]

const CATEGORY_STYLES: Record<
  string,
  {
    accent: string
    chip: string
    button: string
    poster: string
    glow: string
  }
> = {
  popular: {
    accent: 'text-coral-600',
    chip: 'bg-coral-50 text-coral-700',
    button: 'bg-coral-500 text-white hover:bg-coral-400',
    poster: 'bg-[linear-gradient(135deg,#fff5ea_0%,#ffc89f_48%,#e87c53_100%)]',
    glow: 'shadow-[0_24px_45px_rgba(232,124,83,0.24)]',
  },
  transitions: {
    accent: 'text-amber-700',
    chip: 'bg-amber-50 text-amber-700',
    button: 'bg-amber-500 text-white hover:bg-amber-400',
    poster: 'bg-[linear-gradient(135deg,#fffdf1_0%,#ffe59a_45%,#dba12f_100%)]',
    glow: 'shadow-[0_24px_45px_rgba(219,161,47,0.24)]',
  },
  family: {
    accent: 'text-rose-700',
    chip: 'bg-rose-50 text-rose-700',
    button: 'bg-rose-500 text-white hover:bg-rose-400',
    poster: 'bg-[linear-gradient(135deg,#fff8fb_0%,#ffd5df_42%,#f08aa0_100%)]',
    glow: 'shadow-[0_24px_45px_rgba(240,138,160,0.24)]',
  },
  adventure: {
    accent: 'text-sky-700',
    chip: 'bg-sky-50 text-sky-700',
    button: 'bg-sky-500 text-white hover:bg-sky-400',
    poster: 'bg-[linear-gradient(135deg,#eef7ff_0%,#a8dbff_44%,#4ca7df_100%)]',
    glow: 'shadow-[0_24px_45px_rgba(76,167,223,0.24)]',
  },
  resilience: {
    accent: 'text-emerald-700',
    chip: 'bg-emerald-50 text-emerald-700',
    button: 'bg-emerald-500 text-white hover:bg-emerald-400',
    poster: 'bg-[linear-gradient(135deg,#f2fff9_0%,#bdf2d1_45%,#46b987_100%)]',
    glow: 'shadow-[0_24px_45px_rgba(70,185,135,0.24)]',
  },
  journal: {
    accent: 'text-teal-700',
    chip: 'bg-teal-50 text-teal-700',
    button: 'bg-teal-500 text-white hover:bg-teal-400',
    poster: 'bg-[linear-gradient(135deg,#f4fffd_0%,#b7f2e6_45%,#1fc6a4_100%)]',
    glow: 'shadow-[0_24px_45px_rgba(31,198,164,0.24)]',
  },
}

function buildTemplateHref(templateId: string) {
  return `/create?template=${encodeURIComponent(templateId)}`
}

export default function HomePageContent() {
  return (
    <main className="min-h-dvh bg-[#FFF9F0] text-gray-900">
      <section className="bg-[linear-gradient(160deg,#1a1a2e_0%,#111120_100%)]">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 md:px-8 md:pb-18 md:pt-22">
          <div className="grid items-center gap-8 md:grid-cols-2 md:[direction:ltr]">
            <div className="min-w-0 text-center md:[direction:rtl] md:text-right">
              <h1 className="text-[clamp(2.2rem,8.4vw,5.4rem)] font-black leading-[1.02] text-white md:whitespace-nowrap">
                הסיפור המשפחתי שלך כספר אישי.
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/70 md:mx-0 md:text-lg">
                אנחנו תומכים בעד 5 דמויות ויוצרים ספרים מותאמים אישית לרגעים משמעותיים בחיים,
                כמו יום הולדת, אח חדש, היריון, התגברות, או כל רגע משפחתי שראוי להפוך לזיכרון.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                {HERO_FEATURES.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium text-white/75 sm:text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 md:items-start">
                <p className="text-3xl font-black text-coral-300">{BOOK_PRODUCT.price}</p>
                <div className="flex flex-col items-center gap-4 sm:flex-row md:items-center">
                  <Link href="/create">
                    <Button size="lg" className="sm:w-auto">
                      צרו ספר
                    </Button>
                  </Link>
                  <Link href="/#how-it-works">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                    >
                      ראו איך זה עובד
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="pointer-events-none flex select-none items-end justify-center">
              <Image
                src={BOOK_PRODUCT.image}
                alt={BOOK_PRODUCT.imageAlt}
                width={700}
                height={520}
                className="h-auto w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[33rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-coral-100 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">איך זה עובד</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">אתם מספרים, אנחנו בונים.</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">מגדירים, מוסיפים תמונות, ומחכים כמה דקות.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {HOW_IT_WORKS.map((step, index) => (
              <article key={step.title} className="rounded-[1.9rem] border border-coral-100 bg-[#FFF9F0] p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-500 text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-black text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-coral-100 bg-[#fff8f0]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">קטגוריות הספרים</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">כל הקטגוריות של המערכת, כמו מדף בחירה חי.</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              גוללים בין השורות, בוחרים את הסיפור שמתאים לרגע שלכם, ומתחילים ישר מהתבנית שבחרתם בלי לצאת מהעמוד.
            </p>
          </div>

          <div className="space-y-10">
            {BOOK_CATEGORIES.map((category) => {
              const style = CATEGORY_STYLES[category.id] || CATEGORY_STYLES.popular
              const firstTemplate = category.templates[0]

              return (
                <article key={category.id}>
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${style.accent}`}>
                        {category.label}
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-[#1a1a2e]">{category.hint}</h3>
                    </div>
                    <Link href={buildTemplateHref(firstTemplate.id)} className="w-full sm:w-auto">
                      <Button size="sm" className={`w-full sm:w-auto ${style.button}`}>
                        התחילו מהקטגוריה
                      </Button>
                    </Link>
                  </div>

                  <div className="-mx-4 overflow-x-auto px-4 pb-3 no-scrollbar">
                    <div className="flex w-max gap-4">
                    {category.templates.map((template) => (
                      <Link
                        key={`${category.id}-${template.id}`}
                        href={buildTemplateHref(template.id)}
                          className={`group relative flex min-h-[17rem] w-[17rem] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[1.8rem] p-5 text-right text-white transition duration-300 hover:-translate-y-1 hover:scale-[1.02] sm:w-[19rem] ${style.poster} ${style.glow}`}
                      >
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(26,26,46,0.08)_32%,rgba(26,26,46,0.8)_100%)]" />
                          <div className="absolute inset-y-0 left-0 w-24 bg-[radial-gradient(circle_at_left,rgba(255,255,255,0.28),transparent_68%)] opacity-80 transition-opacity group-hover:opacity-100" />
                          <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,transparent_100%)]" />

                          <div className="relative flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">{category.label}</p>
                              <p className="mt-3 text-[1.7rem] font-black leading-[1.05] drop-shadow-[0_8px_18px_rgba(17,17,32,0.22)]">
                                {template.title}
                              </p>
                            </div>
                            {template.badge ? (
                              <span className="shrink-0 rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                                {template.badge}
                              </span>
                            ) : null}
                          </div>

                          <div className="relative mt-8">
                            <p className="max-w-[15rem] text-sm leading-6 text-white/80">
                              {template.desc}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold text-white/88 backdrop-blur-sm">
                                {template.price}
                              </span>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${style.chip}`}>
                                מותאם אישית
                              </span>
                            </div>
                          </div>

                          <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/18 pt-4">
                            <span className="text-sm font-semibold text-white/78">בחרו והתחילו</span>
                            <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm transition group-hover:bg-white/24">
                              צרו ספר
                            </span>
                          </div>
                      </Link>
                    ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-coral-100 bg-[#fff4e7]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-16">
          <article className="rounded-[2rem] border border-white bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">כמה דברים שחשוב לדעת</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">אנחנו רוצים שתדעו בדיוק מה קורה עם המידע שלכם.</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-gray-600">
              <li>התמונות שאתם מעלים משמשות ליצירת הספר שלכם בלבד, ולא נשמרות או משותפות.</li>
              <li>הספר נשאר אצלכם, שמור בחשבון, נגיש בכל עת, ואפשר להוריד בכל רגע.</li>
              <li>אם משהו לא יצא כמו שציפיתם, יש אפשרות לעדכן ולהפיק מחדש.</li>
            </ul>
          </article>

          <div id="faq" className="space-y-4">
            {FAQ.map((item) => (
              <article key={item.question} className="rounded-[2rem] border border-white bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-gray-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="journal" className="bg-[#FFF9F0]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">מוצר נוסף, לצד הספר</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">יומן ההעצמה המשפחתי</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
              לא סיפור אלא תיעוד. שאלות שיח, משפטי כוח, רגעי גאווה וזיכרונות. מוצר שמשפחות שומרות שנים.
            </p>
          </div>

          <article className="relative overflow-hidden rounded-[2rem] bg-[#1a1a2e] md:grid md:grid-cols-2">
            <div className="flex flex-1 flex-col p-8 md:p-12">
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
                  {JOURNAL_PRODUCT.eyebrow}
                </p>
                <span className="rounded-full bg-teal-400 px-2.5 py-0.5 text-xs font-black text-[#1a1a2e]">
                  {JOURNAL_PRODUCT.badge}
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-black text-white">{JOURNAL_PRODUCT.title}</h3>
              <p className="mt-2 text-sm leading-7 text-white/60">חוויה משפחתית · ערך רגשי · תיעוד חיים · העצמה</p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">מה בפנים, 5 חלקים</p>
                <div className="mt-3 space-y-2">
                  {JOURNAL_CHAPTERS.map((chapter) => (
                    <div key={chapter.num} className="rounded-xl bg-white/[0.07] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-teal-400">{chapter.num}</span>
                        <span className="text-sm font-bold text-white">{chapter.title}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-5 text-white/50">{chapter.items}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-teal-400/20 bg-teal-400/10 px-4 py-3">
                <p className="text-xs leading-6 text-teal-300">
                  40–60 עמודים · חלקם מוכנים מראש, חלקם למילוי, חלקם לתמונות ושיחות
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {JOURNAL_FOR.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-2xl font-black text-teal-300">{JOURNAL_PRODUCT.price}</p>
                <Link href={JOURNAL_PRODUCT.href}>
                  <Button size="lg" className="bg-teal-400 text-[#1a1a2e] hover:bg-teal-300">
                    {JOURNAL_PRODUCT.cta}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="pointer-events-none flex select-none items-center justify-center px-4 py-6 md:px-8 md:py-8">
              <Image
                src={JOURNAL_PRODUCT.image}
                alt={JOURNAL_PRODUCT.imageAlt}
                width={600}
                height={400}
                className="h-auto w-full max-w-[28rem] md:max-w-[38rem]"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#1a1a2e]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center md:px-8 md:py-20">
          <h2 className="text-3xl font-black text-white md:text-5xl">תנו לילד שלכם להיות הגיבור.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            כל ספר נוצר מאפס. מתחילים בלי להתחבר, ממלאים בזמן שלכם, ומקבלים תוצאה שאפשר לתת כמתנה עוד היום.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/create">
              <Button size="lg" className="sm:w-auto">
                צרו את הספר עכשיו
              </Button>
            </Link>
            <Link href="/#faq">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 sm:w-auto"
              >
                שאלות נפוצות
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
