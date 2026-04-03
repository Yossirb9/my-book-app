import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { BookParams } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const params: BookParams = body.params

    if (!params.template || !params.length || !params.characters?.length) {
      return NextResponse.json({ error: 'Missing required params' }, { status: 400 })
    }

    // Create book record
    const { data: book, error } = await supabase
      .from('books')
      .insert({
        user_id: user.id,
        title: buildTitle(params),
        status: 'draft',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: params as any,
        image_regenerations_left: 3,
        text_regenerations_left: 3,
        paid: true, // TODO: set to false and integrate Stripe before production
      })
      .select()
      .single()

    if (error || !book) {
      console.error('Book insert error:', error)
      return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
    }

    // Insert characters
    const characterInserts = params.characters.map((c) => ({
      book_id: book.id,
      name: c.name,
      role: c.role,
      description: c.description,
      image_url: c.imageUrl,
    }))
    await supabase.from('characters').insert(characterInserts)

    return NextResponse.json({ bookId: book.id })

  } catch (e) {
    console.error('Create book error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildTitle(params: BookParams): string {
  const mainChar = params.characters.find((c) => c.role === 'main')
  const templates: Record<string, string> = {
    new_sibling: 'הספר של',
    birthday_child: 'יום הולדת שמח',
    potty_training: 'הגיבור',
    family_love: 'המשפחה שלנו',
  }
  const base = templates[params.template] || 'הספר שלי'
  return mainChar ? `${base} ${mainChar.name}` : base
}
