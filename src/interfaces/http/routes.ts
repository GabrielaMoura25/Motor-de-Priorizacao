import { Router } from "express";
import { PartRepository } from "../../application/ports/PartRepository";

import { CreatePartUseCase } from "../../application/use-cases/CreatePartUseCase";
import { GetPartsUseCase } from "../../application/use-cases/GetPartsUseCase";
import { UpdatePartUseCase } from "../../application/use-cases/UpdatePartUseCase";
import { DeletePartUseCase } from "../../application/use-cases/DeletePartUseCase";
import { GetRestockPrioritiesUseCase } from "../../application/use-cases/GetRestockPrioritiesUseCase";

import { PartController } from "./controllers/PartController";
import { RestockController } from "./controllers/RestockController";
import { validate } from "./middlewares/validate";
import { createPartSchema, updatePartSchema } from "./validators/partSchemas";

/**
 * Factory que constrói o Router da API injetando o repositório.
 * Desta forma a camada de rotas não conhece implementações concretas de infra.
 */
export function makePartRouter(repository: PartRepository): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  const partController = new PartController(
    new CreatePartUseCase(repository),
    new GetPartsUseCase(repository),
    new UpdatePartUseCase(repository),
    new DeletePartUseCase(repository)
  );

  const restockController = new RestockController(
    new GetRestockPrioritiesUseCase(repository)
  );

  router.post("/parts", validate(createPartSchema), (req, res, next) =>
    partController.create(req, res, next)
  );
  router.get("/parts", (req, res, next) => partController.list(req, res, next));
  router.put("/parts/:id", validate(updatePartSchema), (req, res, next) =>
    partController.update(req as Parameters<typeof partController.update>[0], res, next)
  );
  router.delete("/parts/:id", (req, res, next) =>
    partController.delete(req as Parameters<typeof partController.delete>[0], res, next)
  );

  router.get("/restock/priorities", (req, res, next) =>
    restockController.getPriorities(req, res, next)
  );

  return router;
}