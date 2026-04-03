import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { Logger } from "../../../shared/logging/Logger";

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof AppError) {
        Logger.error("AppError occurred", err, {
            path: req.path,
            method: req.method,
        });

        res.status(err.statusCode).json({
            message: err.message,
            ...(err.context ? { details: err.context } : {}),
        });
        return;
    }

    Logger.error("Unexpected error", err, {
        path: req.path,
        method: req.method,
    });

    res.status(500).json({ message: "Internal server error" });
}