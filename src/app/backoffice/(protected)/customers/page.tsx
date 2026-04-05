import Link from 'next/link'
import { CUSTOMER_LIFECYCLE_LABELS } from '@/lib/crm/constants'
import { listCustomers } from '@/lib/crm/service'
import { formatCurrency } from '@/lib/crm/utils'

export default async function BackofficeCustomersPage() {
  const customers = await listCustomers()

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">כרטיסי לקוח</p>
        <h1 className="text-4xl font-black text-[#1a1a2e]">לקוחות וערך חיי לקוח</h1>
        <p className="max-w-3xl text-sm leading-7 text-gray-600">
          תצוגה מרוכזת של לקוחות, רכישות, ספרים ופעילות מצטברת כדי להבין מי ליד, מי משלם
          ומי כבר חזר להזמנה נוספת.
        </p>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-coral-100 bg-white">
        <div className="grid grid-cols-[1.3fr_0.9fr_0.7fr_0.7fr_0.8fr] gap-3 border-b border-coral-100 px-5 py-4 text-xs font-semibold tracking-[0.2em] text-coral-500">
          <span>לקוח</span>
          <span>סטטוס</span>
          <span>ספרים</span>
          <span>הזמנות</span>
          <span>ערך מצטבר</span>
        </div>

        <div className="divide-y divide-coral-100">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/customers/${customer.id}`}
              className="grid grid-cols-[1.3fr_0.9fr_0.7fr_0.7fr_0.8fr] gap-3 px-5 py-4 transition hover:bg-[#FFF9F0]"
            >
              <div>
                <p className="font-black text-[#1a1a2e]">{customer.full_name || customer.email}</p>
                <p className="mt-1 text-sm text-gray-600">{customer.email}</p>
              </div>
              <span className="text-sm font-semibold text-coral-600">
                {
                  CUSTOMER_LIFECYCLE_LABELS[
                    customer.lifecycle_status as keyof typeof CUSTOMER_LIFECYCLE_LABELS
                  ]
                }
              </span>
              <span className="text-sm font-semibold text-[#1a1a2e]">{customer.bookCount}</span>
              <span className="text-sm font-semibold text-[#1a1a2e]">{customer.orderCount}</span>
              <span className="text-sm font-semibold text-[#1a1a2e]">
                {formatCurrency(customer.ltv)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
