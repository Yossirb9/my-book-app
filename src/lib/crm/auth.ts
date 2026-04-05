import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { buildAdminAppUrl } from '@/lib/crm/utils'
import { Tables } from '@/lib/supabase/database.types'

export type StaffUser = Tables<'staff_users'>

function getAllowlistedEmails() {
  const raw = process.env.ADMIN_ALLOWLIST_EMAILS || process.env.ADMIN_EMAIL || ''
  return raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

function isAllowlisted(email: string | undefined) {
  if (!email) return false
  return getAllowlistedEmails().includes(email.toLowerCase())
}

export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getCurrentStaffUser(options?: { redirectToLogin?: boolean; allowBootstrap?: boolean }) {
  const { redirectToLogin = true, allowBootstrap = true } = options || {}
  const user = await getAuthenticatedUser()

  if (!user) {
    if (redirectToLogin) {
      redirect(buildAdminAppUrl('/login'))
    }
    return null
  }

  const adminSupabase = await createAdminClient()

  let { data: staffUser } = await adminSupabase
    .from('staff_users')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  let canBootstrap = false

  if (!staffUser && allowBootstrap) {
    const { count } = await adminSupabase
      .from('staff_users')
      .select('*', { count: 'exact', head: true })

    // Let the very first staff member bootstrap the CRM even before
    // the allowlist is tuned in Vercel. After that, access falls back
    // to the explicit allowlist or existing staff membership.
    canBootstrap = count === 0 ? Boolean(user.email) : isAllowlisted(user.email)
  }

  if (!staffUser && canBootstrap) {
    const inserted = await adminSupabase
      .from('staff_users')
      .insert({
        auth_user_id: user.id,
        email: user.email!,
        role: 'owner',
        is_active: true,
        last_login_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    staffUser = inserted.data || null
  }

  if (!staffUser || !staffUser.is_active) {
    if (redirectToLogin) {
      redirect(buildAdminAppUrl('/login?error=unauthorized'))
    }
    return null
  }

  await adminSupabase
    .from('staff_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', staffUser.id)

  return { staffUser, user }
}

export async function requireStaffUser() {
  const session = await getCurrentStaffUser({ redirectToLogin: true })
  if (!session) {
    throw new Error('Staff session was not established')
  }
  return session
}

export async function requireStaffApiUser() {
  const session = await getCurrentStaffUser({ redirectToLogin: false })
  if (!session) {
    return null
  }
  return session
}
