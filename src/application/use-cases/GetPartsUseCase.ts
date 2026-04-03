import { Part } from "../../domain/entities/Part";
import { PartRepository } from "../ports/PartRepository";

export class GetPartsUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute(category?: string): Promise<Part[]> {
        if (category) {
            return this.repository.findByCategory(category);
        }
        return this.repository.findAll();
    }
}