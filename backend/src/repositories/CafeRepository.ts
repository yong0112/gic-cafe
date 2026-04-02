import { injectable } from 'tsyringe';
import { PrismaClient, Cafe } from '@prisma/client';
import { CreateCafeInput, UpdateCafeInput } from '@/schemas/cafeSchema';

@injectable()
export class CafeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(location?: string): Promise<(Cafe & { _count: { employees: number } })[]> {
    return this.prisma.cafe.findMany({
      where: location ? { location: { equals: location, mode: 'insensitive' } } : undefined,
      include: { _count: { select: { employees: true } } },
      orderBy: { employees: { _count: 'desc' } },
    });
  }

  async findById(id: string): Promise<Cafe | null> {
    return this.prisma.cafe.findUnique({ where: { id } });
  }

  async create(data: CreateCafeInput & { logo?: string }): Promise<Cafe> {
    return this.prisma.cafe.create({ data });
  }

  async update(id: string, data: Partial<UpdateCafeInput & { logo?: string }>): Promise<Cafe> {
    return this.prisma.cafe.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cafe.delete({ where: { id } });
  }

  async findEmployeeIds(cafeId: string): Promise<string[]> {
    const rows = await this.prisma.cafeEmployee.findMany({
      where: { cafeId },
      select: { employeeId: true },
    });
    return rows.map((r) => r.employeeId);
  }
}
