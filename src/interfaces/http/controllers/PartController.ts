import { NextFunction, Request, Response } from "express";
import { CreatePartUseCase } from "../../../application/use-cases/CreatePartUseCase";
import { GetPartsUseCase } from "../../../application/use-cases/GetPartsUseCase";
import { UpdatePartUseCase } from "../../../application/use-cases/UpdatePartUseCase";
import { DeletePartUseCase } from "../../../application/use-cases/DeletePartUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { listPartsQuerySchema } from "../validators/partSchemas";

export class PartController {
    constructor(
        private readonly createUseCase: CreatePartUseCase,
        private readonly getUseCase: GetPartsUseCase,
        private readonly updateUseCase: UpdatePartUseCase,
        private readonly deleteUseCase: DeletePartUseCase
    ) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const part = await this.createUseCase.execute(req.body);
            res.status(201).json(part);
        } catch (err) {
            next(err);
        }
    }

    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const parsedQuery = listPartsQuerySchema.safeParse(req.query);

            if (!parsedQuery.success) {
                return next(AppError.badRequest("Invalid query parameters", parsedQuery.error.issues));
            }

            const result = await this.getUseCase.execute(parsedQuery.data);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async update(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const part = await this.updateUseCase.execute(req.params.id, req.body);
            res.json(part);
        } catch (err) {
            next(err);
        }
    }

    async delete(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await this.deleteUseCase.execute(req.params.id);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
}