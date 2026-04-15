import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}
export const CategoryUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  image: z.string().nullish(),
  description: z.string().nullish(),
  position: z.number().min(0, 'invalid position').default(0).optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Category = z.infer<typeof CategoryUpdateSchema>;
