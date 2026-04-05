import FulfillmentBoard from '@/components/crm/FulfillmentBoard'
import { listFulfillmentOrders } from '@/lib/crm/service'

export default async function BackofficeFulfillmentPage() {
  const items = await listFulfillmentOrders()

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">הפקה ולוגיסטיקה</p>
        <h1 className="mt-2 text-4xl font-black text-[#1a1a2e]">לוח הדפסה ומשלוחים</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
          קאנבן תפעולי לפי שלבי הפקה, עם בחירה מרובה, עדכון סטטוסים גורף וייצוא ZIP ומניפסט
          מסודר לבית הדפוס.
        </p>
      </section>

      <FulfillmentBoard items={items as unknown as Parameters<typeof FulfillmentBoard>[0]['items']} />
    </div>
  )
}
