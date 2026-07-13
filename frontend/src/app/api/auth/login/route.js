import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_VALUE,
  isValidCredentials,
} from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, detail: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = body?.email;
  const password = body?.password;

  if (!isValidCredentials(email, password)) {
    return NextResponse.json(
      { ok: false, detail: "Invalid email or password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    detail: "Authenticated.",
  });

  response.cookies.set({
    name: AUTH_COOKIE,
    value: AUTH_COOKIE_VALUE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
