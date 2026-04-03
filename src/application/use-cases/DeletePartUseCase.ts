import { PartRepository } from "../ports/PartRepository";
import { AppError } from "../../shared/errors/AppError";

export class DeletePartUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute(id: string): Promise<void> {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw AppError.notFound(`Part with id "${id}" not found`);
        }
        return this.repository.delete(id);
    }
}