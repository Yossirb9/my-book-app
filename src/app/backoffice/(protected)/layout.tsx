import { ReactNode } from 'react'
import AdminShell from '@/components/crm/AdminShell'
import { requireStaffUser } from '@/lib/crm/auth'

export default async function BackofficeProtectedLayout({ children }: { children: ReactNode }) {
  const { staffUser } = await requireStaffUser()

  return <AdminShell email={staffUser.email} role={staffUser.role}>{children}</AdminShell>
}
