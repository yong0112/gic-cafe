import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { EmployeeRepository } from '@/repositories/EmployeeRepository';
import { UpdateEmployeeCommand } from '@/employees/commands/UpdateEmployeeCommand';
import { Employee } from '@prisma/client';

@injectable()
export class UpdateEmployeeHandler implements IRequestHandler<UpdateEmployeeCommand, Employee> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async handle(command: UpdateEmployeeCommand): Promise<Employee> {
    const { id, cafeId, ...employeeData } = command;

    const existing = await this.employeeRepository.findById(id);
    if (!existing) {
      throw Object.assign(new Error('Employee not found'), { statusCode: 404 });
    }

    const employee = await this.employeeRepository.update(id, employeeData);

    if (cafeId !== undefined) {
      if (cafeId === null || cafeId === '') {
        await this.employeeRepository.unassignCafe(id);
      } else {
        await this.employeeRepository.assignCafe(id, cafeId);
      }
    }

    return employee;
  }
}
