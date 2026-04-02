import { z } from 'zod';

export const createCafeSchema = z.object({
  name: z.string().min(6, 'Minimum 6 characters').max(10, 'Maximum 10 characters'),
  description: z.string().max(256, 'Maximum 256 characters'),
  location: z.string().min(1, 'Location is required'),
});

export const updateCafeSchema = createCafeSchema.partial().extend({
  id: z.string().uuid('Invalid café ID'),
});

export type CreateCafeInput = z.infer<typeof createCafeSchema>;
export type UpdateCafeInput = z.infer<typeof updateCafeSchema>;
