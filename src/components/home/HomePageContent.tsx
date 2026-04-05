'use client'

import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const HERO_FEATURES = [
  'עד 5 דמויות בספר אחד',
  'ספרים מותאמים אישית לרגעים משמעותיים',
  '12 עמודי תוכן ו-12 תמונות אישיות',
  'מוכן בתוך כמה דקות',
]

const BOOK_PRODUCT = {
  eyebrow: 'הסיפור המשפחתי שלך',
  title: 'ספר ילדים מותאם אישית',
  description:
    'אנחנו יוצרים ספרים מותאמים אישית לרגעים משמעותיים בחיים, עם תמיכה בעד 5 דמויות והמחשה שמרגישה קרובה באמת למשפחה שלכם.',
  features: [
    'תמיכה בעד 5 דמויות בספר אחד',
    'איורים מבוססי תמונה אמיתית',
    '12 עמודי תוכן ו-12 תמונות אישיות',
    'PDF לקריאה ולהדפסה',
  ],
  price: 'מ-₪129',
  cta: 'צרו ספר ילדים',
  href: '/create',
  image: '/1.png',
  imageAlt: 'ילדה בתוך ספר קסום',
}

const JOURNAL_PRODUCT = {
  badge: 'חדש',
  eyebrow: 'מוצר שגדל עם הילד',
  title: 'יומן העצמה המשפחתי',
  description: 'לא סיפור — תיעוד. שאלות שיח, משפטי כוח, רגעי גאווה וזיכרונות. מוצר שמשפחות שומרות שנים.',
  price: 'מ-₪199',
  cta: 'צרו יומן העצמה',
  href: '/create',
  image: '/2.png',
  imageAlt: 'ילדה גיבורת-על על עננים',
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
    description: 'כאן מוסיפים את הלב של הסיפור: המסר, הקשר המשפחתי והפרטים הקטנים שעושים את ההבדל.',
  },
  {
    title: 'מאשרים ומחכים כמה דקות',
    description: 'בתוך כמה דקות הספר מוכן — כתוב, מאויר ומוכן ל-PDF. אפשר לקרוא, להוריד ולעדכן.',
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

export default function HomePageContent() {
  return (
    <main className="min-h-dvh bg-[#FFF9F0] text-gray-900">

      {/* Hero — inverted dark */}
      <section className="bg-[linear-gradient(160deg,#1a1a2e_0%,#111120_100%)]">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-14 text-center md:px-8 md:pt-22 md:pb-18">
          <Badge variant="new" className="mb-6 border-white/15 bg-white/8 text-white/80">
            הסיפור המשפחתי שלך, כספר אישי בעברית
          </Badge>
          <h1 className="text-5xl font-black leading-[1.05] text-white md:text-7xl">
            הסיפור המשפחתי שלך,
            <br />
            כספר אישי.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            אנחנו תומכים בעד 5 דמויות ויוצרים ספרים מותאמים אישית לרגעים משמעותיים בחיים,
            כמו יום הולדת, אח חדש, היריון, התגברות, או כל רגע משפחתי שראוי להפוך לזיכרון.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {HERO_FEATURES.map((f) => (
              <span key={f} className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white/75">
                {f}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/create">
              <Button size="lg" className="sm:w-auto">
                צרו ספר ילדים
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                ראו איך זה עובד
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* מוצר ראשי */}
      <section id="products" className="border-b border-coral-100/80 bg-[linear-gradient(180deg,#FFF9F0_0%,#FFF4E6_100%)]">
        <div className="mx-auto max-w-7xl px-4 pt-0 pb-0 md:px-8">
          <article className="relative overflow-hidden rounded-t-[2rem] border border-b-0 border-coral-100 bg-[#FFF4E6] shadow-[0_-8px_40px_rgba(232,124,83,0.10)]">
            <div className="grid items-center md:grid-cols-2 md:[direction:ltr]">
              <div className="pointer-events-none order-2 flex select-none items-end justify-center px-6 pb-0 md:order-1">
                <Image
                  src={BOOK_PRODUCT.image}
                  alt={BOOK_PRODUCT.imageAlt}
                  width={600}
                  height={400}
                  className="h-auto w-full max-w-[30rem]"
                />
              </div>

              <div className="order-1 flex flex-col p-8 md:order-2 md:p-12 md:[direction:rtl]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-500">
                  {BOOK_PRODUCT.eyebrow}
                </p>
                <h2 className="mt-3 text-4xl font-black text-[#1a1a2e]">{BOOK_PRODUCT.title}</h2>
                <p className="mt-4 text-lg leading-8 text-gray-700">{BOOK_PRODUCT.description}</p>
                <ul className="mt-6 space-y-3">
                  {BOOK_PRODUCT.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center gap-5">
                  <p className="text-3xl font-black text-coral-700">{BOOK_PRODUCT.price}</p>
                  <Link href={BOOK_PRODUCT.href}>
                    <Button size="lg">{BOOK_PRODUCT.cta}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* איך זה עובד */}
      <section id="how-it-works" className="border-y border-coral-100 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">איך זה עובד</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">אתם מספרים — אנחנו בונים.</h2>
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

      {/* מידע ו-FAQ */}
      <section className="border-y border-coral-100 bg-[#fff4e7]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-16">
          <article className="rounded-[2rem] border border-white bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">כמה דברים שחשוב לדעת</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">אנחנו רוצים שתדעו בדיוק מה קורה עם המידע שלכם.</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-gray-600">
              <li>התמונות שאתם מעלים משמשות ליצירת הספר שלכם בלבד, ולא נשמרות או משותפות.</li>
              <li>הספר נשאר אצלכם — שמור בחשבון, נגיש בכל עת, ואפשר להוריד בכל רגע.</li>
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

      {/* יומן העצמה — נפרד, בתחתית */}
      <section id="journal" className="bg-[#FFF9F0]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">מוצר נוסף — לצד הספר</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">יומן העצמה המשפחתי</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
              לא סיפור — תיעוד. שאלות שיח, משפטי כוח, רגעי גאווה וזיכרונות. מוצר שמשפחות שומרות שנים.
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
              <p className="mt-2 text-sm leading-7 text-white/60">
                לא מתחרה על איורים, טקסט או מספר עמודים.
                <br />
                מתחרה על: חוויה משפחתית · ערך רגשי · תיעוד חיים · העצמה
              </p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">מה בפנים — 5 חלקים</p>
                <div className="mt-3 space-y-2">
                  {JOURNAL_CHAPTERS.map((ch) => (
                    <div key={ch.num} className="rounded-xl bg-white/[0.07] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-teal-400">{ch.num}</span>
                        <span className="text-sm font-bold text-white">{ch.title}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-5 text-white/50">{ch.items}</p>
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
                {JOURNAL_FOR.map((t) => (
                  <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                    {t}
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
            <div className="pointer-events-none select-none px-6 pb-2 md:flex md:items-end">
              <Image
                src={JOURNAL_PRODUCT.image}
                alt={JOURNAL_PRODUCT.imageAlt}
                width={600}
                height={400}
                className="h-auto w-full"
              />
            </div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a2e]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center md:px-8 md:py-20">
          <h2 className="text-3xl font-black text-white md:text-5xl">תנו לילד שלכם להיות הגיבור.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            כל ספר נוצר מאפס, בשביל ילד אחד. מתחילים בלי להתחבר, ממלאים בזמן שלכם, ומקבלים תוצאה שאפשר לתת
            כמתנה עוד היום.
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
