import { prisma } from "../database/prisma/client";
import { PartRepository } from "../../application/ports/PartRepository";
import { Part } from "../../domain/entities/Part";

export class PrismaPartRepository implements PartRepository {
    async findAll(): Promise<Part[]> {
        return prisma.part.findMany();
    }

    async findById(id: string): Promise<Part | null> {
        return prisma.part.findUnique({ where: { id } });
    }

    async findByCategory(category: string): Promise<Part[]> {
        return prisma.part.findMany({ where: { category } });
    }

    async create(part: Part): Promise<Part> {
        return prisma.part.create({ data: part });
    }

    async update(id: string, data: Partial<Part>): Promise<Part> {
        return prisma.part.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await prisma.part.delete({ where: { id } });
    }
}