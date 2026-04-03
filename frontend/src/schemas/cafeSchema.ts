import { z } from 'zod';

export const cafeSchema = z.object({
  name: z.string().min(6, 'Minimum 6 characters').max(10, 'Maximum 10 characters'),
  description: z.string().min(1, 'Description is required').max(256, 'Maximum 256 characters'),
  location: z.string().min(1, 'Location is required'),
});

export type CafeFormValues = z.infer<typeof cafeSchema>;
