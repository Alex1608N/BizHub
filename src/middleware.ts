import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // Rute protejate (tot ce e în dashboard)
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/catalog') ||
    request.nextUrl.pathname.startsWith('/audit') ||
    request.nextUrl.pathname.startsWith('/unitati') ||
    request.nextUrl.pathname.startsWith('/utilizatori') ||
    request.nextUrl.pathname.startsWith('/settings');

  if (!sessionId && isProtectedRoute) {
    // Redirecționăm către login dacă nu există sesiune
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionId && isLoginPage) {
    // Redirecționăm către dashboard dacă este deja logat
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
