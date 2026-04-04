import HomePageContent from '@/components/home/HomePageContent'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'ספרי ילדים אישיים עם AI',
  description:
    'ספרי ילדים מותאמים אישית בעברית עם דמויות אמיתיות, תהליך יצירה מודרך, תצוגת אישור לפני יצירה ו-PDF להורדה.',
})

export default function HomePage() {
  return <HomePageContent />
}
