import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Auth pages - redirect to dashboard if logged in
  if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protected routes - redirect to login if not logged in
  const protectedPaths = ['/dashboard', '/clouds', '/agents', '/chains', '/security', '/marketplace', '/api-keys', '/settings', '/billing', '/activity'];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
