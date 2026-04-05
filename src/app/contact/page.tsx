import ContactForm from '@/components/contact/ContactForm'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'צור קשר',
  description: 'עמוד יצירת קשר לפניות, תמיכה ושאלות בנוגע לשירותי הספר שלי.',
})

const CONTACT_DETAILS = [
  {
    title: 'פניות כלליות',
    description: 'לשאלות על המערכת, תהליך היצירה או התאמת ספר לרגע משפחתי מסוים.',
  },
  {
    title: 'תמיכה בהזמנה',
    description: 'אם כבר התחלתם ספר או ביצעתם הזמנה, אפשר לציין פרטים בטופס ונחזור אליכם.',
  },
  {
    title: 'שיתופי פעולה',
    description: 'אם יש לכם רעיון לשיתוף פעולה, פעילות בית ספרית או מיזם תוכן, נשמח לשמוע.',
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-[#FFF9F0] text-gray-900">
      <section className="border-b border-coral-100/80 bg-[linear-gradient(180deg,#FFF9F0_0%,#FFF4E6_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] text-[#1a1a2e] md:text-6xl">
              נשמח לעזור לכם
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-700 md:text-lg">
              אפשר לפנות אלינו בכל שאלה על יצירת ספר אישי, הזמנה קיימת, תמיכה טכנית או התאמה לרגע משפחתי
              שאתם רוצים להפוך לסיפור.
            </p>

            <div className="mt-8 space-y-4">
              {CONTACT_DETAILS.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-coral-100 bg-white/80 p-5 shadow-sm">
                  <h2 className="text-xl font-black text-[#1a1a2e]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-gray-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  )
}
