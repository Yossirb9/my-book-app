import Link from 'next/link'
import { getDashboardData } from '@/lib/crm/service'
import { formatCurrency } from '@/lib/crm/utils'

const metricCards = [
  { key: 'revenue', label: 'הכנסות החודש' },
  { key: 'bookCount', label: 'ספרים שנמכרו' },
  { key: 'aov', label: 'ממוצע סל' },
  { key: 'pendingPrint', label: 'ממתינים לדפוס' },
  { key: 'failedBooks', label: 'כשלים ב-24 השעות האחרונות' },
  { key: 'openTickets', label: 'פניות פתוחות' },
] as const

export default async function BackofficeDashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-[#d8d2c7] bg-[#1a1a2e] p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.28em] text-white/65">סקירת הנהלה</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black">מערכת ניהול לקוחות ותפעול</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/74">
              תמונת מצב אחת שמחברת לקוחות, הזמנות, ספרים, הפקה, שירות לקוחות ותוכן שיווקי
              לתפעול שוטף וניהול מדויק.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/insights"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1a1a2e]"
            >
              לעמוד התובנות
            </Link>
            <Link
              href="/fulfillment"
              className="rounded-full border border-white/24 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
            >
              ללוח ההפקה
            </Link>
            <Link
              href="/tickets"
              className="rounded-full border border-white/24 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
            >
              לתיבת הפניות
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((card) => (
          <article
            key={card.key}
            className="rounded-[1.5rem] border border-coral-100 bg-[#FFF9F0] p-5"
          >
            <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">{card.label}</p>
            <p className="mt-4 text-3xl font-black text-[#1a1a2e]">
              {card.key === 'revenue' || card.key === 'aov'
                ? formatCurrency(data[card.key])
                : data[card.key]}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">התפלגות ההזמנות</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-[#FFF9F0] p-4">
              <p className="text-sm text-gray-600">ספרים דיגיטליים</p>
              <p className="mt-2 text-2xl font-black text-[#1a1a2e]">{data.digitalCount}</p>
            </div>
            <div className="rounded-[1.25rem] bg-coral-50 p-4">
              <p className="text-sm text-gray-600">ספרים פיזיים</p>
              <p className="mt-2 text-2xl font-black text-[#1a1a2e]">{data.physicalCount}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">מה דורש טיפול</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[1.25rem] border border-coral-100 p-4">
              <p className="text-sm font-semibold text-[#1a1a2e]">הזמנות שממתינות להעברה לדפוס</p>
              <p className="mt-1 text-sm text-gray-600">
                {data.pendingPrint} הזמנות ממתינות לייצוא, בדיקה או עדכון סטטוס.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-coral-100 p-4">
              <p className="text-sm font-semibold text-[#1a1a2e]">כשלים אחרונים ביצירה</p>
              <p className="mt-1 text-sm text-gray-600">
                {data.failedBooks} ספרים חזרו עם כשל ב-24 השעות האחרונות.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-coral-100 p-4">
              <p className="text-sm font-semibold text-[#1a1a2e]">שירות לקוחות</p>
              <p className="mt-1 text-sm text-gray-600">
                {data.openTickets} פניות פתוחות מחכות לטיפול או סגירה.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
