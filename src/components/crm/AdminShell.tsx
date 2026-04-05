'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useTransition } from 'react'
import { STAFF_ROLE_LABELS } from '@/lib/crm/constants'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type AdminShellProps = PropsWithChildren<{
  email: string
  role: string
}>

const NAV_ITEMS = [
  { href: '/', label: 'סקירה' },
  { href: '/insights', label: 'תובנות' },
  { href: '/customers', label: 'לקוחות' },
  { href: '/fulfillment', label: 'הפקה ומשלוחים' },
  { href: '/tickets', label: 'פניות שירות' },
  { href: '/promotions', label: 'קופונים' },
  { href: '/marketing', label: 'תוכן שיווקי' },
]

export default function AdminShell({ children, email, role }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const roleLabel = STAFF_ROLE_LABELS[role as keyof typeof STAFF_ROLE_LABELS] || role

  const handleLogout = () => {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    })
  }

  return (
    <div className="min-h-dvh bg-[#f7f4ef] text-[#1a1a2e]">
      <div className="mx-auto grid min-h-dvh max-w-[1500px] gap-6 px-4 py-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="rounded-[2rem] border border-[#26263f] bg-[#1a1a2e] p-5 text-white">
          <p className="text-xs font-semibold tracking-[0.28em] text-coral-300">מערכת ניהול</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">לקוחות, הזמנות והפקה</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            סביבת העבודה הפנימית לניהול לקוחות, הפקת ספרים, שירות לקוחות, קופונים ותוכן
            שיווקי. המערכת מופרדת לחלוטין מהאתר הציבורי.
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
                      ? 'bg-coral-500 text-white'
                      : 'text-white/78 hover:bg-white/8 hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-10 rounded-[1.5rem] border border-white/12 bg-transparent p-4">
            <p className="text-xs tracking-[0.2em] text-coral-200">{roleLabel}</p>
            <p className="mt-2 break-all text-sm font-semibold text-white">{email}</p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="mt-4 w-full rounded-[1rem] border border-coral-300/30 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/8 disabled:opacity-60"
            >
              {isPending ? 'מתנתק...' : 'התנתקות'}
            </button>
          </div>
        </aside>

        <main className="rounded-[2rem] border border-coral-100 bg-white p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
