import { Router } from 'express';
import { container } from 'tsyringe';
import { CafeController } from '@/controllers/CafeController';
import { uploadLogo } from '@/middleware/upload';
import { validate } from '@/middleware/validate';
import { createCafeSchema } from '@/schemas/cafeSchema';

const router = Router();
const ctrl = () => container.resolve(CafeController);

router.get('/', (req, res, next) => ctrl().getAll(req, res, next));
router.post('/', uploadLogo, validate(createCafeSchema), (req, res, next) => ctrl().create(req, res, next));
router.put('/:id', uploadLogo, (req, res, next) => ctrl().update(req, res, next));
router.delete('/:id', (req, res, next) => ctrl().delete(req, res, next));

export default router;
