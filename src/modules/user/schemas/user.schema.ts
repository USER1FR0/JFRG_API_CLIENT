import { z } from 'zod';
import { containsDangerousChars } from '@/core/utils/sanitize.util';

const safe = (val: string) => !containsDangerousChars(val);

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(safe, 'Caracteres no permitidos'),
  lastName: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(safe, 'Caracteres no permitidos'),
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(safe, 'Caracteres no permitidos'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(16, 'Máximo 16 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Debe tener mayúscula, minúscula, número y carácter especial'
    )
    .optional()
    .or(z.literal('')),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
