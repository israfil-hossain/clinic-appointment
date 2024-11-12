import { jwtVerify, JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.SECRET);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/" || path === "/doctors";
  const token = request.cookies.get("authToken")?.value;

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      await jwtVerify(token, secret); // This verifies `exp` automatically
      if (isPublicPath && path === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    } catch (err) {
      console.error("JWT Error:", err);
      const url = new URL("/", request.url);
      url.searchParams.set("session", "invalid");
      return NextResponse.redirect(url);
    }
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/doctors", "/dashboard"],
};
