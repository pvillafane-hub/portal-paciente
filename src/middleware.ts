
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const session = request.cookies.get("pp_session")?.value
  const { pathname } = request.nextUrl

  // 🔐 Rutas protegidas
  const protectedRoutes = [
    "/dashboard",
    "/upload",
    "/view",
    "/share"
  ]

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // 🚫 Bloquear acceso si no hay sesión
  if (isProtected && (!session || session.length === 0)) {

    const loginUrl = new URL("/", request.url)
    loginUrl.searchParams.set("auth", "required")

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/view/:path*",
    "/share/:path*"
  ],
}