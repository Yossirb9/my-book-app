'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const VALUE_PILLARS = [
  {
    eyebrow: 'זה מרגיש כמו הילד שלכם',
    title: 'האיורים מכירים את הפנים שלו.',
    description:
      'הסיפור נבנה סביב האנשים האמיתיים שלכם — השם, הפנים, הטון והרגע המשפחתי. לא דמות גנרית. ילד בעל שם.',
  },
  {
    eyebrow: 'אתם יודעים מה יקרה',
    title: 'אין קפיצה עיוורת ישר ליצירה.',
    description:
      'לפני שמתחילים רואים מה מעלים, מה מקבלים, כמה זמן זה לוקח ואיך התוצאה תיראה, כך שהחוויה מרגישה בטוחה וברורה.',
  },
  {
    eyebrow: 'יוצאים עם משהו שאפשר לתת',
    title: 'יוצאים עם ספר שאפשר באמת לתת, לקרוא ולשמור.',
    description:
      'בסוף מקבלים ספר קריא ונעים בעברית, עם קובץ PDF מוכן למסך או להדפסה, בלי להסתבך עם עריכה או עימוד.',
  },
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
  const videoFrameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const frame = videoFrameRef.current
    const video = videoRef.current

    if (!frame || !video) {
      return
    }

    let rafId = 0

    const updateVideoProgress = () => {
      rafId = 0

      if (!video.duration || Number.isNaN(video.duration)) {
        return
      }

      const rect = frame.getBoundingClientRect()
      const totalTravel = rect.height + window.innerHeight
      const progressed = window.innerHeight - rect.top
      const progress = Math.min(Math.max(progressed / totalTravel, 0), 1)
      const targetTime = progress * video.duration

      if (Math.abs(video.currentTime - targetTime) > 0.033) {
        video.currentTime = targetTime
      }
    }

    const requestSync = () => {
      if (rafId) {
        return
      }

      rafId = window.requestAnimationFrame(updateVideoProgress)
    }

    const handleMetadata = () => {
      video.pause()
      requestSync()
    }

    video.addEventListener('loadedmetadata', handleMetadata)
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)
    requestSync()

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata)
      window.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <main className="min-h-dvh bg-[#FFF9F0] text-gray-900">
      <div ref={videoFrameRef} className="relative isolate">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="sticky top-0 h-screen">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-[0.88]"
              src="/home-scroll-background.mp4"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,249,240,0.68)_0%,rgba(255,245,233,0.52)_28%,rgba(255,249,240,0.82)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,124,83,0.24),_transparent_32%),radial-gradient(circle_at_left_center,_rgba(255,255,255,0.52),_transparent_36%)]" />
          </div>
        </div>

        <section className="relative z-10 overflow-hidden border-b border-coral-100/80 bg-transparent">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-20">
            <div className="max-w-2xl">
              <Badge variant="popular" className="mb-4 border-white/60 bg-amber-100/90 backdrop-blur-sm">
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
                <Link href="/#sample-preview">
                  <Button variant="outline" size="lg" className="border-coral-400/90 bg-white/55 backdrop-blur-sm sm:w-auto">
                    ראו ספר לדוגמה
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-white/70 bg-white/72 p-4 shadow-sm backdrop-blur-md">
                  <p className="text-2xl font-black text-coral-700">3-5</p>
                  <p className="mt-1 text-sm text-gray-700">דקות, וספר שלם בידיים שלכם</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/70 bg-white/72 p-4 shadow-sm backdrop-blur-md">
                  <p className="text-2xl font-black text-coral-700">אישי</p>
                  <p className="mt-1 text-sm text-gray-700">כל ספר נכתב סביב הילד שלכם — השם, הפנים, הסיפור</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/70 bg-white/72 p-4 shadow-sm backdrop-blur-md">
                  <p className="text-2xl font-black text-coral-700">מוכן</p>
                  <p className="mt-1 text-sm text-gray-700">לקריאה ביחד, לשמור, ולתת במתנה</p>
                </div>
              </div>
            </div>

            <div id="sample-preview" className="flex items-center">
              <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,245,233,0.94))] p-4 shadow-[0_30px_80px_rgba(232,124,83,0.16)] backdrop-blur-md">
                <div className="pointer-events-none absolute inset-x-10 top-8 h-20 rounded-full bg-[#ffd9bf]/60 blur-3xl" />
                <div className="relative rounded-[2rem] bg-[#fff8ef] p-3">
                  <Image
                    src="/hero-child-reading.svg"
                    alt="איור של ילד מחזיק ספר"
                    width={920}
                    height={920}
                    priority
                    className="h-auto w-full rounded-[1.6rem]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 bg-transparent">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-600">למה זה מרגיש אחרת</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-[#1a1a2e] md:text-4xl">
                ספר שנולד מהפנים שלו, מהשם שלו, ומהרגע שלכם.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-700">
                כי כשילד מחזיק ספר שהוא הגיבור שלו — ספר שמכיר את הפנים שלו ואת שמו — הוא לא מניח אותו.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {VALUE_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[2rem] border border-white/70 bg-white/78 p-6 shadow-sm backdrop-blur-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">{pillar.eyebrow}</p>
                  <h3 className="mt-4 text-2xl font-black leading-9 text-[#1a1a2e]">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-700">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

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
