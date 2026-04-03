import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'הספר שלי — ספרים מותאמים אישית עם AI',
  description: 'צרו ספר ילדים מאויר עם הדמויות שלכם',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-dvh">
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  )
}
