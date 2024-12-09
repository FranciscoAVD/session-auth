import { eq } from "drizzle-orm";
import { db } from "./database";
import { sessionTable, TSession } from "./schema";

//TODO: Wrap db calls in try catch to handle unexpected errors

export async function addSession(
  userId: number,
  sessionId: string,
  expires: Date
): Promise<TSession> {
  const [session] = await db
    .insert(sessionTable)
    .values({ id: sessionId, userId: userId, expiresAt: expires })
    .returning();
  return session;
}

export async function getSession(
  sessionId: string
): Promise<TSession | undefined> {
  const [session] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId));
  return session;
}

export async function updateSession(
  sessionId: string,
  expiresAt: Date
): Promise<void> {
  await db
    .update(sessionTable)
    .set({ expiresAt: expiresAt })
    .where(eq(sessionTable.id, sessionId));
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}
