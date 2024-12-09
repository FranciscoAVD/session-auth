
import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function isSamePassword(userPassword:string, unverifiedPassword: string): Promise<boolean> {
  return await argon2.verify(userPassword, unverifiedPassword);
}