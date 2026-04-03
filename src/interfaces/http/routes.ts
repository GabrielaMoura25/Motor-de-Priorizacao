import express from "express";

import { PrismaPartRepository } from "../../infra/repository/PrismaPartRepository";

import { CreatePartUseCase } from "../../application/use-cases/CreatePartUseCase";
import { GetPartsUseCase } from "../../application/use-cases/GetPartsUseCase";
import { UpdatePartUseCase } from "../../application/use-cases/UpdatePartUseCase";
import { DeletePartUseCase } from "../../application/use-cases/DeletePartUseCase";
import { GetRestockPrioritiesUseCase } from "../../application/use-cases/GetRestockPrioritiesUseCase";

import { PartController } from "./controllers/PartController";
import { RestockController } from "./controllers/RestockController";

const router = express.Router();

const repository = new PrismaPartRepository();

const createUseCase = new CreatePartUseCase(repository);
const getUseCase = new GetPartsUseCase(repository);
const updateUseCase = new UpdatePartUseCase(repository);
const deleteUseCase = new DeletePartUseCase(repository);
const restockUseCase = new GetRestockPrioritiesUseCase(repository);

const partController = new PartController(
  createUseCase,
  getUseCase,
  updateUseCase,
  deleteUseCase
);

const restockController = new RestockController(restockUseCase);

router.post("/parts", (req, res) => partController.create(req, res));
router.get("/parts", (req, res) => partController.list(req, res));
router.put("/parts/:id", (req, res) => partController.update(req, res));
router.delete("/parts/:id", (req, res) => partController.delete(req, res));

router.get("/restock/priorities", (req, res) =>
  restockController.getPriorities(req, res)
);

export default router;