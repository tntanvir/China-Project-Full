import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected sections: All of /dashboard, /admin, and /super-admin plus all their sub-routes
const protectedPrefixes = ["/dashboard", "/admin", "/super-admin"];

// Authentication pages: Users who are already signed in shouldn't see these
const authPrefixes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const authSession = request.cookies.get("auth_session")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken || authSession);

  // 1. Route Protection for Dashboard & Admin routes
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const redirectTarget = encodeURIComponent(`${pathname}${search}`);
      const loginUrl = new URL(`/login?redirect=${redirectTarget}`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based gatekeeper in middleware when role cookie is present
    if (userRole) {
      const normalizedRole = userRole.toUpperCase().replace(/[\s-]+/g, "_");

      // Customer trying to access Admin or Super-Admin paths
      if (normalizedRole === "CUSTOMER") {
        if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/super-admin" || pathname.startsWith("/super-admin/")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // Operations Admin trying to access Super-Admin paths
      if (normalizedRole === "ADMIN") {
        if (pathname === "/super-admin" || pathname.startsWith("/super-admin/")) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
    }
  }

  // 2. Auth Route Protection: If already authenticated, redirect away from /login, /register, etc.
  const isAuthRoute = authPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isAuthRoute && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");

    // If a valid safe internal redirect exists, honor it
    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//") &&
      !redirectParam.startsWith("/login") &&
      !redirectParam.startsWith("/register")
    ) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }

    // Otherwise redirect to their role dashboard
    const normalizedRole = userRole?.toUpperCase().replace(/[\s-]+/g, "_");
    let target = "/dashboard";
    if (normalizedRole === "SUPER_ADMIN") target = "/super-admin";
    else if (normalizedRole === "ADMIN") target = "/admin";

    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/super-admin",
    "/super-admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};

