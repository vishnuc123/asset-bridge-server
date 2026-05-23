import * as x from "zod"

export const signupSchema = x.object({
    body: x.object({
        firstName: x.string().min(3, "minimum 3 character is needed").max(10, "max 10 characters allowed").regex(/^[A-Za-z]+$/, "only letters allowed").trim(),
        lastName: x.string().min(3, "minimum 3 character is needed").max(10, "max 10 characters allowed").regex(/^[A-Za-z]+$/, "only letters allowed").trim(),
        email: x.string().email("enter proper email").trim(),
        password: x.string().min(6, "minimum 6 character").max(10, "maximum 10 character allowed").trim()
            .regex(/[A-Z]/, "Must include at least one uppercase letter")
            .regex(/[a-z]/, "Must include at least one lowercase letter")
            .regex(/[0-9]/, "Must include at least one number"),
    }),

})
export type userSignupData = x.infer<typeof signupSchema>
