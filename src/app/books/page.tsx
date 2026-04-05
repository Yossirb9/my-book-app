import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import LogoutButton from '@/components/ui/LogoutButton'
import { buildMetadata } from '@/lib/metadata'
import { createClient } from '@/lib/supabase/server'
import { BOOK_STATUS_LABELS, LENGTH_PAGES, TEMPLATE_LABELS } from '@/types'

export const metadata = buildMetadata({
  title: 'הספרים שלי',
  description: 'אזור אישי לניהול ספרים, מעקב אחרי סטטוס היצירה, קריאה והמשך עריכה.',
})

type BookRow = {
  id: string
  title: string
  status: 'draft' | 'generating' | 'ready' | 'failed'
  created_at: string
  params: { template?: keyof typeof TEMPLATE_LABELS; length?: keyof typeof LENGTH_PAGES } | null
  book_pages?: { page_number: number; image_url: string | null }[] | null
}

const STATUS_PRIORITY: Record<BookRow['status'], number> = {
  generating: 0,
  failed: 1,
  ready: 2,
  draft: 3,
}

function getExpectedPages(length?: keyof typeof LENGTH_PAGES) {
  if (!length) return null
  return LENGTH_PAGES[length].max
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function getBadgeVariant(status: BookRow['status']) {
  if (status === 'ready') return 'ready' as const
  if (status === 'generating') return 'generating' as const
  return 'default' as const
}

function getPrimaryAction(book: BookRow) {
  if (book.status === 'generating') {
    return {
      href: `/book/${book.id}/creating`,
      label: 'לצפייה בהתקדמות',
    }
  }

  if (book.status === 'failed') {
    return {
      href: `/book/${book.id}/creating?retry=1`,
      label: 'לנסות שוב',
    }
  }

  return {
    href: `/book/${book.id}`,
    label: 'לקריאה',
  }
}

function BookCard({ book }: { book: BookRow }) {
  const coverImage = [...(book.book_pages || [])]
    .sort((a, b) => a.page_number - b.page_number)[0]?.image_url
  const expectedPages = getExpectedPages(book.params?.length)
  const progress = book.status === 'generating' && expectedPages ? `${book.book_pages?.length || 0}/${expectedPages} עמודים` : null
  const action = getPrimaryAction(book)

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm">
      <div className="relative min-h-[14rem] bg-[linear-gradient(160deg,#1a1a2e_0%,#0f3460_60%,#e87c53_100%)]">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt={book.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge variant={getBadgeVariant(book.status)}>{BOOK_STATUS_LABELS[book.status]}</Badge>
            <span className="text-xs text-white/70">{formatDate(book.created_at)}</span>
          </div>
          <h2 className="text-xl font-black">{book.title}</h2>
          <p className="mt-2 text-sm text-white/75">
            {book.params?.template ? TEMPLATE_LABELS[book.params.template] : 'ספר אישי'}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">פעולה ראשית</p>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              {book.status === 'failed'
                ? 'היצירה נעצרה. אפשר להפעיל ניסיון נוסף בלחיצה אחת.'
                : book.status === 'generating'
                ? 'הספר נבנה עכשיו. אפשר להיכנס למסך ההתקדמות בכל רגע.'
                : 'הספר מוכן לקריאה, הורדה ועריכה בסיסית.'}
            </p>
          </div>
          {progress ? (
            <span className="rounded-full bg-[#FFF9F0] px-3 py-1 text-xs font-semibold text-coral-700">{progress}</span>
          ) : null}
        </div>

        <Link href={action.href}>
          <Button size="md" className="w-full">
            {action.label}
          </Button>
        </Link>
      </div>
    </article>
  )
}

export default async function BooksPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="min-h-dvh bg-[#FFF9F0] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 flex flex-col gap-5 rounded-[2rem] border border-coral-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">האזור האישי</p>
              <h1 className="mt-3 text-3xl font-black text-[#1a1a2e]">הספרים שלי</h1>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                כדי לראות ספרים שנשמרו, לעקוב אחרי יצירה או לחזור לעריכה, צריך להתחבר לחשבון.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login?returnTo=/books">
                <Button size="md">כניסה</Button>
              </Link>
              <Link href="/create">
                <Button variant="outline" size="md">
                  התחלת ספר חדש
                </Button>
              </Link>
            </div>
          </header>
        </div>
      </main>
    )
  }

  const { data } = await supabase
    .from('books')
    .select('id, title, status, created_at, params, book_pages(page_number, image_url)')
    .order('created_at', { ascending: false })

  const books = ((data || []) as BookRow[])
    .filter((book) => book.status !== 'draft')
    .sort((left, right) => {
      const statusDiff = STATUS_PRIORITY[left.status] - STATUS_PRIORITY[right.status]
      if (statusDiff !== 0) return statusDiff
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    })

  const generatingBooks = books.filter((book) => book.status === 'generating')
  const failedBooks = books.filter((book) => book.status === 'failed')
  const readyBooks = books.filter((book) => book.status === 'ready')

  return (
    <main className="min-h-dvh bg-[#FFF9F0] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-coral-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">האזור האישי</p>
            <h1 className="mt-3 text-3xl font-black text-[#1a1a2e]">הספרים שלי</h1>
            <p className="mt-2 text-sm leading-7 text-gray-600">
              כאן רואים מה בתהליך, מה מוכן לקריאה, ואיפה צריך לנסות שוב או להמשיך משם.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LogoutButton className="rounded-[1.5rem] border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900">
              התנתקות
            </LogoutButton>
            <Link href="/">
              <Button variant="ghost" size="md">
                חזרה לאתר
              </Button>
            </Link>
            <Link href="/create">
              <Button size="md">ספר חדש</Button>
            </Link>
          </div>
        </header>

        {!books.length ? (
          <section className="rounded-[2rem] border border-dashed border-coral-200 bg-white/70 p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">ספר ראשון</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">עדיין אין כאן ספרים.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600">
              זה המקום שבו תראו ספרים בתהליך, ספרים מוכנים לקריאה וגם ניסיונות שדורשים עוד לחיצה אחת.
            </p>
            <div className="mt-6">
              <Link href="/create">
                <Button size="lg" className="sm:w-auto">
                  צרו את הספר הראשון
                </Button>
              </Link>
            </div>
          </section>
        ) : (
          <div className="space-y-8">
            {generatingBooks.length ? (
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#1a1a2e]">בתהליך יצירה</h2>
                    <p className="text-sm text-gray-500">הספרים האלה אמורים להיות ראשונים על הרדאר שלכם.</p>
                  </div>
                  <Badge variant="generating">{generatingBooks.length} פעילים</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {generatingBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            ) : null}

            {failedBooks.length ? (
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#1a1a2e]">דורש תשומת לב</h2>
                    <p className="text-sm text-gray-500">אם משהו נתקע, תוכלו להפעיל ניסיון נוסף מכאן.</p>
                  </div>
                  <Badge variant="default">{failedBooks.length} ממתינים</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {failedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            ) : null}

            {readyBooks.length ? (
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#1a1a2e]">מוכנים לקריאה</h2>
                    <p className="text-sm text-gray-500">ספרים שכבר מוכנים לקרוא, להוריד או לערוך.</p>
                  </div>
                  <Badge variant="ready">{readyBooks.length} מוכנים</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {readyBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </main>
  )
}
