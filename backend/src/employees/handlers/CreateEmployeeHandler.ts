import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { EmployeeRepository } from '@/repositories/EmployeeRepository';
import { CreateEmployeeCommand } from '@/employees/commands/CreateEmployeeCommand';
import { generateEmployeeId } from '@/utils/generateEmployeeId';
import { Employee } from '@prisma/client';

@injectable()
export class CreateEmployeeHandler implements IRequestHandler<CreateEmployeeCommand, Employee> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async handle(command: CreateEmployeeCommand): Promise<Employee> {
    const { cafeId, ...employeeData } = command;
    const id = generateEmployeeId();

    const employee = await this.employeeRepository.create({ id, ...employeeData });

    if (cafeId) {
      await this.employeeRepository.assignCafe(id, cafeId);
    }

    return employee;
  }
}
