import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/email-accounts'];
  const pathname = request.nextUrl.pathname;

  // Check if route needs protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Check for session token in cookies
    const sessionToken = request.cookies.get('session-token')?.value;
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT token
      jwt.verify(sessionToken, jwtSecret);
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
