import { GetPartsUseCase } from "../src/application/use-cases/GetPartsUseCase";
import { PartRepository } from "../src/application/ports/PartRepository";
import { Part } from "../src/domain/entities/Part";
import { CreatePartDTO } from "../src/application/dtos/CreatePartDTO";

class InMemoryPartRepository implements PartRepository {
    constructor(private readonly parts: Part[]) {}

    async findAll(): Promise<Part[]> {
        return this.parts;
    }

    async findPage(params: { category?: string; skip: number; take: number }): Promise<Part[]> {
        const filtered = params.category
            ? this.parts.filter((part) => part.category === params.category)
            : this.parts;
        return filtered.slice(params.skip, params.skip + params.take);
    }

    async count(category?: string): Promise<number> {
        if (!category) return this.parts.length;
        return this.parts.filter((part) => part.category === category).length;
    }

    async findById(id: string): Promise<Part | null> {
        return this.parts.find((part) => part.id === id) ?? null;
    }

    async findByCategory(category: string): Promise<Part[]> {
        return this.parts.filter((part) => part.category === category);
    }

    async create(_part: CreatePartDTO): Promise<Part> {
        throw new Error("Not implemented for this test");
    }

    async update(_id: string, _data: Partial<Part>): Promise<Part> {
        throw new Error("Not implemented for this test");
    }

    async delete(_id: string): Promise<void> {
        throw new Error("Not implemented for this test");
    }
}

function makePart(index: number, category = "engine"): Part {
    return {
        id: `part-${index}`,
        name: `Part ${index}`,
        category,
        currentStock: 10,
        minimumStock: 20,
        averageDailySales: 2,
        leadTimeDays: 5,
        unitCost: 10,
        criticalityLevel: 3,
    };
}

describe("GetPartsUseCase", () => {
    it("deve retornar página com metadados corretos", async () => {
        const repository = new InMemoryPartRepository([
            makePart(1),
            makePart(2),
            makePart(3),
            makePart(4),
            makePart(5),
        ]);
        const useCase = new GetPartsUseCase(repository);

        const result = await useCase.execute({ page: 2, limit: 2 });

        expect(result.items.map((item) => item.id)).toEqual(["part-3", "part-4"]);
        expect(result.page).toBe(2);
        expect(result.limit).toBe(2);
        expect(result.total).toBe(5);
        expect(result.totalPages).toBe(3);
    });

    it("deve aplicar filtro por categoria na paginação", async () => {
        const repository = new InMemoryPartRepository([
            makePart(1, "engine"),
            makePart(2, "brake"),
            makePart(3, "engine"),
            makePart(4, "brake"),
        ]);
        const useCase = new GetPartsUseCase(repository);

        const result = await useCase.execute({ category: "brake", page: 1, limit: 10 });

        expect(result.items.map((item) => item.id)).toEqual(["part-2", "part-4"]);
        expect(result.total).toBe(2);
        expect(result.totalPages).toBe(1);
    });
});
