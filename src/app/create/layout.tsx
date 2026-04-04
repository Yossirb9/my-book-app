import { ReactNode } from 'react'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'יצירת ספר חדש',
  description: 'בחירת נושא, דמויות, התאמה אישית ואישור לפני תחילת היצירה של הספר האישי שלכם.',
})

export default function CreateLayout({ children }: { children: ReactNode }) {
  return children
}
