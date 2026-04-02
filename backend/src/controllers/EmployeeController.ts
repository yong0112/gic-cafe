import { injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { Mediator } from '@/mediator/mediator';
import { updateEmployeeSchema } from '@/schemas/employeeSchema';
import { GetEmployeesQuery } from '@/employees/queries/GetEmployeesQuery';
import { CreateEmployeeCommand } from '@/employees/commands/CreateEmployeeCommand';
import { UpdateEmployeeCommand } from '@/employees/commands/UpdateEmployeeCommand';
import { DeleteEmployeeCommand } from '@/employees/commands/DeleteEmployeeCommand';

@injectable()
export class EmployeeController {
  constructor(private readonly mediator: Mediator) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cafe = req.query.cafe as string | undefined;
      const data = await this.mediator.send(new GetEmployeesQuery(cafe));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, emailAddress, phoneNumber, gender, cafeId } = req.body;
      const data = await this.mediator.send(
        new CreateEmployeeCommand(name, emailAddress, phoneNumber, gender, cafeId),
      );
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateEmployeeSchema.safeParse({ ...req.body, id: req.params.id as string });
      if (!parsed.success) {
        res.status(400).json({
          message: 'Validation failed',
          errors: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }
      const { id, name, emailAddress, phoneNumber, gender, cafeId } = parsed.data;
      const data = await this.mediator.send(
        new UpdateEmployeeCommand(id, name, emailAddress, phoneNumber, gender, cafeId),
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.mediator.send(new DeleteEmployeeCommand(req.params.id as string));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
