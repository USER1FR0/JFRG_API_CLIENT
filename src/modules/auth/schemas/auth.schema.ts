import { z } from 'zod';
import { containsDangerousChars } from '@/core/utils/sanitize.util';

const noDangerousChars = (val: string) => !containsDangerousChars(val);

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(noDangerousChars, 'Caracteres no permitidos'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(50, 'Máximo 50 caracteres'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(noDangerousChars, 'Caracteres no permitidos'),
  lastName: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(noDangerousChars, 'Caracteres no permitidos'),
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(noDangerousChars, 'Caracteres no permitidos'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(16, 'Máximo 16 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Debe tener mayúscula, minúscula, número y carácter especial (@$!%*?&)'
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
