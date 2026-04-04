import type { ReactNode } from 'react'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import { siteMetadata } from '@/lib/metadata'
import { createClient } from '@/lib/supabase/server'

export const metadata = siteMetadata

export default async function RootLayout({ children }: { children: ReactNode }) {
  let isAuthenticated = false

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    isAuthenticated = Boolean(user)
  } catch {
    isAuthenticated = false
  }

  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-dvh">
        <Navbar initialIsAuthenticated={isAuthenticated} />
        <div className="mobile-container">{children}</div>
      </body>
    </html>
  )
}
