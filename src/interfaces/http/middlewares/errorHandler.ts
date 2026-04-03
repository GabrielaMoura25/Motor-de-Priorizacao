import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { Logger } from "../../../shared/logging/Logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    Logger.error("AppError occurred", err, {
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  Logger.error("Unexpected error", err);

  return res.status(500).json({
    message: "Internal server error",
  });
}