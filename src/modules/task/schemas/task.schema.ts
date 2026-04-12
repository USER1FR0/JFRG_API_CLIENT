import { z } from 'zod';
import { containsDangerousChars } from '@/core/utils/sanitize.util';

const safe = (val: string) => !containsDangerousChars(val);

export const taskSchema = z.object({
  name: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .refine(safe, 'Caracteres no permitidos'),
  description: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(250, 'Máximo 250 caracteres')
    .refine(safe, 'Caracteres no permitidos'),
  priority: z.boolean(),
  completed: z.boolean().optional(),

});

export type TaskInput = z.infer<typeof taskSchema>;
