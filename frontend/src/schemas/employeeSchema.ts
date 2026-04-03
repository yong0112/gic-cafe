import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string()
    .refine((s) => s.trim().length >= 6, 'Minimum 6 characters')
    .refine((s) => s.trim().length <= 10, 'Maximum 10 characters'),
  emailAddress: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^[89]\d{7}$/, 'Must start with 8 or 9 and be exactly 8 digits'),
  gender: z.enum(['Male', 'Female'], { message: 'Please select a gender' }),
  cafeId: z.string().optional().or(z.literal('')),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
