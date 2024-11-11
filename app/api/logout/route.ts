import { NextResponse } from "next/server";

export function GET(): NextResponse {
  const response = NextResponse.json({ message: "Logout Successfully!" });

  response.cookies.set("authToken", "", {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: 0,
  });

  return response;
}
