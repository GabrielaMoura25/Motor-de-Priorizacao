import { NextFunction, Request, Response } from "express";
import { Logger } from "../../../shared/logging/Logger";

/** Loga método, path e query de cada requisição recebida. */
export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
    Logger.info("Incoming request", {
        method: req.method,
        path: req.path,
        query: req.query as Record<string, unknown>,
    });
    next();
}
