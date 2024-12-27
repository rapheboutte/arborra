import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Add debug logging to track middleware execution
function debugLog(req: any, message: string) {
  console.log(`[Middleware Debug] ${message}`, {
    path: req.nextUrl.pathname,
    method: req.method,
    hasToken: !!req.nextauth?.token
  });
}

export default withAuth(
  function middleware(req) {
    debugLog(req, 'Middleware executing');

    // Early return for /api/db/init
    if (req.nextUrl.pathname === '/api/db/init') {
      debugLog(req, 'Skipping auth for /api/db/init');
      return NextResponse.next();
    }

    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
    const isAdmin = token?.role === 'ADMIN';

    debugLog(req, `Auth status: ${isAuth}, Admin: ${isAdmin}`);

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        debugLog(req, `Checking authorization. Token exists: ${!!token}`);
        if (req.nextUrl.pathname === '/api/db/init') {
          debugLog(req, 'Authorizing /api/db/init without token');
          return true;
        }
        return !!token;
      },
    },
  }
);

// Update matcher to handle /api/db/init separately
export const config = {
  matcher: [
    // Protected routes that always require auth
    '/dashboard/:path*',
    '/admin/:path*',
    '/tasks/:path*',
    '/compliance/:path*',
    '/reports/:path*',
    '/login',
    
    // API routes excluding /api/db/init
    '/api/:function((?!db/init$).*)'
  ]
};
