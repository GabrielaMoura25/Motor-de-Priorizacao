import { Router } from "express";
import { PrismaPartRepository } from "../repository/PrismaPartRepository";
import { makePartRouter } from "../../interfaces/http/routes";

/**
 * Composition root da aplicação.
 * Instancia as dependências concretas de infra e injeta nas camadas superiores.
 */
export function makeRouter(): Router {
    const repository = new PrismaPartRepository();
    return makePartRouter(repository);
}
