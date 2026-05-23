import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject, ZodSchema, ZodTypeAny } from "zod/v3";

interface SchemaWithParse {
    parse: (data: any) => any;
}
export const validate = <T>(schema: SchemaWithParse) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = schema.parse({
            body: req.body,
        })

        req.body = validatedData.body;
        next()
    } catch (error) {
        console.log(error, "error while validating data")
    }

}