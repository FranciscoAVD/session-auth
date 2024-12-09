import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
}).refine(
    (d)=> d.password === d.confirmPassword, 
    {
        message: "Passwords must match",
        path: ["password", "confirmPassword"]
    }
);

