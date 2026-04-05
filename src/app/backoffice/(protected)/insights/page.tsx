import {
  DELIVERY_OPTION_LABELS,
  getBookLengthLabel,
  getBookStatusLabel,
  getBookTypeLabel,
} from '@/lib/crm/constants'
import { getInsightsData } from '@/lib/crm/service'
import { formatCurrency } from '@/lib/crm/utils'

export default async function BackofficeInsightsPage() {
  const data = await getInsightsData()

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-coral-100 bg-[#FFF9F0] p-6">
        <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">עמוד תובנות</p>
        <h1 className="mt-2 text-4xl font-black text-[#1a1a2e]">מה נוצר, מה פופולרי ומה חשוב לדעת</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
          מבט עומק על סוגי הספרים שנוצרים במערכת, פופולריות לפי נושא, מצב ההפקה והרגלי
          הלקוחות, כדי לקבל החלטות תוכן ושיווק מבוססות נתונים.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">ספרים שנוצרו</p>
          <p className="mt-4 text-3xl font-black text-[#1a1a2e]">{data.summary.totalBooks}</p>
        </article>
        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">מוכנים לקריאה</p>
          <p className="mt-4 text-3xl font-black text-[#1a1a2e]">{data.summary.readyBooks}</p>
        </article>
        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">לקוחות חוזרים</p>
          <p className="mt-4 text-3xl font-black text-[#1a1a2e]">{data.summary.returningCustomers}</p>
        </article>
        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">פניות פתוחות</p>
          <p className="mt-4 text-3xl font-black text-[#1a1a2e]">{data.summary.openTickets}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">סוגי הספרים המובילים</p>
          <div className="mt-4 space-y-3">
            {data.topTemplates.length ? (
              data.topTemplates.map((template) => (
                <div
                  key={template.template}
                  className="flex items-center justify-between rounded-[1.25rem] border border-coral-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-[#1a1a2e]">
                      {getBookTypeLabel(template.template === 'unknown' ? null : template.template)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{template.count} ספרים נוצרו</p>
                  </div>
                  <p className="text-sm font-semibold text-coral-600">
                    {formatCurrency(template.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">עדיין אין מספיק נתונים להצגת פופולריות.</p>
            )}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">תובנות פעולה</p>
          <div className="mt-4 space-y-3">
            {data.actionableInsights.length ? (
              data.actionableInsights.map((insight) => (
                <div key={insight} className="rounded-[1.25rem] border border-coral-100 p-4">
                  <p className="text-sm leading-7 text-gray-700">{insight}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">התובנות יתמלאו ככל שיצטברו יותר ספרים והזמנות.</p>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">אורך ספרים</p>
          <div className="mt-4 space-y-3">
            {data.lengthBreakdown.map((item) => (
              <div key={item.length} className="flex items-center justify-between rounded-[1rem] bg-[#FFF9F0] px-4 py-3">
                <span className="text-sm text-gray-700">
                  {item.length === 'unknown' ? 'לא הוגדר' : getBookLengthLabel(item.length)}
                </span>
                <span className="text-sm font-semibold text-[#1a1a2e]">{item.count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">סטטוס יצירה</p>
          <div className="mt-4 space-y-3">
            {data.statusBreakdown.map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-[1rem] bg-[#FFF9F0] px-4 py-3">
                <span className="text-sm text-gray-700">{getBookStatusLabel(item.status)}</span>
                <span className="text-sm font-semibold text-[#1a1a2e]">{item.count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">תמהיל מסירה</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-[1rem] bg-[#FFF9F0] px-4 py-3">
              <span className="text-sm text-gray-700">
                {DELIVERY_OPTION_LABELS.digital}
              </span>
              <span className="text-sm font-semibold text-[#1a1a2e]">{data.summary.digitalBooks}</span>
            </div>
            <div className="flex items-center justify-between rounded-[1rem] bg-[#FFF9F0] px-4 py-3">
              <span className="text-sm text-gray-700">
                {DELIVERY_OPTION_LABELS.physical}
              </span>
              <span className="text-sm font-semibold text-[#1a1a2e]">{data.summary.physicalBooks}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
        <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">ספרים אחרונים שנוצרו</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {data.recentBooks.map((book) => (
            <div key={book.id} className="rounded-[1.25rem] border border-coral-100 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-[#1a1a2e]">{book.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{book.customerName}</p>
                </div>
                <p className="text-sm font-semibold text-coral-600">{formatCurrency(book.amount)}</p>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <p>סוג ספר: {getBookTypeLabel(book.template)}</p>
                <p>אורך: {book.length ? getBookLengthLabel(book.length) : 'לא הוגדר'}</p>
                <p>סטטוס: {getBookStatusLabel(book.status)}</p>
                <p>
                  מסירה:{' '}
                  {
                    DELIVERY_OPTION_LABELS[
                      book.orderType as keyof typeof DELIVERY_OPTION_LABELS
                    ]
                  }
                </p>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {new Date(book.created_at).toLocaleString('he-IL')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
