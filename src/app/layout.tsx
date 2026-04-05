import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import './globals.css'
import AccessibilityMenu from '@/components/ui/AccessibilityMenu'
import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'
import { siteMetadata } from '@/lib/metadata'
import { createClient } from '@/lib/supabase/server'

export const metadata = siteMetadata

export default async function RootLayout({ children }: { children: ReactNode }) {
  let isAuthenticated = false
  const requestHeaders = await headers()
  const isAdminHost = requestHeaders.get('x-crm-host') === 'admin'

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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-gray-900 focus:shadow-lg"
        >
          דלגו לתוכן הראשי
        </a>
        {!isAdminHost ? <Navbar initialIsAuthenticated={isAuthenticated} /> : null}
        <div id="main-content" tabIndex={-1} className={isAdminHost ? '' : 'mobile-container pb-24 md:pb-14'}>
          {children}
        </div>
        {!isAdminHost ? <Footer /> : null}
        {!isAdminHost ? <AccessibilityMenu /> : null}
      </body>
    </html>
  )
}
