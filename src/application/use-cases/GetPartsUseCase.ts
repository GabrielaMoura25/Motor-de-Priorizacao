import { Part } from "../../domain/entities/Part";
import { ListPartsQueryDTO } from "../dtos/ListPartsQueryDTO";
import { PaginatedResult } from "../dtos/PaginatedResult";
import { PartRepository } from "../ports/PartRepository";

export class GetPartsUseCase {
    constructor(private readonly repository: PartRepository) {}

    async execute(query: ListPartsQueryDTO): Promise<PaginatedResult<Part>> {
        const skip = (query.page - 1) * query.limit;
        const take = query.limit;

        const [items, total] = await Promise.all([
            this.repository.findPage({ category: query.category, skip, take }),
            this.repository.count(query.category),
        ]);

        return {
            items,
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
        };
    }
}