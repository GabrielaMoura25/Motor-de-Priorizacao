import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../../../shared/errors/AppError";

export const validate =
    (schema: ZodType) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(
                AppError.badRequest("Validation error", result.error.issues)
            );
        }

        req.body = result.data;
        next();
    };