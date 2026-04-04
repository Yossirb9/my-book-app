import type { Metadata } from 'next'

const SITE_NAME = 'הספר שלי'
const DEFAULT_DESCRIPTION =
  'יוצרים ספרי ילדים אישיים בעברית עם הדמויות האמיתיות שלכם, תהליך מודרך, PDF להורדה ותוצאה שמרגישה כמו מתנה אמיתית.'

function getMetadataBase() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  try {
    return new URL(baseUrl)
  } catch {
    return new URL('http://localhost:3000')
  }
}

export const siteMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['ספר ילדים אישי', 'ספר מותאם אישית', 'AI בעברית', 'ספר ילדים עם תמונות'],
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'he_IL',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
}

export function buildMetadata({
  title,
  description,
}: {
  title: string
  description?: string
}): Metadata {
  return {
    title,
    description: description ?? DEFAULT_DESCRIPTION,
    openGraph: {
      title,
      description: description ?? DEFAULT_DESCRIPTION,
    },
    twitter: {
      title,
      description: description ?? DEFAULT_DESCRIPTION,
    },
  }
}
