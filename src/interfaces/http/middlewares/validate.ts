import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../../../shared/errors/AppError";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Validation error", 400, result.error.format());
    }

    req.body = result.data;
    next();
  };