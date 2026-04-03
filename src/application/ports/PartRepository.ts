import { Part } from "../../domain/entities/Part";

export interface PartRepository {
    findAll(): Promise<Part[]>;
    findById(id: string): Promise<Part | null>;
    findByCategory(category: string): Promise<Part[]>;
    create(part: Part): Promise<Part>;
    update(id: string, data: Partial<Part>): Promise<Part>;
    delete(id: string): Promise<void>;
}