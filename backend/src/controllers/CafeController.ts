import { injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { Mediator } from '@/mediator/mediator';
import { createCafeSchema, updateCafeSchema } from '@/schemas/cafeSchema';
import { GetCafesQuery } from '@/cafes/queries/GetCafesQuery';
import { CreateCafeCommand } from '@/cafes/commands/CreateCafeCommand';
import { UpdateCafeCommand } from '@/cafes/commands/UpdateCafeCommand';
import { DeleteCafeCommand } from '@/cafes/commands/DeleteCafeCommand';

@injectable()
export class CafeController {
  constructor(private readonly mediator: Mediator) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const location = req.query.location as string | undefined;
      const data = await this.mediator.send(new GetCafesQuery(location));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logo = req.file ? `uploads/${req.file.filename}` : undefined;
      const { name, description, location } = req.body;
      const data = await this.mediator.send(new CreateCafeCommand(name, description, location, logo));
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateCafeSchema.safeParse({ ...req.body, id: req.params.id as string });
      if (!parsed.success) {
        res.status(400).json({
          message: 'Validation failed',
          errors: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }
      const logo = req.file
        ? `uploads/${req.file.filename}`
        : req.body.removeLogo === '1' ? null : undefined;
      const { id, name, description, location } = parsed.data;
      const data = await this.mediator.send(new UpdateCafeCommand(id, name, description, location, logo));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.mediator.send(new DeleteCafeCommand(req.params.id as string));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
