import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Mediator } from '@/mediator/mediator';
import { CafeRepository } from '@/repositories/CafeRepository';
import { EmployeeRepository } from '@/repositories/EmployeeRepository';
import { CafeController } from '@/controllers/CafeController';
import { EmployeeController } from '@/controllers/EmployeeController';
import { GetCafesQuery } from '@/cafes/queries/GetCafesQuery';
import { CreateCafeCommand } from '@/cafes/commands/CreateCafeCommand';
import { UpdateCafeCommand } from '@/cafes/commands/UpdateCafeCommand';
import { DeleteCafeCommand } from '@/cafes/commands/DeleteCafeCommand';
import { GetCafesHandler } from '@/cafes/handlers/GetCafesHandler';
import { CreateCafeHandler } from '@/cafes/handlers/CreateCafeHandler';
import { UpdateCafeHandler } from '@/cafes/handlers/UpdateCafeHandler';
import { DeleteCafeHandler } from '@/cafes/handlers/DeleteCafeHandler';
import { GetEmployeesQuery } from '@/employees/queries/GetEmployeesQuery';
import { CreateEmployeeCommand } from '@/employees/commands/CreateEmployeeCommand';
import { UpdateEmployeeCommand } from '@/employees/commands/UpdateEmployeeCommand';
import { DeleteEmployeeCommand } from '@/employees/commands/DeleteEmployeeCommand';
import { GetEmployeesHandler } from '@/employees/handlers/GetEmployeesHandler';
import { CreateEmployeeHandler } from '@/employees/handlers/CreateEmployeeHandler';
import { UpdateEmployeeHandler } from '@/employees/handlers/UpdateEmployeeHandler';
import { DeleteEmployeeHandler } from '@/employees/handlers/DeleteEmployeeHandler';

// Singletons
const prisma = new PrismaClient();
container.registerInstance(PrismaClient, prisma);

// Repositories
container.registerSingleton(CafeRepository);
container.registerSingleton(EmployeeRepository);

// Controllers
container.registerSingleton(CafeController);
container.registerSingleton(EmployeeController);

// Mediator
container.registerSingleton(Mediator);

// Register handlers with mediator (keyed by command/query class name)
const mediator = container.resolve(Mediator);

mediator.register(GetCafesQuery, container.resolve(GetCafesHandler));
mediator.register(CreateCafeCommand, container.resolve(CreateCafeHandler));
mediator.register(UpdateCafeCommand, container.resolve(UpdateCafeHandler));
mediator.register(DeleteCafeCommand, container.resolve(DeleteCafeHandler));
mediator.register(GetEmployeesQuery, container.resolve(GetEmployeesHandler));
mediator.register(CreateEmployeeCommand, container.resolve(CreateEmployeeHandler));
mediator.register(UpdateEmployeeCommand, container.resolve(UpdateEmployeeHandler));
mediator.register(DeleteEmployeeCommand, container.resolve(DeleteEmployeeHandler));

export { container };
