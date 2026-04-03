import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { BookParams } from '@/types'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    // Auth is optional — get user if logged in, otherwise create anonymously
    let userId: string
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? randomUUID()
    } catch {
      userId = randomUUID()
    }

    const body = await req.json()
    const params: BookParams = body.params

    if (!params.template || !params.length || !params.characters?.length) {
      return NextResponse.json({ error: 'Missing required params' }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    // Create book record
    const { data: book, error } = await adminSupabase
      .from('books')
      .insert({
        user_id: userId,
        title: buildTitle(params),
        status: 'draft',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: params as any,
        image_regenerations_left: 3,
        text_regenerations_left: 3,
        paid: true,
      })
      .select()
      .single()

    if (error || !book) {
      console.error('Book insert error:', error)
      return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
    }

    // Upload character photos to Supabase Storage and insert characters
    const characterInserts = await Promise.all(
      params.characters.map(async (c) => {
        let imageUrl: string | undefined = undefined

        if (c.imageUrl) {
          try {
            // imageUrl is a base64 data URL: "data:image/jpeg;base64,..."
            const base64Match = c.imageUrl.match(/^data:(.+);base64,(.+)$/)
            if (base64Match) {
              const mimeType = base64Match[1]
              const base64Data = base64Match[2]
              const buffer = Buffer.from(base64Data, 'base64')
              const ext = mimeType.split('/')[1]?.split('+')[0] || 'jpg'
              const filePath = `characters/${book.id}/${c.id || randomUUID()}.${ext}`

              const { error: uploadError } = await adminSupabase.storage
                .from('book-images')
                .upload(filePath, buffer, { contentType: mimeType, upsert: true })

              if (!uploadError) {
                const { data: urlData } = adminSupabase.storage
                  .from('book-images')
                  .getPublicUrl(filePath)
                imageUrl = urlData.publicUrl
              } else {
                console.error('Character image upload error:', uploadError)
              }
            }
          } catch (uploadErr) {
            console.error('Failed to upload character image:', uploadErr)
          }
        }

        return {
          book_id: book.id,
          name: c.name,
          role: c.role,
          description: c.description,
          image_url: imageUrl,
        }
      })
    )

    await adminSupabase.from('characters').insert(characterInserts)

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
