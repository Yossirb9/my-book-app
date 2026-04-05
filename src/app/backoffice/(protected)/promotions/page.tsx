import PromotionForm from '@/components/crm/PromotionForm'
import {
  PROMOTION_KIND_LABELS,
  PROMOTION_SCOPE_LABELS,
} from '@/lib/crm/constants'
import { listPromotions } from '@/lib/crm/service'
import { formatCurrency } from '@/lib/crm/utils'

export default async function BackofficePromotionsPage() {
  const promotions = await listPromotions()

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">מנוע קופונים</p>
        <h1 className="mt-2 text-4xl font-black text-[#1a1a2e]">קופונים וקמפיינים</h1>
      </section>

      <PromotionForm />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {promotions.map((promotion) => (
          <article key={promotion.id} className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">
                  {
                    PROMOTION_SCOPE_LABELS[
                      promotion.scope as keyof typeof PROMOTION_SCOPE_LABELS
                    ]
                  }
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1a1a2e]">{promotion.code}</h2>
              </div>
              <span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-semibold text-coral-600">
                {promotion.kind === 'percentage'
                  ? `${promotion.amount}%`
                  : formatCurrency(promotion.amount)}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>
                סוג הטבה:{' '}
                {PROMOTION_KIND_LABELS[promotion.kind as keyof typeof PROMOTION_KIND_LABELS]}
              </p>
              <p>מימושים: {promotion.used_count}</p>
              <p>הגבלת שימוש: {promotion.usage_limit || 'ללא הגבלה'}</p>
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
