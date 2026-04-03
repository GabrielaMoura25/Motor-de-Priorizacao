import { Part } from "../../domain/entities/Part";
import { PartRepository } from "../ports/PartRepository";
import { AppError } from "../../shared/errors/AppError";

export class UpdatePartUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute(id: string, data: Partial<Part>): Promise<Part> {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw AppError.notFound(`Part with id "${id}" not found`);
        }
        return this.repository.update(id, data);
    }
}