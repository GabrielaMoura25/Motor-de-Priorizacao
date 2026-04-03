import { Request, Response } from 'express';
import { CreatePartUseCase } from '../../../application/use-cases/CreatePartUseCase';
import { GetPartsUseCase } from '../../../application/use-cases/GetPartsUseCase';
import { UpdatePartUseCase } from '../../../application/use-cases/UpdatePartUseCase';
import { DeletePartUseCase } from '../../../application/use-cases/DeletePartUseCase';

export class PartController {
  constructor(
    private readonly createUseCase: CreatePartUseCase,
    private readonly getUseCase: GetPartsUseCase,
    private readonly updateUseCase: UpdatePartUseCase,
    private readonly deleteUseCase: DeletePartUseCase
  ) {}

  async create(req: Request, res: Response) {
    const part = await this.createUseCase.execute(req.body);
    return res.status(201).json(part);
  }

  async list(req: Request, res: Response) {
    const { category } = req.query;

    const parts = await this.getUseCase.execute(
      category as string | undefined
    );

    return res.json(parts);
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const part = await this.updateUseCase.execute(id, req.body);

    return res.json(part);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    await this.deleteUseCase.execute(id);

    return res.sendStatus(204);
  }
}