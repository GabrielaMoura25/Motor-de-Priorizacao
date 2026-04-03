import { z } from "zod";

export const createPartSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    currentStock: z.number().int().min(0, "Current stock cannot be negative"),
    minimumStock: z.number().int().min(0, "Minimum stock cannot be negative"),
    averageDailySales: z.number().min(0, "Average daily sales cannot be negative"),
    leadTimeDays: z.number().int().min(1, "Lead time must be at least 1 day"),
    unitCost: z.number().positive("Unit cost must be positive"),
    criticalityLevel: z.number().int().min(1).max(5, "Criticality level must be between 1 and 5"),
});

export const updatePartSchema = createPartSchema.partial();

export const listPartsQuerySchema = z.object({
    category: z.string().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});