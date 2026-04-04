import { cache } from 'react'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export const getBookById = cache(async (id: string) => {
  const sessionClient = await createClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!user) {
    return null
  }

  const supabase = await createAdminClient()
  const { data: book } = await supabase
    .from('books')
    .select('*, book_pages(*), characters(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return book
})
