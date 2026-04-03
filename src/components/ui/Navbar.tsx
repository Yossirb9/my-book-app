'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  const isCreate = pathname?.startsWith('/create')
  const isBook = pathname?.startsWith('/book')

  if (isCreate || isBook) return null // wizard + book pages have their own headers

  return (
    <nav className="hidden md:flex sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-8 py-4">
        {/* Logo - right side (RTL) */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-coral-500">
          <span>📖</span>
          <span>הספר שלי</span>
        </Link>

        {/* Nav Links - center */}
        <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/#how" className="hover:text-coral-500 transition-colors">איך זה עובד</Link>
          <Link href="/#pricing" className="hover:text-coral-500 transition-colors">תמחור</Link>
          <Link href="/books" className={cn('hover:text-coral-500 transition-colors', pathname === '/books' && 'text-coral-500 font-semibold')}>הספרים שלי</Link>
        </div>

        {/* CTA - left side (RTL) */}
        <Link
          href="/create"
          className="bg-coral-500 hover:bg-coral-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          ✨ צור ספר עכשיו
        </Link>
      </div>
    </nav>
  )
}
