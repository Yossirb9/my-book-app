import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'תנאי שימוש',
  description: 'תנאי השימוש של אתר הספר שלי, כולל שימוש במערכת, תשלומים, אחריות ותוכן משתמש.',
})

const SECTIONS = [
  {
    title: 'כללי',
    body:
      'השימוש באתר ובשירותים המוצעים בו כפוף לתנאים המפורטים בעמוד זה. השימוש באתר מהווה הסכמה לתנאים אלה. אם אינכם מסכימים לאחד או יותר מהתנאים, יש להימנע משימוש באתר.',
  },
  {
    title: 'השירות',
    body:
      'האתר מאפשר יצירה והזמנה של ספרים מותאמים אישית על בסיס מידע, טקסטים, תמונות ופרטים שמוזנים על ידי המשתמשים. אנו עושים מאמץ לספק תוצאה איכותית, אך ייתכנו הבדלים בין ציפייה לבין התוצר הסופי בשל אופי היצירה המותאמת.',
  },
  {
    title: 'תוכן שמעלים לאתר',
    body:
      'המשתמש אחראי לכך שכל תוכן, תמונה, טקסט או פרט שהוא מעלה לאתר נמסרו כדין ואינם מפרים זכויות של צדדים שלישיים, לרבות זכויות יוצרים, פרטיות או שם טוב.',
  },
  {
    title: 'תשלום והזמנות',
    body:
      'הזמנה תיחשב כמאושרת לאחר קבלת אישור תשלום. המחירים באתר מוצגים בשקלים חדשים, אלא אם צוין אחרת. החברה רשאית לעדכן מחירים, מבצעים ותנאי רכישה מעת לעת.',
  },
  {
    title: 'שימוש מותר',
    body:
      'אין לעשות באתר שימוש בלתי חוקי, פוגעני, מטעה או כזה שעלול להפריע לפעילות האתר, לפגוע בשירות או לנסות לגשת למערכות שאינן מיועדות למשתמש.',
  },
  {
    title: 'הגבלת אחריות',
    body:
      'השירות ניתן כפי שהוא ובהתאם לזמינותו. אנו עושים מאמצים לשמור על פעילות תקינה של האתר, אך איננו מתחייבים כי השירות יהיה זמין ללא הפרעות או נקי משגיאות בכל עת.',
  },
  {
    title: 'יצירת קשר',
    body:
      'לכל שאלה, בירור או פנייה בנוגע לשימוש באתר ניתן לפנות דרך עמוד צור קשר. אנו ממליצים לבצע גם בדיקה משפטית פרטנית ולהתאים את תנאי השימוש לעסק ולמדיניות בפועל.',
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-[#FFF9F0] text-gray-900">
      <section className="border-b border-coral-100/80 bg-[linear-gradient(180deg,#FFF9F0_0%,#FFF4E6_100%)]">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
          <span className="inline-flex rounded-full border border-coral-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-coral-600">
            תנאי שימוש
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] text-[#1a1a2e] md:text-6xl">
            תנאי השימוש באתר
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-700 md:text-lg">
            ריכזנו כאן את התנאים המרכזיים לשימוש באתר ובשירותי יצירת הספרים. הטקסט נועד לשמש בסיס ברור
            ונגיש למשתמשים, ומומלץ להשלים מול ייעוץ משפטי לפי אופי הפעילות העסקית בפועל.
          </p>
        </div>
      </section>

      <section className="bg-white/65">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
          <div className="space-y-5">
            {SECTIONS.map((section) => (
              <article key={section.title} className="rounded-[2rem] border border-coral-100 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-black text-[#1a1a2e]">{section.title}</h2>
                <p className="mt-4 text-sm leading-8 text-gray-700 md:text-base">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
