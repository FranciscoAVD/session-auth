import { addSession } from "@/db/sessions";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { getOneWeekFromNow } from "@/lib/utils/general";
import { createSessionCookie } from "./cookies";

function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}
export function encodeSessionToken(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function executeSessionFlow(userId: number): Promise<void>{
  const token = generateSessionToken();
  const session = await addSession(
    userId,
    encodeSessionToken(token),
    getOneWeekFromNow()
  );
  createSessionCookie(token, session.expiresAt);
}