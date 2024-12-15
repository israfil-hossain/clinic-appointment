import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.SECRET);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/" || path === "/doctors";
  const token = request.cookies.get("authToken")?.value;

  // If no token and not a public path, redirect to login page
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      await jwtVerify(token, secret); // This will automatically handle expiration
      if (isPublicPath && path === "/") {
        // If user is logged in and tries to visit the home page, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    } catch (err) {
      console.error("JWT Error:", err);
      // On token verification error, redirect to home with invalid session
      const url = new URL("/", request.url);
      url.searchParams.set("session", "invalid");
      return NextResponse.redirect(url);
    }
  }

  // No token on protected route, redirect to login
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/doctors", "/dashboard"],
};
