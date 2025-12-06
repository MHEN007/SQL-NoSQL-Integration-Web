import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = ['/products', '/products/:path*'];

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)

    if (!isProtectedRoute) {
        return NextResponse.next();
    } else {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth")?.value || "";
      let username = "";
      let id = "";
      if (token) {
          const decoded = jwt.decode(token) as any;
          username = decoded?.userName || "";
          id = decoded?.userId || "";
      }

      if (!token || !username || !id) {
          const loginUrl = new URL('/login', req.url);
          return NextResponse.redirect(loginUrl);
      }

      try {
          jwt.verify(token, process.env.JWT_SECRET!);
          return NextResponse.next();
      } catch (error) {
          const loginUrl = new URL('/login', req.url);
          return NextResponse.redirect(loginUrl);
      }
    }
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}