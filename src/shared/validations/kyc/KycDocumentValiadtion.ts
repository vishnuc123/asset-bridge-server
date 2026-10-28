import z from "zod";

export const KycDocumentSchema = z.object({
    type: z.enum(["passport", "adhaar", "selfie"]),
    // fileName: z.string().trim().min(1, "fileName is required").max(50, "fileName is too long"),
    FileType: z.enum(["image/jpeg", "application/pdf", "video/mp4"]),
    fileSize: z.number().int().positive().max(10 * 1024 * 1024, "max file size 10mb")
})

export type TkycDocumentInput = z.infer<typeof KycDocumentSchema>