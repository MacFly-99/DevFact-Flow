import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { limiters } from "@/lib/rate-limit";
import { ipAddress } from "@vercel/functions";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // On ne rate limite que les routes qui sont protégées
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/clients") || 
    pathname.startsWith("/quotes") || 
    pathname.startsWith("/invoices") || 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/settings") || 
    pathname.startsWith("/profile") ||
    pathname.startsWith("/expenses");

  if (isProtectedRoute) {
    // 1. On récupère l'IP de manière fiable grâce au package de Vercel
    const ip = ipAddress(request) || "127.0.0.1";

    // 2. On appelle le limiteur global
    const { success, limit, remaining, reset } = await limiters.global.limit(ip);

    if (!success) {
      return new NextResponse("Trop de requêtes. Veuillez réessayer dans une minute.", {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  // 3. Vérification de la session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthRoute = pathname === "/";

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Sécurité Super Admin
  if (pathname.startsWith("/admin")) {
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};