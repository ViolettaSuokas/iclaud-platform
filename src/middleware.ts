import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow these paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('authjs.session-token') ||
                        request.cookies.get('__Secure-authjs.session-token');

  // Protected routes need session
  const protectedPaths = ['/dashboard', '/clouds', '/agents', '/chains', '/security', '/marketplace', '/api-keys', '/settings', '/billing', '/activity'];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
