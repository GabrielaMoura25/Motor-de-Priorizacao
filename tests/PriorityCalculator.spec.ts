import { PriorityCalculator } from "../src/domain/services/PriorityCalculator";
import { Part } from "../src/domain/entities/Part";

function makePart(overrides: Partial<Part> = {}): Part {
    return {
        id: overrides.id ?? "part-1",
        name: overrides.name ?? "Filtro de Óleo X",
        category: overrides.category ?? "engine",
        currentStock: overrides.currentStock ?? 15,
        minimumStock: overrides.minimumStock ?? 20,
        averageDailySales: overrides.averageDailySales ?? 4,
        leadTimeDays: overrides.leadTimeDays ?? 5,
        unitCost: overrides.unitCost ?? 18.5,
        criticalityLevel: overrides.criticalityLevel ?? 3,
    };
}

describe("PriorityCalculator", () => {
    it("deve calcular expectedConsumption, projectedStock e urgencyScore corretamente", () => {
        const result = PriorityCalculator.calculate([makePart()]);

        expect(result).toEqual([
            {
                partId: "part-1",
                name: "Filtro de Óleo X",
                currentStock: 15,
                projectedStock: -5,
                minimumStock: 20,
                urgencyScore: 75,
            },
        ]);
    });

    it("não deve retornar peças sem necessidade de reposição", () => {
        const parts = [
            makePart({
                id: "part-ok",
                currentStock: 100,
                minimumStock: 20,
                averageDailySales: 2,
                leadTimeDays: 5,
            }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result).toEqual([]);
    });

    it("deve tratar estoque negativo corretamente", () => {
        const parts = [
            makePart({
                id: "part-negative",
                name: "Pastilha de Freio Y",
                currentStock: -2,
                minimumStock: 10,
                averageDailySales: 2,
                leadTimeDays: 5,
                criticalityLevel: 3,
            }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result[0]).toMatchObject({
            partId: "part-negative",
            projectedStock: -12,
            urgencyScore: 66,
        });
    });

    it("deve ignorar peças com venda zero quando estoque projetado não ficar abaixo do mínimo", () => {
        const parts = [
            makePart({
                id: "zero-sales",
                averageDailySales: 0,
                currentStock: 10,
                minimumStock: 10,
                leadTimeDays: 30,
            }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result).toEqual([]);
    });

    it("deve priorizar corretamente em cenários de lead time alto", () => {
        const parts = [
            makePart({
                id: "long-lead",
                name: "Correia Dentada",
                currentStock: 30,
                minimumStock: 15,
                averageDailySales: 3,
                leadTimeDays: 20,
                criticalityLevel: 4,
            }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result[0]).toMatchObject({
            partId: "long-lead",
            projectedStock: -30,
            urgencyScore: 180,
        });
    });

    it("deve ordenar por urgencyScore desc", () => {
        const parts = [
            makePart({ id: "low", name: "A", currentStock: 10, minimumStock: 20, averageDailySales: 2, leadTimeDays: 5, criticalityLevel: 2 }),
            makePart({ id: "high", name: "B", currentStock: 10, minimumStock: 20, averageDailySales: 4, leadTimeDays: 5, criticalityLevel: 3 }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result.map((item) => item.partId)).toEqual(["high", "low"]);
    });

    it("deve desempatar por maior criticalityLevel", () => {
        const parts = [
            makePart({
                id: "critical-3",
                name: "Item B",
                currentStock: 10,
                minimumStock: 20,
                averageDailySales: 5,
                leadTimeDays: 2,
                criticalityLevel: 3,
            }),
            makePart({
                id: "critical-5",
                name: "Item A",
                currentStock: 10,
                minimumStock: 20,
                averageDailySales: 3,
                leadTimeDays: 2,
                criticalityLevel: 5,
            }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result[0].partId).toBe("critical-5");
    });

    it("deve desempatar por maior averageDailySales", () => {
        const parts = [
            makePart({
                id: "sales-2",
                name: "Item B",
                currentStock: 8,
                minimumStock: 20,
                averageDailySales: 2,
                leadTimeDays: 2,
                criticalityLevel: 3,
            }),
            makePart({
                id: "sales-4",
                name: "Item A",
                currentStock: 8,
                minimumStock: 20,
                averageDailySales: 4,
                leadTimeDays: 1,
                criticalityLevel: 3,
            }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result[0].partId).toBe("sales-4");
    });

    it("deve desempatar por ordem alfabética do nome", () => {
        const parts = [
            makePart({
                id: "z",
                name: "Zeta",
                currentStock: 10,
                minimumStock: 20,
                averageDailySales: 2,
                leadTimeDays: 1,
                criticalityLevel: 2,
            }),
            makePart({
                id: "a",
                name: "Alpha",
                currentStock: 10,
                minimumStock: 20,
                averageDailySales: 2,
                leadTimeDays: 1,
                criticalityLevel: 2,
            }),
        ];

        const result = PriorityCalculator.calculate(parts);

        expect(result.map((item) => item.partId)).toEqual(["a", "z"]);
    });
});
