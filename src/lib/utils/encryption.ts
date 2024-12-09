import { TUser } from "@/db/schema";
import argon2 from "argon2";
import { randomBytes } from "crypto";

const encoding: BufferEncoding = "base64" as const;
export async function hashPassword(password: string, userSalt?: string): Promise<{
  hashedPassword: string;
  salt: string;
}> {
  const salt = userSalt ? stringToBuffer(userSalt) : randomBytes(16);
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    salt,
    parallelism: 1,
  });
  return { hashedPassword: hash, salt: bufferToString(salt) };
}

export function bufferToString(buffer: Buffer): string {
  
  return buffer.toString(encoding);
}

export function stringToBuffer(str: string): Buffer {
  return Buffer.from(str, encoding);
}

//TODO: has to be tested
export async function isSamePassword(user: TUser, unverifiedPassword: string): Promise<boolean> {
  return await argon2.verify(user.password, unverifiedPassword, {
    secret: stringToBuffer(user.salt),
  });
}