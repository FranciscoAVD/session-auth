import { TSession } from "@/db/schema";
import { env } from "@/env";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { getOneWeekFromNow } from "@/lib/utils/general";

export function createSessionCookie(token: string, expires: Date): void {
    cookies().set(env.SESSION_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      expires: expires,
      secure: env.NODE_ENV === "production"
    })
  }
  export function getSessionCookie(): RequestCookie | undefined {
    return cookies().get(env.SESSION_NAME);
  }
  export function updateSessionCookie(session: TSession): void {
    cookies().set(env.SESSION_NAME, session.id, {
      httpOnly: true,
      sameSite: "lax",
      expires: getOneWeekFromNow(),
      secure: env.NODE_ENV === "production"
    })
  }
  export function deleteSessionCookie(): void {
    cookies().delete(env.SESSION_NAME);
  }