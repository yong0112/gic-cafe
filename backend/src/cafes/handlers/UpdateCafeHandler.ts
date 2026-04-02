import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { CafeRepository } from '@/repositories/CafeRepository';
import { UpdateCafeCommand } from '@/cafes/commands/UpdateCafeCommand';
import { Cafe } from '@prisma/client';

@injectable()
export class UpdateCafeHandler implements IRequestHandler<UpdateCafeCommand, Cafe> {
  constructor(private readonly cafeRepository: CafeRepository) {}

  async handle(command: UpdateCafeCommand): Promise<Cafe> {
    const { id, ...data } = command;
    const existing = await this.cafeRepository.findById(id);
    if (!existing) {
      throw Object.assign(new Error('Café not found'), { statusCode: 404 });
    }
    return this.cafeRepository.update(id, data);
  }
}
