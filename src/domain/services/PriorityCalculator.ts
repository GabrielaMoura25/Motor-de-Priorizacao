import { Part } from "../entities/Part";
import { PriorityResult } from "../entities/PriorityResult";

export class PriorityCalculator {
    static calculate(parts: Part[]): PriorityResult[] {
        const results: PriorityResult[] = [];

        for (const part of parts) {
            const expectedConsumption = part.averageDailySales * part.leadTimeDays;
            const projectedStock = part.currentStock - expectedConsumption;
            const needsRestock = projectedStock < part.minimumStock;

            if (!needsRestock) continue;

            const urgencyScore = (part.minimumStock - projectedStock) * part.criticalityLevel;

            results.push({
                partId: part.id,
                name: part.name,
                currentStock: part.currentStock,
                projectedStock,
                minimumStock: part.minimumStock,
                urgencyScore
            });
        }

        return results.sort((a, b) => {
            if (b.urgencyScore !== a.urgencyScore) {
                return b.urgencyScore - a.urgencyScore;
            }

            // Precisamos buscar os dados originais para desempate
            const partA = parts.find(p => p.id === a.partId)!;
            const partB = parts.find(p => p.id === b.partId)!;
            
            if (partB.criticalityLevel !== partA.criticalityLevel) {
                return partB.criticalityLevel - partA.criticalityLevel;
            };

            if (partB.averageDailySales !== partA.averageDailySales) {
                return partB.averageDailySales - partA.averageDailySales;
            }

            return a.name.localeCompare(b.name);
        });
    }
}