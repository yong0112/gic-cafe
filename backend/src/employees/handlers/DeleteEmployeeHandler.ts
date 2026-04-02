import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { EmployeeRepository } from '@/repositories/EmployeeRepository';
import { DeleteEmployeeCommand } from '@/employees/commands/DeleteEmployeeCommand';

@injectable()
export class DeleteEmployeeHandler implements IRequestHandler<DeleteEmployeeCommand, void> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async handle(command: DeleteEmployeeCommand): Promise<void> {
    const existing = await this.employeeRepository.findById(command.id);
    if (!existing) {
      throw Object.assign(new Error('Employee not found'), { statusCode: 404 });
    }
    await this.employeeRepository.delete(command.id);
  }
}
