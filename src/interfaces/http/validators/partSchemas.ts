import { z } from "zod";

export const createPartSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  currentStock: z.number(),
  minimumStock: z.number(),
  averageDailySales: z.number(),
  leadTimeDays: z.number(),
  unitCost: z.number(),
  criticalityLevel: z.number().min(1).max(5),
});

export const updatePartSchema = createPartSchema.partial();