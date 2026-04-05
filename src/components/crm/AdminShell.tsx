'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type AdminShellProps = PropsWithChildren<{
  email: string
  role: string
}>

const NAV_ITEMS = [
  { href: '/', label: 'סקירה' },
  { href: '/customers', label: 'לקוחות' },
  { href: '/fulfillment', label: 'Fulfillment' },
  { href: '/tickets', label: 'פניות' },
  { href: '/promotions', label: 'קופונים' },
  { href: '/marketing', label: 'AI שיווקי' },
]

export default function AdminShell({ children, email, role }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    })
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top_left,rgba(232,124,83,0.16),transparent_28%),linear-gradient(180deg,#FFF9F0_0%,#FFF4E6_55%,#fffaf4_100%)] text-[#1a1a2e]">
      <div className="mx-auto grid min-h-dvh max-w-[1500px] gap-6 px-4 py-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="rounded-[2rem] border border-[#26263f] bg-[#1a1a2e] p-5 text-white shadow-[0_30px_80px_rgba(26,26,46,0.24)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral-300">Book Ops</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">CRM + Fulfillment</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            סביבת עבודה נפרדת לחלוטין מהאתר הציבורי, לניהול לקוחות, ספרים, הזמנות,
            שירות ושיווק.
          </p>

          <nav className="mt-8 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition',
                    active
                      ? 'bg-coral-500 text-white shadow-[0_12px_30px_rgba(232,124,83,0.28)]'
                      : 'text-white/78 hover:bg-white/8 hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-10 rounded-[1.5rem] border border-white/12 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-coral-200">{role}</p>
            <p className="mt-2 break-all text-sm font-semibold text-white">{email}</p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="mt-4 w-full rounded-[1rem] border border-coral-300/30 px-3 py-2 text-sm font-semibold text-white transition hover:bg-coral-400/15 disabled:opacity-60"
            >
              {isPending ? 'מתנתקים...' : 'התנתקות'}
            </button>
          </div>
        </aside>

        <main className="rounded-[2rem] border border-coral-100 bg-white/92 p-4 shadow-[0_30px_80px_rgba(26,26,46,0.08)] backdrop-blur-xl lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
