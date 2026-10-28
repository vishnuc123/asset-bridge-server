import { z } from "zod";

export const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(2).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number")
      .optional(),

    gender: z
      .enum(["male", "female", "other", "prefer_not_to_say"])
      .optional(),

    dob: z.iso.date().optional(),

    nationality: z.string().trim().min(2).max(50).optional(),

    address: z.string().trim().min(5).max(250).optional(),

    profileImage: z.string().url().optional(),
  })
  .strict()
  .refine(
    (data) =>
      Object.values(data).some(
        (value) => value !== undefined && value !== ""
      ),
    { message: "Provide at least one field to update" }
  );

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;