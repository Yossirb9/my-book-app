import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/about', label: 'אנחנו' },
  { href: '/contact', label: 'צור קשר' },
  { href: '/terms', label: 'תנאי שימוש' },
]

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-coral-100 bg-[#FFF4E6]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 overflow-x-auto px-4 py-3 text-sm font-medium text-gray-600 md:gap-8 md:px-8">
        <p className="shrink-0 font-semibold text-gray-800 [unicode-bidi:isolate]" dir="rtl">
          הספר שלי
        </p>
        <nav aria-label="קישורי תחתית" className="flex shrink-0 items-center gap-4 md:gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-coral-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
