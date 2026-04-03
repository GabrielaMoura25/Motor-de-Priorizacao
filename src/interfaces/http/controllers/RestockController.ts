import { Request, Response } from "express";
import { GetRestockPrioritiesUseCase } from "../../../application/use-cases/GetRestockPrioritiesUseCase";

export class RestockController {
  constructor(private readonly useCase: GetRestockPrioritiesUseCase) {}

  async getPriorities(req: Request, res: Response) {
    const priorities = await this.useCase.execute();

    return res.json({ priorities });
  }
}