import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'ספרי ילדים אישיים עם AI',
  description:
    'ספרי ילדים מותאמים אישית בעברית עם דמויות אמיתיות, תהליך יצירה מודרך, תצוגת אישור לפני יצירה ו-PDF להורדה.',
})

const HIGHLIGHTS = [
  {
    title: 'הדמויות שלכם נשארות במרכז',
    description: 'מעלים תמונה אחת טובה לכל דמות, והספר נבנה סביב האנשים האמיתיים של המשפחה.',
  },
  {
    title: 'מבינים מה מקבלים לפני שמתחילים יצירה',
    description: 'המערכת מציגה סיכום ברור, זמן יצירה משוער ומה כלול, עוד לפני שהספר יוצא לדרך.',
  },
]

const FEATURES = [
  'ספר ילדים אישי בעברית מלאה',
  'PDF דיגיטלי וקובץ נוח להדפסה',
  'תהליך יצירה מודרך שלב אחר שלב',
  'עריכות בסיסיות לאחר היצירה',
]

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
    title: 'מגדירים טון, מסר ופרטים אישיים',
    description: 'כאן מוסיפים את הלב של הסיפור: המסר, הקשר המשפחתי והפרטים הקטנים שעושים את ההבדל.',
  },
  {
    title: 'מאשרים ומחכים כמה דקות',
    description: 'המערכת כותבת, מאיירת ומכינה PDF. אחר כך אפשר לקרוא, להוריד ולבצע עריכות בסיסיות.',
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
    bestFor: 'הבחירה המאוזנת לרוב המשפחות.',
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

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[#FFF9F0] text-gray-900">
      <section className="relative overflow-hidden border-b border-coral-100/80 bg-[radial-gradient(circle_at_top_right,_rgba(232,124,83,0.16),_transparent_32%),linear-gradient(180deg,#fffaf3_0%,#fff4e6_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-20">
          <div className="max-w-2xl">
            <Badge variant="popular" className="mb-4">
              ספר ילדים אישי בעברית עם תהליך ברור מקצה לקצה
            </Badge>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] text-[#1a1a2e] md:text-6xl">
              ספר שמרגיש כמו מתנה אמיתית, ולא כמו עוד גימיק.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
              מעלים דמויות אמיתיות, בוחרים נושא, מגדירים מסר, ומקבלים ספר ילדים אישי בעברית עם PDF מוכן לקריאה ולהורדה.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/create">
                <Button size="lg" className="sm:w-auto">
                  צרו את הספר שלכם
                </Button>
              </Link>
              <Link href="/#sample-preview">
                <Button variant="outline" size="lg" className="sm:w-auto">
                  ראו ספר לדוגמה
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/90 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-black text-coral-700">3-5</p>
                <p className="mt-1 text-sm text-gray-600">דקות ליצירה ממוצעת</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/90 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-black text-coral-700">עברית</p>
                <p className="mt-1 text-sm text-gray-600">טקסט, UI וזרימה מלאה בעברית</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/90 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-black text-coral-700">PDF</p>
                <p className="mt-1 text-sm text-gray-600">קריאה במסך וקובץ נוח להדפסה</p>
              </div>
            </div>
          </div>

          <div id="sample-preview" className="grid gap-4">
            <div className="rounded-[2.25rem] border border-[#f0d7c5] bg-[#1a1a2e] p-5 text-white shadow-[0_30px_70px_rgba(26,26,46,0.18)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-200">ספר לדוגמה</p>
                  <h2 className="mt-2 text-2xl font-black">הספר של נועה</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  תצוגה פתוחה
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <article className="rounded-[1.75rem] bg-[#fffaf3] p-4 text-right text-gray-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral-600">עמוד פתיחה</p>
                  <h3 className="mt-3 text-lg font-black leading-8">נועה הרגישה שהיום הזה הולך להיות שונה.</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    היום שבו האח הקטן מגיע הביתה. יש התרגשות, קצת בלבול, והמון מקום ללב גדול.
                  </p>
                </article>
                <article className="relative min-h-[15rem] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(160deg,#eaa880_0%,#e87c53_40%,#b04f2b_100%)] p-4">
                  <div className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                    איור מותאם אישית
                  </div>
                  <div className="absolute inset-4 rounded-[1.5rem] border border-white/20" />
                  <div className="absolute bottom-4 right-4 left-4 rounded-[1.5rem] bg-white/18 p-4 text-white backdrop-blur">
                    <p className="text-sm font-semibold">מבוסס על דמויות אמיתיות מהמשפחה</p>
                    <p className="mt-1 text-xs leading-6 text-white/75">אמא, נועה והתינוק החדש נכנסים לעלילה כאילו נכתבה עבורם מהיום הראשון.</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {HIGHLIGHTS.map((highlight) => (
                <article key={highlight.title} className="rounded-[1.75rem] border border-white bg-white/90 p-5 shadow-sm">
                  <h3 className="text-lg font-black text-gray-900">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">{highlight.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">למה זה מרגיש אחרת</p>
          <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">פחות טופס, יותר מסע בטוח וברור.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature} className="rounded-[1.75rem] border border-white bg-white p-5 shadow-sm">
              <p className="text-base font-semibold leading-7 text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-coral-100 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">איך זה עובד</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">רואים את הדרך מראש, לא מנחשים תוך כדי.</h2>
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
              <p className="mt-4 text-sm font-semibold text-gray-900">Best for: {plan.bestFor}</p>
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
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">Trust Layer</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">מה הורים צריכים לדעת לפני שמתחילים.</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-gray-600">
              <li>התמונות משמשות ליצירת הספר האישי שלכם בלבד.</li>
              <li>התהליך מציג ציפייה ברורה: מה מעלים, כמה זמן מחכים, ומה מקבלים בסוף.</li>
              <li>אחרי שהספר מוכן אפשר לקרוא, להוריד PDF ולבצע עריכות בסיסיות.</li>
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
          <h2 className="text-3xl font-black text-white md:text-5xl">מוכנים להתחיל ספר שירגיש באמת שלכם?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            אפשר להתחיל בלי להתחבר, למלא את כל הפרטים, ולבקש מאיתנו להתחיל את היצירה רק כשאתם מרגישים בטוחים.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/create">
              <Button size="lg" className="sm:w-auto">
                התחילו ליצור
              </Button>
            </Link>
            <Link href="/#faq">
              <Button variant="outline" size="lg" className="border-white/40 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                קראו עוד לפני שמתחילים
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
