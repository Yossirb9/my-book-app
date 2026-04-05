import MarketingGenerator from '@/components/crm/MarketingGenerator'
import {
  MARKETING_ASSET_STATUS_LABELS,
  MARKETING_ASSET_TYPE_LABELS,
} from '@/lib/crm/constants'
import { listMarketingAssets } from '@/lib/crm/service'

export default async function BackofficeMarketingPage() {
  const assets = await listMarketingAssets()

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">תוכן שיווקי</p>
        <h1 className="mt-2 text-4xl font-black text-[#1a1a2e]">מחולל תוכן וקהל יעד</h1>
      </section>

      <MarketingGenerator />

      <section className="grid gap-4 lg:grid-cols-2">
        {assets.map((asset) => (
          <article key={asset.id} className="rounded-[1.5rem] border border-coral-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">
                  {
                    MARKETING_ASSET_TYPE_LABELS[
                      asset.asset_type as keyof typeof MARKETING_ASSET_TYPE_LABELS
                    ]
                  }
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1a1a2e]">
                  {asset.title || asset.topic}
                </h2>
              </div>
              <span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-semibold text-coral-600">
                {
                  MARKETING_ASSET_STATUS_LABELS[
                    asset.status as keyof typeof MARKETING_ASSET_STATUS_LABELS
                  ]
                }
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              {String(
                (asset.meta &&
                typeof asset.meta === 'object' &&
                !Array.isArray(asset.meta) &&
                'summary' in asset.meta
                  ? asset.meta.summary
                  : null) || asset.topic
              )}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}
