import { CreatePartUseCase } from "../src/application/use-cases/CreatePartUseCase";
import { PartRepository } from "../src/application/ports/PartRepository";
import { Part } from "../src/domain/entities/Part";
import { CreatePartDTO } from "../src/application/dtos/CreatePartDTO";

class InMemoryPartRepository implements PartRepository {
    private readonly parts: Part[] = [];

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

    async create(part: CreatePartDTO): Promise<Part> {
        const created: Part = {
            id: `part-${this.parts.length + 1}`,
            ...part,
        };

        this.parts.push(created);
        return created;
    }

    async update(_id: string, _data: Partial<Part>): Promise<Part> {
        throw new Error("Not implemented for this test");
    }

    async delete(_id: string): Promise<void> {
        throw new Error("Not implemented for this test");
    }
}

describe("CreatePartUseCase", () => {
    it("deve criar peça com sucesso e retornar o registro persistido", async () => {
        const repository = new InMemoryPartRepository();
        const useCase = new CreatePartUseCase(repository);

        const payload: CreatePartDTO = {
            name: "Filtro de Óleo X",
            category: "engine",
            currentStock: 10,
            minimumStock: 20,
            averageDailySales: 3,
            leadTimeDays: 5,
            unitCost: 15,
            criticalityLevel: 4,
        };

        const created = await useCase.execute(payload);

        expect(created).toEqual({
            id: "part-1",
            ...payload,
        });
    });
});
