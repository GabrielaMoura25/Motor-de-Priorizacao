import { Part } from "../entities/Part";
import { PriorityResult } from "../entities/PriorityResult";

/** Campos extras mantidos apenas para desempate no sort — não saem na resposta final. */
type SortablePriority = PriorityResult & {
    criticalityLevel: number;
    averageDailySales: number;
};

export class PriorityCalculator {
    /**
     * Calcula e ordena as peças que precisam de reposição.
     * Complexidade: O(n log n) — usa Map para lookup O(1) no comparador.
     */
    static calculate(parts: Part[]): PriorityResult[] {
        const enriched = PriorityCalculator.buildSortableResults(parts);
        enriched.sort(PriorityCalculator.compareByPriority);
        return enriched.map(PriorityCalculator.toResult);
    }

    private static buildSortableResults(parts: Part[]): SortablePriority[] {
        const results: SortablePriority[] = [];

        for (const part of parts) {
            const expectedConsumption = part.averageDailySales * part.leadTimeDays;
            const projectedStock = part.currentStock - expectedConsumption;
            const needsRestock = projectedStock < part.minimumStock;

            if (!needsRestock) continue;

            const urgencyScore =
                (part.minimumStock - projectedStock) * part.criticalityLevel;

            results.push({
                partId: part.id,
                name: part.name,
                currentStock: part.currentStock,
                projectedStock,
                minimumStock: part.minimumStock,
                urgencyScore,
                // campos extra para desempate
                criticalityLevel: part.criticalityLevel,
                averageDailySales: part.averageDailySales,
            });
        }

        return results;
    }

    private static compareByPriority(a: SortablePriority, b: SortablePriority): number {
        if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
        if (b.criticalityLevel !== a.criticalityLevel)
            return b.criticalityLevel - a.criticalityLevel;
        if (b.averageDailySales !== a.averageDailySales)
            return b.averageDailySales - a.averageDailySales;
        return a.name.localeCompare(b.name);
    }

    private static toResult({
        partId,
        name,
        currentStock,
        projectedStock,
        minimumStock,
        urgencyScore,
    }: SortablePriority): PriorityResult {
        return { partId, name, currentStock, projectedStock, minimumStock, urgencyScore };
    }
}