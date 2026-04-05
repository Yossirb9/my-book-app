import Link from 'next/link'
import Button from '@/components/ui/Button'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'אנחנו',
  description:
    'הסיפור של משפחת רבינוביץ׳ והדרך שבה נולד הרעיון ליצור ספרים אישיים שמלווים רגעים משפחתיים משמעותיים ומעודדים קריאה.',
})

const VALUES = [
  {
    title: 'רגעים משפחתיים שנשארים',
    description:
      'אנחנו יוצרים ספרים שנולדים מתוך החיים עצמם: היריון, אח חדש, התרגשות, שינוי, וגם הרגעים הקטנים שרוצים לזכור.',
  },
  {
    title: 'סיפור אישי שמרגיש אמיתי',
    description:
      'כל ספר נבנה סביב הסיפור המשפחתי, השמות, הדמויות והפרטים הקטנים שהופכים מתנה יפה לזיכרון עם משמעות.',
  },
  {
    title: 'עידוד קריאה בגיל צעיר',
    description:
      'כשהילד או הילדה פוגשים את עצמם בתוך הסיפור, הקריאה הופכת לקרובה, מרגשת ומזמינה יותר כבר מהעמודים הראשונים.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-[#FFF9F0] text-gray-900">
      <section className="border-b border-coral-100/80 bg-[radial-gradient(circle_at_top_left,rgba(232,124,83,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(255,179,71,0.2),transparent_28%),linear-gradient(180deg,#FFF9F0_0%,#FFF3E2_100%)]">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mt-5 text-4xl font-black leading-[1.05] text-[#1a1a2e] md:text-6xl">
              ספרים שנולדו מתוך סיפור משפחתי אמיתי.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-700 md:text-lg">
              אנחנו משפחת רבינוביץ׳, ומתוך רגע אישי מאוד בבית שלנו נולד הרעיון לבנות ספרים שמלווים רגעים
              משמעותיים בחיי משפחה וילדים.
            </p>
          </div>

          <article className="mx-auto mt-10 max-w-4xl rounded-[2.2rem] border border-coral-100 bg-white/90 p-7 text-right shadow-[0_24px_60px_rgba(26,26,46,0.08)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">הסיפור שלנו</p>
            <div className="mt-5 space-y-5 text-base leading-8 text-gray-700 md:text-lg">
              <p>
                אנחנו יוסי וליר רבינוביץ׳. יוסי הוא מנהל בית ספר יסודי ומורה למוזיקה, ליר מורה למחול,
                ואנחנו הורים למאיה בת 9, יובל בת 5 ושחר בן 6 חודשים.
              </p>
              <p>
                הרעיון התחיל כשרצינו לספר לבנות שלנו על ההיריון. מתוך הרצון לשתף אותן בדרך קרובה, רגישה
                ומשפחתית, יוסי יצר ספר מותאם אישית שסיפר את הסיפור שלנו.
              </p>
              <p>
                מאותו רגע הבנו שיש כאן משהו גדול יותר. ספר יכול להיות הרבה מעבר למתנה יפה. הוא יכול לעזור
                לילדים להבין שינוי, להתרגש מרגע חדש, להרגיש חלק מהסיפור המשפחתי, ולשמור זיכרון משמעותי
                שנשאר איתם.
              </p>
              <p>
                מתוך ההבנה הזאת נולד המיזם שלנו: ליצור ספרים שמלווים רגעים משפחתיים ואישיים משמעותיים,
                ובו בזמן גם מחזקים ומעודדים קריאה אצל ילדים צעירים. כשילד פוגש את עצמו בתוך הסיפור, הקריאה הופכת
                לחוויה קרובה, טבעית ומרגשת יותר.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="border-b border-coral-100 bg-white/65">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">למה זה חשוב לנו</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e] md:text-4xl">
              לא רק ספר יפה, אלא כלי לקרבה, לשיחה ולעידוד קריאה.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {VALUES.map((value) => (
              <article
                key={value.title}
                className="rounded-[2rem] border border-coral-100 bg-[#FFF9F0] p-6 shadow-sm shadow-coral-100/60"
              >
                <h3 className="text-xl font-black text-gray-900">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF9F0]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center md:px-8 md:py-20">
          <h2 className="text-3xl font-black text-[#1a1a2e] md:text-5xl">כל רגע משפחתי יכול להפוך לסיפור.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            אם גם אצלכם יש רגע שראוי להישמר, אפשר להתחיל ממנו ולבנות ספר שמרגיש בדיוק שלכם.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/create">
              <Button size="lg" className="sm:w-auto">
                צרו ספר משלכם
              </Button>
            </Link>
            <Link href="/#faq">
              <Button variant="outline" size="lg" className="border-coral-300 bg-white/80 sm:w-auto">
                שאלות נפוצות
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
