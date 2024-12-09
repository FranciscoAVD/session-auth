"use server";

import {redirect} from "next/navigation"
import { addUser, getUser } from "@/db/users";
import { deleteSession, getSession } from "@/db/sessions";
import { cookies } from "next/headers";
import { env } from "@/env";
import { hashPassword, isSamePassword } from "@/lib/utils/encryption";
import { encodeSessionToken, executeSessionFlow } from "@/lib/utils/session";
import { deleteSessionCookie } from "@/lib/utils/cookies";
import { signInSchema, signUpSchema } from "../schemas";


type TAuthResponse = {
  success: boolean;
  errors: {
    email?: string[];
    password?: string[];
  };
};

export async function signIn(prevState:TAuthResponse, formData: FormData): Promise<TAuthResponse> {
  const formObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    formObject[key] = value.toString();
  });

  //Zod validation
  const { success, data, error } = signInSchema.safeParse(formObject);
  
  if (!success) return { success: false, errors: error.flatten().fieldErrors };

  //Validating user credentials
  const user = await getUser(data.email);
  if (!user || !user.password) {
    console.log("no user with that email")
    return {
      success: false,
      errors: { email: ["Email or password incorrect"], password: ["Email or password incorrect"] },
    };
  }
  const isMatch = await isSamePassword(user, data.password);
  if (!isMatch) {
    console.log("passwords did not match")
    return {
      success: false,
      errors: { email: ["Email or password incorrect"], password: ["Email or password incorrect"] },
    };
  }

  //Adding session record and creating cookie
  await executeSessionFlow(user.id);

  return { success: true, errors: {} };
}

export async function signOut(): Promise<void> {
  //get sessionId from cookie
  const cookie = cookies().get(env.SESSION_NAME);
  if (!cookie || !cookie.value) return;
  //validate session
  const sessionId = encodeSessionToken(cookie.value);
  const session = await getSession(sessionId);
  if (!session) return;
  //delete session record and cookie
  await deleteSession(session.id);
  deleteSessionCookie();
  redirect("/sign-in")
}

export async function signup(prevState:TAuthResponse, formData: FormData): Promise<TAuthResponse> {
  const formObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    formObject[key] = value.toString();
  });
  //Zod validation
  const { success, data, error } = signUpSchema.safeParse(formObject);
  // console.log("success: ",success, "data: ", data, "errors: ", JSON.stringify(error))
  if (!success) return { success: false, errors: error.flatten().fieldErrors };

  //Validating email uniqueness
  const existingUser = await getUser(data.email);
  if (existingUser) {
    return {
      success: false,
      errors: { email: ["Unable to create account"] },
    };
  }

  //Adding user record
  const hash = await hashPassword(data.password);
  const userId = await addUser({
    email: data.email,
    password: hash.hashedPassword,
    salt: hash.salt,
  });

  await executeSessionFlow(userId);
  return {
    success: true,
    errors: {},
  }
}
