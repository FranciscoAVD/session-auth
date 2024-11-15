import { eq } from "drizzle-orm";
import { db } from "./database";
import { TUser, userTable } from "./schema";
import { TSignInSchema } from "@/auth/actions";
import { hashPassword } from "@/auth/utils";

export async function isUser(data: TSignInSchema): Promise<boolean> {
    const user = await getUser(data.email);
    if(!user) return false;
    const hashed = await hashPassword(data.password, user.salt);
    return hashed.hashedPassword === user.password;
}

export async function getUser(email: string): Promise<TUser | undefined>{
    const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1)
    return user
}