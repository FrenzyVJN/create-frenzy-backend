import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./error.middleware";

/**
 * Generic validation middleware using Zod
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 * 
 * Usage:
 * router.post('/endpoint', validate(mySchema), controller)
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            const errorMessage = error.errors
                ?.map((e: any) => `${e.path.join(".")}: ${e.message}`)
                .join(", ") || "Validation failed";

            next(new AppError(errorMessage, 400));
        }
    };
};
