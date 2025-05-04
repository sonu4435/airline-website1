import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwtToken, hasRole } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/auth" || path === "/check-in" || path.startsWith("/api/check-in")

  // Define admin paths that require admin role
  const isAdminPath = path.startsWith("/admin") || path.startsWith("/api/admin")

  // Define airline staff paths that require airline_staff role
  const isAirlineStaffPath = path.startsWith("/airline") || path.startsWith("/api/airline")

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value || ""

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // If the path is login/signup and there's a token, verify it
  if (isPublicPath && token && path !== "/check-in" && !path.startsWith("/api/check-in")) {
    try {
      // Verify the token
      const payload = await verifyJwtToken(token)

      // If valid, redirect to dashboard
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // If invalid, continue to the login page
      console.error("Invalid token:", error)
    }
  }

  // Check role-based access for protected paths
  if ((isAdminPath || isAirlineStaffPath) && token) {
    try {
      const payload = await verifyJwtToken(token)

      if (!payload) {
        return NextResponse.redirect(new URL("/auth", request.url))
      }

      // Check if user has admin role for admin paths
      if (isAdminPath && !hasRole(["admin"], payload.role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Check if user has airline_staff role for airline staff paths
      if (isAirlineStaffPath && !hasRole(["admin", "airline_staff"], payload.role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      console.error("Error verifying token:", error)
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/",
    "/auth",
    "/dashboard/:path*",
    "/bookings/:path*",
    "/flights/:path*",
    "/check-in/:path*",
    "/admin/:path*",
    "/airline/:path*",
    "/api/admin/:path*",
    "/api/airline/:path*",
  ],
}
