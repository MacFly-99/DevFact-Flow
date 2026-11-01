import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthRoute = pathname === "/";
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/clients") || pathname.startsWith("/quotes") || pathname.startsWith("/admin");

  // Si connecté et sur le login -> Dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si NON connecté et sur une page protégée -> Login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🛑 Sécurité Super Admin
  if (pathname.startsWith("/admin")) {
    // On force le type car Better Auth ne connait pas encore "role" dans ses types
    if (session?.user?.role !== "ADMIN") {
      // Si pas admin, on le renvoie vers son dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};