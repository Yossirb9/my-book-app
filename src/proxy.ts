import { NextRequest, NextResponse } from 'next/server'
import { isAdminHost } from '@/lib/crm/utils'

const INTERNAL_ADMIN_PREFIX = '/backoffice'

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')
  const adminHost = isAdminHost(host)
  const pathname = request.nextUrl.pathname

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-crm-host', adminHost ? 'admin' : 'public')

  if (!adminHost && pathname.startsWith(INTERNAL_ADMIN_PREFIX)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (adminHost && !pathname.startsWith('/api/') && !pathname.startsWith(INTERNAL_ADMIN_PREFIX)) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = `${INTERNAL_ADMIN_PREFIX}${pathname === '/' ? '' : pathname}`

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
