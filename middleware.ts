import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/email-accounts'];
  const pathname = request.nextUrl.pathname;

  // Check if route needs protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // For MVP, we'll implement basic auth check
    // In production, verify JWT token here
    const hasAuth = request.cookies.get('auth-token')?.value || 
                    request.headers.get('authorization');

    if (!hasAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
