import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function GET() {
  const response = NextResponse.redirect("http://localhost:3000/login");

  response.headers.append(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    })
  );

  response.headers.append(
    "Set-Cookie",
    serialize("userId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    })
  );

  return response;
}
