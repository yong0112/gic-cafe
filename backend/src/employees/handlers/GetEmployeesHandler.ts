import { injectable } from 'tsyringe';
import { IRequestHandler } from '@/mediator/mediator';
import { EmployeeRepository } from '@/repositories/EmployeeRepository';
import { GetEmployeesQuery } from '@/employees/queries/GetEmployeesQuery';

export interface EmployeeResponse {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  days_worked: number;
  cafe: string;
}

@injectable()
export class GetEmployeesHandler implements IRequestHandler<GetEmployeesQuery, EmployeeResponse[]> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async handle(query: GetEmployeesQuery): Promise<EmployeeResponse[]> {
    const employees = await this.employeeRepository.findAll(query.cafe);

    const result = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email_address: emp.emailAddress,
      phone_number: emp.phoneNumber,
      gender: emp.gender,
      days_worked: emp.cafe
        ? Math.floor((Date.now() - new Date(emp.cafe.startDate).getTime()) / 86_400_000)
        : 0,
      cafe: emp.cafe?.cafe.name ?? '',
    }));

    return result.sort((a, b) => b.days_worked - a.days_worked);
  }
}
