import { PriorityCalculator } from "../../domain/services/PriorityCalculator";
import { PartRepository } from "../ports/PartRepository";

export class GetRestockPrioritiesUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute() {
        const parts = await this.repository.findAll();

        const priorities = PriorityCalculator.calculate(parts);

        return priorities;
    }
}