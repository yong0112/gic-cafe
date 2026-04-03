import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { CafeRepository } from '@/repositories/CafeRepository';
import { DeleteCafeCommand } from '@/cafes/commands/DeleteCafeCommand';
import { PrismaClient } from '@prisma/client';

@injectable()
export class DeleteCafeHandler implements IRequestHandler<DeleteCafeCommand, void> {
  constructor(
    private readonly cafeRepository: CafeRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async handle(command: DeleteCafeCommand): Promise<void> {
    const existing = await this.cafeRepository.findById(command.id);
    if (!existing) {
      throw Object.assign(new Error('Café not found'), { statusCode: 404 });
    }

    const employeeIds = await this.cafeRepository.findEmployeeIds(command.id);

    await this.prisma.$transaction(async (tx) => {
      // 1. Delete employees first — cascades to remove CafeEmployee rows
      if (employeeIds.length > 0) {
        await tx.employee.deleteMany({ where: { id: { in: employeeIds } } });
      }
      // 2. Now café has no junction rows — Restrict constraint is satisfied
      await tx.cafe.delete({ where: { id: command.id } });
    });
  }
}
