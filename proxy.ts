import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Il n'y a plus que "/" qui est public
  const isAuthRoute = pathname === "/"; 
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/clients") || pathname.startsWith("/quotes");

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};