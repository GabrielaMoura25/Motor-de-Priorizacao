import { Part } from "../../domain/entities/Part";

/** Dados necessários para criar uma peça — sem o `id`, gerado automaticamente pelo banco. */
export type CreatePartDTO = Omit<Part, "id">;
