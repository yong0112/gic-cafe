import { injectable } from 'tsyringe';
import { PrismaClient, Employee } from '@prisma/client';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@/schemas/employeeSchema';

type EmployeeWithCafe = Employee & {
  cafe: { cafeId: string; startDate: Date; cafe: { name: string } } | null;
};

@injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(cafeId?: string): Promise<EmployeeWithCafe[]> {
    return this.prisma.employee.findMany({
      where: cafeId
        ? { cafe: { cafeId } }
        : undefined,
      include: {
        cafe: {
          include: { cafe: { select: { name: true } } },
        },
      },
    });
  }

  async findById(id: string): Promise<EmployeeWithCafe | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        cafe: {
          include: { cafe: { select: { name: true } } },
        },
      },
    });
  }

  async create(
    data: Omit<CreateEmployeeInput, 'cafeId'> & { id: string },
  ): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  async update(
    id: string,
    data: Partial<Omit<UpdateEmployeeInput, 'id' | 'cafeId'>>,
  ): Promise<Employee> {
    return this.prisma.employee.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employee.delete({ where: { id } });
  }

  async assignCafe(employeeId: string, cafeId: string, startDate?: Date): Promise<void> {
    await this.prisma.cafeEmployee.upsert({
      where: { employeeId },
      update: { cafeId, startDate: startDate ?? new Date() },
      create: { employeeId, cafeId, startDate: startDate ?? new Date() },
    });
  }

  async unassignCafe(employeeId: string): Promise<void> {
    await this.prisma.cafeEmployee.deleteMany({ where: { employeeId } });
  }
}
