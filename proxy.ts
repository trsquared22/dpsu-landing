import { NextResponse, type NextRequest } from "next/server";

import { decryptSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Optimistic check only - redirects anonymous visitors away from /admin/*
// before render. The real authorization check happens in lib/dal.ts's
// verifySession(), called from every admin page/Server Action.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(token);

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
