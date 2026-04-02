import { Router } from 'express';
import { container } from 'tsyringe';
import { EmployeeController } from '@/controllers/EmployeeController';
import { validate } from '@/middleware/validate';
import { createEmployeeSchema } from '@/schemas/employeeSchema';

const router = Router();
const ctrl = () => container.resolve(EmployeeController);

router.get('/', (req, res, next) => ctrl().getAll(req, res, next));
router.post('/', validate(createEmployeeSchema), (req, res, next) => ctrl().create(req, res, next));
router.put('/:id', (req, res, next) => ctrl().update(req, res, next));
router.delete('/:id', (req, res, next) => ctrl().delete(req, res, next));

export default router;
