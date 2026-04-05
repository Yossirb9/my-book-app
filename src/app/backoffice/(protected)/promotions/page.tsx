import PromotionForm from '@/components/crm/PromotionForm'
import { listPromotions } from '@/lib/crm/service'

export default async function BackofficePromotionsPage() {
  const promotions = await listPromotions()

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-500">
          Promotions engine
        </p>
        <h1 className="mt-2 text-4xl font-black text-[#1a1a2e]">קופונים וקמפיינים</h1>
      </section>

      <PromotionForm />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {promotions.map((promotion) => (
          <article key={promotion.id} className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-500">
                  {promotion.scope}
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1a1a2e]">{promotion.code}</h2>
              </div>
              <span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-semibold text-coral-600">
                {promotion.kind === 'percentage'
                  ? `${promotion.amount}%`
                  : `₪${promotion.amount / 100}`}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>מימושים: {promotion.used_count}</p>
              <p>הגבלה: {promotion.usage_limit || 'ללא הגבלה'}</p>
              <p>
                תפוגה:{' '}
                {promotion.expires_at
                  ? new Date(promotion.expires_at).toLocaleString('he-IL')
                  : 'ללא'}
              </p>
              <p>סטטוס: {promotion.is_active ? 'פעיל' : 'כבוי'}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
