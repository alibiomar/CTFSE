import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Prevent redirect loops
  const redirectCount = Number(req.headers.get("x-redirect-count") || "0")
  if (redirectCount > 3) {
    return NextResponse.redirect(new URL("/error?message=too-many-redirects", req.url), {
      status: 307,
    })
  }
  res.headers.set("x-redirect-count", String(redirectCount + 1))

  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {

    if (req.nextUrl.pathname === "/admin/login") {
      return res
    }
    return NextResponse.redirect(new URL("/admin/login?error=config", req.url), {
      status: 307,
    })
  }

  // Allow /admin/login without session checks
  if (req.nextUrl.pathname === "/admin/login") {
    res.headers.set("x-skip-admin-check", "true")
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      return NextResponse.redirect(new URL("/admin/login?error=auth-failed", req.url), {
        status: 307,
      })
    }

    // Redirect unauthenticated users to login
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login?redirected=true", req.url), {
        status: 307,
      })
    }

    // Admin check is handled in AdminLayout
    return res
  } catch (error) {

    return NextResponse.redirect(new URL("/admin/login?error=auth-failed", req.url), {
      status: 307,
    })
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}