import { z } from 'zod';
import { CategoryStatus } from './model';

export const CategoryCreateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(CategoryStatus).optional(),
});

export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;
