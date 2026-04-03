import { prisma } from "../database/prisma/client";
import { PartRepository } from "../../application/ports/PartRepository";
import { Part } from "../../domain/entities/Part";
import { CreatePartDTO } from "../../application/dtos/CreatePartDTO";

export class PrismaPartRepository implements PartRepository {
    async findAll(): Promise<Part[]> {
        return prisma.part.findMany();
    }

    async findPage(params: {
        category?: string;
        skip: number;
        take: number;
    }): Promise<Part[]> {
        const where = params.category ? { category: params.category } : undefined;

        return prisma.part.findMany({
            where,
            skip: params.skip,
            take: params.take,
            orderBy: { name: "asc" },
        });
    }

    async count(category?: string): Promise<number> {
        const where = category ? { category } : undefined;
        return prisma.part.count({ where });
    }

    async findById(id: string): Promise<Part | null> {
        return prisma.part.findUnique({ where: { id } });
    }

    async findByCategory(category: string): Promise<Part[]> {
        return prisma.part.findMany({ where: { category } });
    }

    async create(part: CreatePartDTO): Promise<Part> {
        return prisma.part.create({ data: part });
    }

    async update(id: string, data: Partial<Part>): Promise<Part> {
        return prisma.part.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await prisma.part.delete({ where: { id } });
    }
}