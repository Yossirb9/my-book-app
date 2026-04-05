'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import LogoutButton from '@/components/ui/LogoutButton'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type NavbarProps = {
  initialIsAuthenticated?: boolean
}

const MARKETING_LINKS = [
  { href: '/#how-it-works', label: 'איך זה עובד' },
  { href: '/#pricing', label: 'מחירים' },
  { href: '/#faq', label: 'שאלות נפוצות' },
]

export default function Navbar({ initialIsAuthenticated = false }: NavbarProps) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated)
  const shouldHide = useMemo(
    () => ['/create', '/book', '/books'].some((route) => pathname?.startsWith(route)),
    [pathname]
  )

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(Boolean(user))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user))
    })

    return () => subscription.unsubscribe()
  }, [])

  if (shouldHide) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/88 backdrop-blur-xl shadow-[0_10px_35px_rgba(26,26,46,0.06)]">
      <div className="mx-auto hidden max-w-7xl items-center justify-between px-8 py-4 md:flex">
        <Link href="/" className="flex items-center gap-3 text-coral-600">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-50 text-sm font-black shadow-inner shadow-coral-100">
            ספר
          </span>
          <div className="text-right">
            <span className="block text-lg font-black text-gray-900">הספר שלי</span>
            <span className="block text-xs text-gray-500">ספרי ילדים אישיים בעברית</span>
          </div>
        </Link>

        <div className="flex items-center gap-7 text-sm font-semibold text-gray-600">
          {MARKETING_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-coral-600">
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href="/books"
              className={cn(
                'transition-colors hover:text-coral-600',
                pathname === '/books' && 'text-coral-600'
              )}
            >
              הספרים שלי
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/books">
                <Button variant="ghost" size="sm" className="rounded-full px-4">
                  הספרים שלי
                </Button>
              </Link>
              <LogoutButton className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900">
                התנתקות
              </LogoutButton>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-full px-4">
                  כניסה
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="sm" className="rounded-full px-4">
                  הרשמה
                </Button>
              </Link>
            </>
          )}
          <Link href="/create">
            <Button size="sm" className="rounded-full px-5">
              צרו ספר
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2 text-coral-600">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-50 text-sm font-black shadow-inner shadow-coral-100">
            ספר
          </span>
          <div className="text-right">
            <span className="block text-sm font-black text-gray-900">הספר שלי</span>
            <span className="block text-[11px] text-gray-500">ספר אישי בעברית</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/books"
                className="rounded-full border border-coral-200 px-3 py-2 text-xs font-semibold text-coral-700"
              >
                הספרים שלי
              </Link>
              <LogoutButton className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600">
                התנתק
              </LogoutButton>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700"
              >
                כניסה
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-coral-200 bg-coral-50 px-3 py-2 text-xs font-semibold text-coral-700"
              >
                הרשמה
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
