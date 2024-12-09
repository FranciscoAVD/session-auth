import { NextRequest, NextResponse } from "next/server";
import { isInRoute } from "@/lib/utils/general";
import { env } from "./env";
const authRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/dashboard"];
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthRoute = isInRoute(authRoutes, path);
  const isPrivateRoute = isInRoute(privateRoutes, path);

  const sessionId = req.cookies.get(env.SESSION_NAME)?.value;
  if (sessionId && isAuthRoute) {
    console.log("cookie and is an auth route")
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  if (!sessionId && isPrivateRoute) {
    console.log("no cookie and is a protected route")
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  return NextResponse.next();
}
