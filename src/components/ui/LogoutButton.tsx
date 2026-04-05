'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type LogoutButtonProps = {
  className?: string
  children?: React.ReactNode
}

export default function LogoutButton({ className, children = 'התנתקות' }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {children}
    </button>
  )
}
