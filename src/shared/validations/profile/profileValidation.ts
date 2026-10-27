
import { z } from "zod";

export const updateProfileSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(2, "First name must contain at least 2 characters")
            .max(50, "First name cannot exceed 50 characters")
            .optional(),

        lastName: z
            .string()
            .trim()
            .min(1, "Last name is required")
            .max(50, "Last name cannot exceed 50 characters")
            .optional(),

        phone: z
            .string()
            .trim()
            .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number")
            .optional(),

        profileImage: z
            .string()
            .url("Profile image must be a valid URL")
            .optional(),
    })

    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        { message: "Provide at least one field to update" }
    );

export type UpdateProfileDTO = z.infer<
    typeof updateProfileSchema
>;
