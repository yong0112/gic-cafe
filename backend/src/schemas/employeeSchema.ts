import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(6, 'Minimum 6 characters').max(10, 'Maximum 10 characters'),
  emailAddress: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^[89]\d{7}$/, 'Phone number must start with 8 or 9 and be 8 digits'),
  gender: z.enum(['Male', 'Female'], { message: 'Gender must be Male or Female' }),
  cafeId: z.string().uuid('Invalid café ID').optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  id: z.string().regex(/^UI[A-Z0-9]{7}$/, 'Invalid employee ID'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
