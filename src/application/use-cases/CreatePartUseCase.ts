import { Part } from "../../domain/entities/Part";
import { PartRepository } from "../ports/PartRepository";
import { CreatePartDTO } from "../dtos/CreatePartDTO";

export class CreatePartUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute(data: CreatePartDTO): Promise<Part> {
        return this.repository.create(data);
    }
}