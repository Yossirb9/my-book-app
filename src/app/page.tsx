import Link from 'next/link'
import Button from '@/components/ui/Button'

const SAMPLE_BOOKS = [
  { emoji: '👶', title: 'אח חדש', desc: 'יום ההולדת של נועה' },
  { emoji: '🎂', title: 'יום הולדת', desc: 'הרפתקאות של דניאל' },
  { emoji: '❤️', title: 'ספר אהבה', desc: 'המשפחה שלנו' },
]

const HOW_IT_WORKS = [
  { num: '1', title: 'בחרו סוג ספר', desc: 'תבנית מוכנה או ספר פרימיום אישי' },
  { num: '2', title: 'העלו תמונות', desc: 'תמונה אחת לכל דמות מספיקה' },
  { num: '3', title: 'קבלו ספר מוגמר', desc: 'PDF דיגיטלי ומוכן להדפסה' },
]

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-dvh bg-[#FFF9F0]">
      {/* Top Bar */}
      <header className="flex items-center justify-center px-4 pt-10 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h1 className="text-2xl font-bold text-coral-500">הספר שלי</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center px-5 pt-6 pb-8 text-center">
        <div className="text-7xl mb-4">📖</div>
        <h2 className="text-2xl font-bold text-gray-800 leading-snug mb-2">
          הספר שיספר<br />את הסיפור שלכם
        </h2>
        <p className="text-gray-500 text-base mb-6">
          ספר ילדים מאויר עם הדמויות האמיתיות שלכם
        </p>
        <Link href="/create" className="w-full">
          <Button size="lg" className="text-lg py-4">
            ✨ צרו ספר עכשיו
          </Button>
        </Link>
      </section>

      {/* Trust Badges */}
      <section className="flex gap-2 px-4 pb-6 overflow-x-auto no-scrollbar">
        {['🎨 דמויות דומות למקור', '📖 סיפור בעברית', '🖨️ מוכן להדפסה'].map((badge) => (
          <span
            key={badge}
            className="shrink-0 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100 whitespace-nowrap"
          >
            {badge}
          </span>
        ))}
      </section>

      {/* Sample Books */}
      <section className="px-4 pb-8">
        <h3 className="font-bold text-gray-700 text-lg mb-3">ספרים שנוצרו</h3>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {SAMPLE_BOOKS.map((book) => (
            <div
              key={book.title}
              className="shrink-0 w-28 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="h-28 bg-gradient-to-br from-coral-100 to-peach-300 flex items-center justify-center text-4xl">
                {book.emoji}
              </div>
              <div className="p-2">
                <p className="font-semibold text-xs text-gray-700">{book.title}</p>
                <p className="text-xs text-gray-400">{book.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 pb-8">
        <h3 className="font-bold text-gray-700 text-lg mb-4">איך זה עובד?</h3>
        <div className="flex flex-col gap-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {step.num}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{step.title}</p>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-10">
        <Link href="/create" className="w-full">
          <Button size="lg" className="text-lg">
            🎁 צרו ספר עכשיו — מ-₪89
          </Button>
        </Link>
        <p className="text-center text-xs text-gray-400 mt-3">
          אם לא מרוצים — נחזיר את הכסף
        </p>
      </section>
    </main>
  )
}
