import { PartRepository } from "../ports/PartRepository";

export class DeletePartUseCase {
    constructor(private readonly repository: PartRepository) {}
    execute(id: string): Promise<void> {
        return this.repository.delete(id);
    }
}