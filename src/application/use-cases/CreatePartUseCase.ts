import { Part } from "../../domain/entities/Part";
import { PartRepository } from "../ports/PartRepository";

export class CreatePartUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute(data: Part): Promise<Part> {
        return this.repository.create(data);
    }
}