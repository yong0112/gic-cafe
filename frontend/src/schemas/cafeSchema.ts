import { z } from 'zod';

export const cafeSchema = z.object({
  name: z.string()
    .refine((s) => s.trim().length >= 6, 'Minimum 6 characters')
    .refine((s) => s.trim().length <= 10, 'Maximum 10 characters'),
  description: z.string().min(1, 'Description is required').max(256, 'Maximum 256 characters'),
  location: z.string().min(1, 'Location is required'),
});

export type CafeFormValues = z.infer<typeof cafeSchema>;
