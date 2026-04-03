import Link from 'next/link'
import Button from '@/components/ui/Button'

const FEATURES = [
  { icon: '📸', title: 'דמויות אמיתיות', desc: 'ה-AI מצייר את הדמויות לפי תמונות אמיתיות שתעלו' },
  { icon: '🤖', title: 'AI חכם', desc: 'סיפור עשיר בעברית, מותאם לגיל ולנושא שבחרתם' },
  { icon: '⚡', title: 'מוכן תוך דקות', desc: 'כל הספר — סיפור ואיורים — נוצר אוטומטית תוך 3-5 דקות' },
  { icon: '🎨', title: 'איכות פרימיום', desc: 'איורים ברמה מקצועית, מותאמים לסגנון שבחרתם' },
  { icon: '📥', title: 'PDF להורדה', desc: 'קובץ דיגיטלי וקובץ מוכן להדפסה בבית או בדפוס' },
  { icon: '🇮🇱', title: 'בעברית מלאה', desc: 'ממשק, סיפור וניקוד — הכל בעברית מושלמת' },
]

const HOW_IT_WORKS = [
  { num: '1', title: 'בחרו סוג ספר', desc: 'אח חדש, יום הולדת, גמילה, אהבת משפחה' },
  { num: '2', title: 'הוסיפו דמויות', desc: 'העלו תמונה אמיתית לכל דמות' },
  { num: '3', title: 'התאימו אישית', desc: 'מסר, גיל, סגנון וכיוון רגשי' },
  { num: '4', title: 'קבלו ספר מוגמר', desc: 'PDF להורדה ולהדפסה מיד' },
]

const PRICING = [
  { title: 'קצר', pages: '10 עמודים', price: 89, desc: 'מושלם לסיפור קצר וממוקד' },
  { title: 'בינוני', pages: '18 עמודים', price: 109, desc: 'הספר הפופולרי ביותר', popular: true },
  { title: 'ארוך', pages: '28 עמודים', price: 129, desc: 'חוויה מלאה ועשירה' },
]

const TESTIMONIALS = [
  { name: 'שירה כ.', text: 'הבן שלי לא הפסיק לדרוש שנקרא לו שוב ושוב. הוא לא מאמין שהוא הגיבור!', stars: 5 },
  { name: 'מיכל ר.', text: 'קנינו כמתנת יום הולדת לבת שלנו. ה-AI הצליח לצייר אותה מדויק להפליא!', stars: 5 },
  { name: 'דני א.', text: 'תוצאה מדהימה. הספר נראה מקצועי לגמרי, כאילו קנינו בחנות.', stars: 5 },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[#FFF9F0]">

      {/* ── MOBILE HEADER (hidden on desktop, Navbar takes over) ── */}
      <header className="md:hidden flex items-center justify-center px-4 pt-10 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h1 className="text-2xl font-bold text-coral-500">הספר שלי</h1>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-[#FFF9F0]">
        {/* Mobile hero */}
        <div className="md:hidden flex flex-col items-center px-5 pt-6 pb-8 text-center">
          <div className="text-7xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-800 leading-snug mb-2">
            הספר שיספר<br />את הסיפור שלכם
          </h2>
          <p className="text-gray-500 text-base mb-6">ספר ילדים מאויר עם הדמויות האמיתיות שלכם</p>
          <Link href="/create" className="w-full">
            <Button size="lg" className="text-lg py-4">✨ צרו ספר עכשיו</Button>
          </Link>
        </div>

        {/* Desktop hero */}
        <div className="hidden md:flex max-w-7xl mx-auto px-8 py-20 items-center gap-16">
          <div className="flex-1 text-right">
            <div className="inline-flex items-center gap-2 bg-coral-50 border border-coral-100 rounded-full px-4 py-1.5 text-sm text-coral-600 font-medium mb-6">
              ✨ מופעל על ידי AI מתקדם
            </div>
            <h1 className="text-5xl font-black text-gray-800 leading-tight mb-6">
              הספר שהילד שלך<br />
              <span className="text-coral-500">ייזכר לתמיד</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              ספרי ילדים מאויירים עם הדמויות האמיתיות שלכם.<br />
              AI מתקדם יוצר סיפור בעברית ואיורים תוך דקות.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/create">
                <button className="bg-coral-500 hover:bg-coral-600 text-white font-black text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-coral-200">
                  🎨 צרו את הספר שלכם
                </button>
              </Link>
              <div className="text-sm text-gray-400">מ-₪89 בלבד</div>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {['500+ משפחות', '⭐⭐⭐⭐⭐ דירוג', '30 יום החזר'].map((b) => (
                <span key={b} className="text-sm text-gray-500 flex items-center gap-1">✓ {b}</span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 w-96 h-96 bg-gradient-to-br from-coral-100 via-peach-300 to-coral-200 rounded-3xl flex items-center justify-center shadow-xl">
            <div className="text-center">
              <div className="text-9xl mb-4">📖</div>
              <p className="text-coral-600 font-bold text-lg">ספר ילדים אישי</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE TRUST BADGES ── */}
      <section className="md:hidden flex gap-2 px-4 pb-6 overflow-x-auto no-scrollbar">
        {['🎨 דמויות דומות למקור', '📖 סיפור בעברית', '🖨️ מוכן להדפסה'].map((badge) => (
          <span key={badge} className="shrink-0 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100 whitespace-nowrap">
            {badge}
          </span>
        ))}
      </section>

      {/* ── FEATURES GRID (desktop) ── */}
      <section id="features" className="hidden md:block bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-gray-800 text-center mb-3">למה הספר שלי?</h2>
          <p className="text-gray-400 text-center mb-12">הכלי הכי מתקדם ליצירת ספרי ילדים אישיים</p>
          <div className="grid grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[#FFF9F0] rounded-2xl p-6 text-right">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE HOW IT WORKS ── */}
      <section className="md:hidden px-4 pb-8">
        <h3 className="font-bold text-gray-700 text-lg mb-4">איך זה עובד?</h3>
        <div className="flex flex-col gap-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold text-sm shrink-0">{step.num}</div>
              <div>
                <p className="font-semibold text-gray-800">{step.title}</p>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS (desktop) ── */}
      <section id="how" className="hidden md:block py-20 bg-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-gray-800 text-center mb-12">איך זה עובד?</h2>
          <div className="grid grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} className="text-center relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute top-8 left-0 w-full h-0.5 bg-coral-100 -z-10" />
                )}
                <div className="w-16 h-16 rounded-full bg-coral-500 text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg shadow-coral-200">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING (desktop) ── */}
      <section id="pricing" className="hidden md:block py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-gray-800 text-center mb-3">תמחור פשוט</h2>
          <p className="text-gray-400 text-center mb-12">ללא דמי מנוי — משלמים פעם אחת לכל ספר</p>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {PRICING.map((plan) => (
              <div key={plan.title} className={`rounded-2xl p-6 text-right border-2 relative ${plan.popular ? 'border-coral-500 bg-coral-50 shadow-lg shadow-coral-100' : 'border-gray-100 bg-white'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    הכי פופולרי ⭐
                  </div>
                )}
                <h3 className="font-black text-xl text-gray-800 mb-1">{plan.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.pages}</p>
                <div className="text-4xl font-black text-coral-500 mb-1">₪{plan.price}</div>
                <p className="text-gray-500 text-sm mb-6">{plan.desc}</p>
                <Link href="/create">
                  <button className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${plan.popular ? 'bg-coral-500 text-white hover:bg-coral-600' : 'border-2 border-coral-500 text-coral-500 hover:bg-coral-50'}`}>
                    בחרו תוכנית זו
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (desktop) ── */}
      <section className="hidden md:block py-20 bg-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-gray-800 text-center mb-12">מה אומרים ההורים?</h2>
          <div className="grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-right">
                <div className="flex gap-0.5 mb-3">{'⭐'.repeat(t.stars)}</div>
                <p className="text-gray-700 leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-bold text-gray-800 text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-12 md:py-20 bg-coral-500 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">מוכנים ליצור את הספר?</h2>
          <p className="text-coral-100 mb-8 text-sm md:text-base">הצטרפו ל-500+ משפחות שכבר יצרו ספרים מיוחדים</p>
          <Link href="/create">
            <button className="bg-white text-coral-500 font-black text-lg px-10 py-4 rounded-2xl hover:bg-coral-50 transition-colors shadow-lg">
              🎁 צרו ספר עכשיו — מ-₪89
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER (desktop) ── */}
      <footer className="hidden md:block bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="text-gray-500 text-sm">© 2026 הספר שלי. כל הזכויות שמורות.</div>
          <div className="flex items-center gap-2 text-white font-bold">
            <span>📖</span>
            <span>הספר שלי</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/#how" className="hover:text-white transition-colors">איך זה עובד</Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">תמחור</Link>
            <Link href="/login" className="hover:text-white transition-colors">כניסה</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
