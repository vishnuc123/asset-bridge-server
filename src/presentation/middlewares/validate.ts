import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject, ZodSchema, ZodTypeAny } from "zod/v3";

interface SchemaWithParse {
  parse: (data: any) => any;
}
export const validate = <T>(schema: SchemaWithParse) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })

        req.body = validatedData.body;
        req.query = validatedData.query;
        req.params = validatedData.params;
        next()
    } catch (error) {
        console.log(error, "error while validating data")
    }

}