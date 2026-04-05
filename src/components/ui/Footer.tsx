import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/about', label: 'אנחנו' },
  { href: '/contact', label: 'צור קשר' },
  { href: '/terms', label: 'תנאי שימוש' },
]

export default function Footer() {
  return (
    <footer className="border-t border-coral-100 bg-[#FFF4E6]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-semibold text-gray-800">הספר שלי</p>
          <p className="mt-1">ספרים מותאמים אישית בעברית לרגעים משפחתיים משמעותיים.</p>
        </div>

        <nav aria-label="קישורי תחתית" className="flex flex-wrap items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-coral-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
