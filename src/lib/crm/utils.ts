import { DEFAULT_ADMIN_HOST } from '@/lib/crm/constants'

export function normalizeHost(host: string | null | undefined) {
  return (host || '').trim().toLowerCase()
}

export function getConfiguredAdminHosts() {
  const configured = process.env.ADMIN_APP_HOSTS || process.env.ADMIN_APP_HOST || DEFAULT_ADMIN_HOST

  return configured
    .split(',')
    .map((value) => normalizeHost(value))
    .filter(Boolean)
}

export function isAdminHost(host: string | null | undefined) {
  const normalized = normalizeHost(host)
  if (!normalized) return false

  return getConfiguredAdminHosts().some((allowed) => {
    if (allowed === normalized) return true
    const withoutPort = normalized.split(':')[0]
    const allowedWithoutPort = allowed.split(':')[0]
    return withoutPort === allowedWithoutPort
  })
}

export function buildPublicAppUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return new URL(path, base).toString()
}

export function buildAdminAppUrl(path = '/') {
  const configured = getConfiguredAdminHosts()[0] || DEFAULT_ADMIN_HOST
  const protocol = configured.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${configured}${path}`
}

export function formatCurrency(amount: number, currency = 'ILS') {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

export function sanitizeFilenamePart(value: string) {
  return value.replace(/[^\w\u0590-\u05FF-]+/g, '_').replace(/^_+|_+$/g, '')
}
