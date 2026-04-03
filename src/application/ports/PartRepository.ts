import { Part } from "../../domain/entities/Part";
import { CreatePartDTO } from "../dtos/CreatePartDTO";

export interface PartRepository {
    findAll(): Promise<Part[]>;
    findPage(params: { category?: string; skip: number; take: number }): Promise<Part[]>;
    count(category?: string): Promise<number>;
    findById(id: string): Promise<Part | null>;
    findByCategory(category: string): Promise<Part[]>;
    create(part: CreatePartDTO): Promise<Part>;
    update(id: string, data: Partial<Part>): Promise<Part>;
    delete(id: string): Promise<void>;
}