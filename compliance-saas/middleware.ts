import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    
    // If the user is authenticated and trying to access auth pages, redirect to home
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Protect organization-specific routes
    if (req.nextUrl.pathname.startsWith("/api/organizations")) {
      const urlOrgId = req.nextUrl.pathname.split("/")[3];
      if (urlOrgId && urlOrgId !== token?.organizationId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/api/organizations/:path*",
    "/api/settings/:path*",
    "/api/users/:path*",
    "/api/tasks/:path*",
    "/api/documents/:path*",
    "/auth/:path*"
  ]
};
