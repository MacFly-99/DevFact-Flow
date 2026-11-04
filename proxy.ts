import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Store en mémoire pour le Rate Limiting global
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Rate Limiting Global
  // On récupère l'IP (Next.js la met dans le header x-forwarded-for en prod)
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const now = Date.now();
  const windowData = rateLimitMap.get(ip);

  if (windowData && now - windowData.lastReset < RATE_LIMIT_WINDOW) {
    if (windowData.count >= MAX_REQUESTS) {
      return new NextResponse("Trop de requêtes. Veuillez réessayer dans une minute.", { status: 429 });
    }
    windowData.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
  }

  // 2. Vérification de la session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthRoute = pathname === "/";
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/clients") || pathname.startsWith("/quotes") || pathname.startsWith("/invoices") || pathname.startsWith("/admin") || pathname.startsWith("/settings") || pathname.startsWith("/profile");

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Sécurité Super Admin
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