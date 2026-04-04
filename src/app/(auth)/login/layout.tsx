import { ReactNode } from 'react'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'כניסה לחשבון',
  description: 'כניסה לחשבון כדי לחזור לספרים, להמשיך יצירה או לערוך ספר קיים.',
})

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children
}
