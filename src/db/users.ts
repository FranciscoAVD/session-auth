import { eq } from "drizzle-orm";
import { db } from "./database";
import { TUser, userTable } from "./schema";

//TODO: Wrap db calls in try catch to handle unexpected errors

export async function getUser(email: string): Promise<TUser | undefined> {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);
  return user || undefined;
}

export async function addUser(data: {
  email: string;
  password: string;
}): Promise<number> {
  const [userId] = await db
    .insert(userTable)
    .values({ email: data.email, password: data.password })
    .returning({ id: userTable.id });
  return userId.id;
}

export async function updateUserPassword(
  userId: number,
  newPassword: string,
): Promise<void> {
  await db
    .update(userTable)
    .set({ password: newPassword })
    .where(eq(userTable.id, userId));
}

export async function deleteUser(userId: number) {
  await db.delete(userTable).where(eq(userTable.id, userId));
}
