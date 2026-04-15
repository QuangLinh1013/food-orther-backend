import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';

export const CategoryCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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
  position: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;

export const CategoryCondDTOSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  position: z.number().min(0).optional(),
  parentId: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type CategoryCondDTO = z.infer<typeof CategoryCondDTOSchema>;
