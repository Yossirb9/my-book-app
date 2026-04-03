import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TEMPLATE_LABELS } from '@/types'

export default async function BooksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="flex flex-col min-h-dvh bg-[#FFF9F0]">
      {/* Header */}
      <div className="px-4 pt-10 pb-4">
        <h1 className="text-2xl font-black text-gray-800">הספרים שלי 📚</h1>
        <p className="text-sm text-gray-500 mt-1">{books?.length || 0} ספרים</p>
      </div>

      {/* Books Grid */}
      <div className="px-4 pb-28">
        {!books?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">📖</div>
            <p className="font-bold text-gray-700 text-lg">עדיין אין לכם ספרים</p>
            <p className="text-gray-400 text-sm mt-1">צרו את הספר הראשון שלכם!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {books.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Cover */}
                  <div className="aspect-square bg-gradient-to-br from-coral-100 to-peach-300 flex items-center justify-center relative">
                    <span className="text-4xl">📖</span>
                    {/* Status badge */}
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
                      <p className="text-xs text-gray-400 mt-1">
                        🎨 {book.image_regenerations_left} | ✏️ {book.text_regenerations_left}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto bg-white border-t border-gray-100 shadow-lg">
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
            <span className="text-xl">⚙️</span>
            <span className="text-xs">הגדרות</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
