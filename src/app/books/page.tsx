import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TEMPLATE_LABELS } from '@/types'

export default async function BooksPage() {
  // Try to get user, but don't require it
  let userId: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? null
  } catch { /* anonymous */ }

  const adminSupabase = await createAdminClient()
  const query = adminSupabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (userId) query.eq('user_id', userId)

  const { data: books } = await query

  return (
    <main className="min-h-dvh bg-[#FFF9F0]">

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-800">הספרים שלי 📚</h1>
          <Link href="/create">
            <button className="bg-coral-500 hover:bg-coral-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              + צור ספר חדש
            </button>
          </Link>
        </div>
        <p className="text-gray-400 mt-1">{books?.length || 0} ספרים</p>
      </div>

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden px-4 pt-10 pb-4">
        <h1 className="text-2xl font-black text-gray-800">הספרים שלי 📚</h1>
        <p className="text-sm text-gray-500 mt-1">{books?.length || 0} ספרים</p>
      </div>

      {/* ── BOOKS GRID ── */}
      <div className="px-4 md:px-8 pb-28 md:pb-12 md:max-w-7xl md:mx-auto">
        {!books?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">📖</div>
            <p className="font-bold text-gray-700 text-lg">עדיין אין ספרים</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">צרו את הספר הראשון שלכם!</p>
            <Link href="/create">
              <button className="bg-coral-500 text-white font-bold px-6 py-3 rounded-xl">
                ✨ צרו ספר עכשיו
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Cover */}
                <div className="aspect-[3/4] bg-gradient-to-br from-coral-100 to-peach-300 flex items-center justify-center relative">
                  <span className="text-5xl">📖</span>
                  <div className={cn(
                    'absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full',
                    book.status === 'ready' ? 'bg-green-500 text-white' :
                    book.status === 'generating' ? 'bg-peach-400 text-white' :
                    'bg-gray-200 text-gray-500'
                  )}>
                    {book.status === 'ready' ? '✅ מוכן' :
                     book.status === 'generating' ? '⏳ בייצור' : '📝 טיוטה'}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-gray-800 text-sm truncate">{book.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(book.params as any)?.template ? TEMPLATE_LABELS[(book.params as any).template as keyof typeof TEMPLATE_LABELS] : ''}
                  </p>
                  {book.status === 'ready' && (
                    <div className="flex gap-2 mt-2">
                      <Link href={`/book/${book.id}`} className="flex-1">
                        <button className="w-full text-xs border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors">📖 קרא</button>
                      </Link>
                      <Link href={`/book/${book.id}/edit`} className="flex-1">
                        <button className="w-full text-xs bg-coral-500 text-white rounded-lg py-1.5 hover:bg-coral-600 transition-colors">✏️ ערוך</button>
                      </Link>
                    </div>
                  )}
                  {book.status !== 'ready' && (
                    <Link href={book.status === 'generating' ? `/book/${book.id}/creating` : `/book/${book.id}`}>
                      <button className="w-full mt-2 text-xs border border-coral-200 text-coral-500 rounded-lg py-1.5 hover:bg-coral-50 transition-colors">
                        {book.status === 'generating' ? '⏳ צפה בהתקדמות' : '📖 פתח'}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 max-w-[430px] mx-auto bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-around py-3">
          <Link href="/books" className="flex flex-col items-center gap-0.5 text-coral-500">
            <span className="text-xl">📚</span>
            <span className="text-xs font-medium">הספרים שלי</span>
          </Link>
          <Link href="/create" className="flex flex-col items-center gap-0.5 text-gray-400">
            <div className="w-10 h-10 rounded-full bg-coral-500 flex items-center justify-center -mt-5 shadow-md">
              <span className="text-white text-xl">+</span>
            </div>
            <span className="text-xs mt-1">ספר חדש</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-0.5 text-gray-400">
            <span className="text-xl">🏠</span>
            <span className="text-xs">בית</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
