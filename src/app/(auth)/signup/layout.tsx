import { ReactNode } from 'react'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'פתיחת חשבון',
  description: 'פתיחת חשבון כדי לשמור ספרים, לחזור ליצירות ולנהל את האזור האישי.',
})

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children
}
