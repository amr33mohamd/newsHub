import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for OPTIMISTIC route protection (UX layer only)
 *
 * IMPORTANT: This is NOT the primary security mechanism!
 * - Provides quick redirects for better UX
 * - Real security is enforced in the Data Access Layer (DAL)
 * - Server Components and Actions must verify auth independently
 *
 * Based on Next.js 15 best practices:
 * https://nextjs.org/docs/app/guides/authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies (optimistic check)
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;

  // Define protected routes (require authentication)
  const protectedRoutes = ['/preferences'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Define guest-only routes (redirect if authenticated)
  const guestOnlyRoutes = ['/login', '/register'];
  const isGuestOnlyRoute = guestOnlyRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from guest-only routes to home
  if (isGuestOnlyRoute && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, *.png, *.svg, etc. (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)',
  ],
};
