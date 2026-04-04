'use client'

import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'


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

const PRICING = [
  {
    title: 'קצר',
    price: '₪89',
    pages: '8-12 עמודים',
    bestFor: 'מתנה קלילה, סיפור לפני השינה או ספר ראשון.',
    details: '4-5 סצנות מרכזיות, קצב מהיר ותוצר שנעים לקרוא יחד.',
  },
  {
    title: 'בינוני',
    price: '₪129',
    pages: '16-20 עמודים',
    bestFor: 'המתאים לרוב ההזמנות — רוחב טוב, עומק טוב.',
    details: '6-8 סצנות עם יותר עומק רגשי ועלילה יותר מפותחת.',
    badge: 'הכי נבחר',
  },
  {
    title: 'ארוך',
    price: '₪159',
    pages: '24-32 עמודים',
    bestFor: 'כשרוצים חוויה מלאה ומתנה עשירה יותר.',
    details: '9-12 סצנות, יותר עולם, יותר רגעים, יותר עומק.',
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
    answer: 'ברוב המקרים הספר מוכן בתוך כ-3 עד 5 דקות, בהתאם לאורך שבחרתם.',
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
      <section className="border-b border-coral-100/80 bg-[radial-gradient(circle_at_top_left,rgba(232,124,83,0.13),transparent_40%),linear-gradient(180deg,#FFF9F0_0%,#FFF4E6_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-20">
          <div className="max-w-2xl">
            <Badge variant="popular" className="mb-4 border-amber-200 bg-amber-100/90">
              הילד שלכם — הגיבור של הסיפור
            </Badge>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] text-[#1a1a2e] md:text-6xl">
              ספר ילדים שהוא לא על ילד כלשהו — הוא על הילד שלכם.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-700 md:text-lg">
              אתם מספרים לנו מי הילד שלכם, מי האנשים שהוא אוהב, ומה הרגע המשפחתי שרוצים להנציח. אנחנו מחזירים ספר
              ילדים בעברית, עם איורים שמכירים את הפנים שלו, מוכן לקריאה ולמתנה.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/create">
                <Button size="lg" className="sm:w-auto">
                  צרו את הספר שלכם
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg" className="border-coral-400/90 bg-white/55 sm:w-auto">
                  ראו איך זה עובד
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-black text-coral-700">3-5</p>
                <p className="mt-1 text-sm text-gray-700">דקות, וספר שלם בידיים שלכם</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-black text-coral-700">אישי</p>
                <p className="mt-1 text-sm text-gray-700">כל ספר נכתב סביב הילד שלכם — השם, הפנים, הסיפור</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-black text-coral-700">מוכן</p>
                <p className="mt-1 text-sm text-gray-700">לקריאה ביחד, לשמור, ולתת במתנה</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/1.png"
              alt="ילדה בתוך ספר קסום"
              width={1536}
              height={1024}
              priority
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-coral-100 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-8 flex items-end gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">איך זה עובד</p>
              <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">רואים את הדרך מראש, לא מנחשים תוך כדי.</h2>
            </div>
            <div className="hidden md:block w-56 flex-shrink-0">
              <Image
                src="/2.png"
                alt="ילדה גיבורת-על על עננים"
                width={560}
                height={373}
                className="w-full h-auto object-contain object-right"
              />
            </div>
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

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">מחירים</p>
          <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">שלוש חבילות, עם ציפייה ברורה לכל אחת.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PRICING.map((plan) => (
            <article
              key={plan.title}
              className={`rounded-[2rem] border p-6 shadow-sm ${
                plan.badge ? 'border-coral-200 bg-coral-50 shadow-coral-100/70' : 'border-white bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-black text-gray-900">{plan.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{plan.pages}</p>
                </div>
                {plan.badge ? <Badge variant="popular">{plan.badge}</Badge> : null}
              </div>
              <p className="mt-4 text-4xl font-black text-coral-700">{plan.price}</p>
              <p className="mt-4 text-sm font-semibold text-gray-900">מתאים ל: {plan.bestFor}</p>
              <p className="mt-2 text-sm leading-7 text-gray-600">{plan.details}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="rounded-full bg-white/80 px-3 py-1">ספר בעברית מלאה</span>
                <span className="rounded-full bg-white/80 px-3 py-1">PDF להורדה</span>
                <span className="rounded-full bg-white/80 px-3 py-1">עריכות בסיסיות</span>
              </div>
            </article>
          ))}
        </div>
      </section>

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

      <section className="bg-[#1a1a2e]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center md:px-8 md:py-20">
          <h2 className="text-3xl font-black text-white md:text-5xl">תנו לילד שלכם להיות הגיבור.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            כל ספר נוצר מאפס, בשביל ילד אחד. מתחילים בלי להתחבר, ממלאים בזמן שלכם, ומקבלים תוצאה שאפשר לתת כמתנה
            עוד היום.
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
