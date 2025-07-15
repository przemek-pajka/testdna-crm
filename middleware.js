// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("auth")?.value === "true";

  /* 0. Omijamy zasoby statyczne /_next, favicon, grafiki, CSS … */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(?:css|js|png|jpg|jpeg|svg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  /* 1. Publiczne ścieżki UI  */
  const PUBLIC_UI = ["/login", "/register"];
  if (PUBLIC_UI.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  /* 2. Publiczne endpointy API  */
  const PUBLIC_API = ["/api/login", "/api/register", "/api/auth"];
  if (PUBLIC_API.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  /* 3. Blokada API: brak logowania → 401  */
  if (pathname.startsWith("/api") && !isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  /* 4. Blokada dashboardu: brak logowania → /  */
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  /* 5. Zalogowany na "/" → /dashboard  */
  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /* 6. Domyślnie przepuszczamy dalej */
  return NextResponse.next();
}

/* Zakres działania middleware */
export const config = {
  matcher: [
    "/",                 // strona główna
    "/login",            // strony publiczne
    "/register",
    "/dashboard/:path*", // cały dashboard
    "/api/:path*",       // wszystkie endpointy API
  ],
};
