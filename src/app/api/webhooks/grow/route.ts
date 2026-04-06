import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Only process successful, completed payments
    if (body.status !== '1' || body.data?.statusCode !== '2') {
      return NextResponse.json({ received: true })
    }

    // Verify the webhook key matches what Grow configured
    const expectedKey = process.env.GROW_WEBHOOK_KEY
    if (expectedKey && body.data?.webhookKey !== expectedKey) {
      console.error('Grow webhook: invalid webhook key')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payerEmail: string | undefined = body.data?.payerEmail
    if (!payerEmail) {
      console.error('Grow webhook: missing payerEmail in payload')
      return NextResponse.json({ received: true })
    }

    const adminSupabase = await createAdminClient()

    // Find the user via customer_profiles (created during create-pending)
    const { data: profile } = await adminSupabase
      .from('customer_profiles')
      .select('auth_user_id')
      .filter('email', 'ilike', payerEmail)
      .limit(1)
      .single()

    if (!profile?.auth_user_id) {
      console.error('Grow webhook: no customer profile found for email', payerEmail)
      return NextResponse.json({ received: true })
    }

    // Find the most recent unpaid draft book for this user
    const { data: book } = await adminSupabase
      .from('books')
      .select('id')
      .eq('user_id', profile.auth_user_id)
      .eq('paid', false)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!book) {
      console.error('Grow webhook: no pending book found for user', profile.auth_user_id)
      return NextResponse.json({ received: true })
    }

    await adminSupabase
      .from('books')
      .update({ paid: true })
      .eq('id', book.id)

    console.log('Grow webhook: book', book.id, 'marked as paid for', payerEmail)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Grow webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
