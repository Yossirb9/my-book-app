import { NextRequest, NextResponse } from 'next/server'
import { createOrderForBook, recordActivity } from '@/lib/crm/service'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { Json } from '@/lib/supabase/database.types'
import { BookParams, OrderDraftInput } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const params: BookParams = body.params
    const orderDraft: OrderDraftInput = body.orderDraft || {
      deliveryOption: 'digital',
      promotionCode: '',
    }

    if (!params.template || !params.characters?.length) {
      return NextResponse.json({ error: 'Missing required params' }, { status: 400 })
    }
    if (params.template !== 'emotional_journal' && !params.length) {
      return NextResponse.json({ error: 'Missing required params' }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    const { data: book, error } = await adminSupabase
      .from('books')
      .insert({
        user_id: user.id,
        title: buildTitle(params),
        status: 'draft',
        params: params as unknown as Json,
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

    const characterInserts = await Promise.all(
      params.characters.map(async (character) => {
        let imageUrl: string | undefined

        if (character.imageUrl) {
          try {
            const base64Match = character.imageUrl.match(/^data:(.+);base64,(.+)$/)
            if (base64Match) {
              const mimeType = base64Match[1]
              const base64Data = base64Match[2]
              const buffer = Buffer.from(base64Data, 'base64')
              const ext = mimeType.split('/')[1]?.split('+')[0] || 'jpg'
              const filePath = `characters/${book.id}/${character.id}.${ext}`

              const { error: uploadError } = await adminSupabase.storage
                .from('book-images')
                .upload(filePath, buffer, { contentType: mimeType, upsert: true })

              if (!uploadError) {
                const { data: urlData } = adminSupabase.storage.from('book-images').getPublicUrl(filePath)
                imageUrl = urlData.publicUrl
              } else {
                console.error('Character image upload error:', uploadError)
              }
            }
          } catch (uploadError) {
            console.error('Failed to upload character image:', uploadError)
          }
        }

        return {
          book_id: book.id,
          name: character.name,
          role: character.role,
          description: character.description,
          image_url: imageUrl,
        }
      })
    )

    await adminSupabase.from('characters').insert(characterInserts)
    const { customer, order } = await createOrderForBook({
      user,
      book,
      orderDraft,
      params,
    })

    if (!customer) {
      throw new Error('Customer profile was not created')
    }

    await recordActivity({
      customerId: customer.id,
      orderId: order.id,
      bookId: book.id,
      actorType: 'customer',
      eventType: 'book.created',
      payload: {
        template: params.template,
        deliveryOption: orderDraft.deliveryOption,
      },
    })

    return NextResponse.json({ bookId: book.id, orderId: order.id })
  } catch (error) {
    console.error('Create book error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildTitle(params: BookParams) {
  const mainCharacter = params.characters.find((character) => character.role === 'main')
  const templates: Record<string, string> = {
    new_sibling: 'הספר של',
    birthday_child: 'יום הולדת שמח ל',
    potty_training: 'הגיבור של הגמילה',
    family_love: 'המשפחה של',
    emotional_journal: 'היומן של',
  }
  const base = templates[params.template] || 'הספר של'
  if (params.template === 'emotional_journal') {
    return mainCharacter ? `היומן של ${mainCharacter.name}` : 'היומן שלי'
  }
  return mainCharacter ? `${base} ${mainCharacter.name}` : 'הספר שלי'
}
