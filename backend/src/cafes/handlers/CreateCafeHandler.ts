import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { CafeRepository } from '@/repositories/CafeRepository';
import { CreateCafeCommand } from '@/cafes/commands/CreateCafeCommand';
import { Cafe } from '@prisma/client';

@injectable()
export class CreateCafeHandler implements IRequestHandler<CreateCafeCommand, Cafe> {
  constructor(private readonly cafeRepository: CafeRepository) {}

  async handle(command: CreateCafeCommand): Promise<Cafe> {
    return this.cafeRepository.create(command);
  }
}
