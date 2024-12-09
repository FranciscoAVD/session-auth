import { TUser } from "@/db/schema";
import argon2 from "argon2";
import { randomBytes } from "crypto";

const encoding: BufferEncoding = "base64" as const;
async function hashPassword(
  password: string,
  userSalt?: string
): Promise<{
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
function bufferToString(buffer: Buffer): string {
  return buffer.toString(encoding);
}

function stringToBuffer(str: string): Buffer {
  return Buffer.from(str, encoding);
}
async function isSamePassword(
  user: TUser,
  unverifiedPassword: string
): Promise<boolean> {
  return await argon2.verify(user.password, unverifiedPassword, {
    secret: stringToBuffer(user.salt),
  });
}

test("isSamePassword", async () => {
  const password = "mySecretPassword";

  const hash = await hashPassword(password);

  const user = {
    id: "1",
    email: "email@example.com",
    emailVerified: false,
    password: hash.hashedPassword,
    salt: hash.salt,
  };
  const match = await isSamePassword(user, password);
  expect(match).toBe(true);
});
