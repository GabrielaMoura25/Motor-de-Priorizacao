import { NextFunction, Request, Response } from "express";
import { GetRestockPrioritiesUseCase } from "../../../application/use-cases/GetRestockPrioritiesUseCase";

export class RestockController {
  constructor(private readonly useCase: GetRestockPrioritiesUseCase) {}

  async getPriorities(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const priorities = await this.useCase.execute();
      res.json({ priorities });
    } catch (err) {
      next(err);
    }
  }
}