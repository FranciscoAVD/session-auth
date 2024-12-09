import { randomBytes } from "crypto";
import argon2 from "argon2";
const encoding: BufferEncoding = "base64" as const;
async function hashPassword(password: string, userSalt?: string): Promise<{
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
  test("hashPassword should produce consistent hashes when the same salt is provided", async () => {
    const password = "mySecretPassword";
  
    // Run the function without providing a salt
    const firstRun = await hashPassword(password);
    const generatedSalt = firstRun.salt;
  
    // Use the generated salt for the second run
    const secondRun = await hashPassword(password, generatedSalt);
  
    // Verify the hashes are identical
    expect(secondRun.hashedPassword).toBe(firstRun.hashedPassword);
  
    // Verify the salt is consistent
    expect(secondRun.salt).toBe(generatedSalt);
  });