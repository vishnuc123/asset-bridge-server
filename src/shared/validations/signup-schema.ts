
import * as z from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "Minimum 3 characters are needed")
    .max(10, "Maximum 10 characters allowed")
    .regex(/^[A-Za-z]+$/, "Only letters allowed"),

  lastName: z
    .string()
    .trim()
    .min(3, "Minimum 3 characters are needed")
    .max(10, "Maximum 10 characters allowed")
    .regex(/^[A-Za-z]+$/, "Only letters allowed"),

  email: z
    .string()
    .trim()
    .email("Enter a proper email"),

  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .max(10, "Maximum 10 characters allowed")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
});

export type UserSignupData = z.infer<typeof signupSchema>;
