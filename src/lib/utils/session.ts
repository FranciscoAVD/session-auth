import { addSession, deleteSession, getSession } from "@/db/sessions";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { getOneWeekFromNow } from "@/lib/utils/general";
import { createSessionCookie, deleteSessionCookie, getSessionCookie } from "./cookies";

function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}
export function generateSessionId(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function executeSessionFlow(userId: number): Promise<void> {
  const token = generateSessionToken();
  const session = await addSession(
    userId,
    generateSessionId(token),
    getOneWeekFromNow()
  );
  createSessionCookie(token, session.expiresAt);
}

export async function isValidSession(): Promise<boolean> {
  const cookie = getSessionCookie();
  const token = cookie?.value;
  if (!token) return false;
  const session = await getSession(generateSessionId(token));
  if (!session) return false;
  if (session.expiresAt < new Date(Date.now())) {
    await deleteSession(session.id);
    deleteSessionCookie();
    return false;
  }
  return true;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await deleteSession(sessionId);
  deleteSessionCookie();
}