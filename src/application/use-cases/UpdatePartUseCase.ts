import { Part } from "../../domain/entities/Part";
import { PartRepository } from "../ports/PartRepository";

export class UpdatePartUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute(id: string, data: Partial<Part>): Promise<Part> {
        return this.repository.update(id, data);
    }
}