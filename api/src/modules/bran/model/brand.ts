/* eslint-disable prettier/prettier */
import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';
import { ErrBrandTooShort } from './errors';

export const ModelName = "brands";
export const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrBrandTooShort.message),
  image: z.string().nullish(),
  tag_line: z.string().optional(),
  description: z.string().nullish(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Brand = z.infer<typeof BrandSchema>;
