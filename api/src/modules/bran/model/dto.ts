/* eslint-disable @typescript-eslint/no-empty-object-type */
import { z } from 'zod';
import { ErrBrandTooShort } from './errors';

export const BrandCreatedDTOSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image: z.string().nullish(),
  tag_line: z.string().optional(),
  description: z.string().nullish(),
});
export type BrandCreatedDTOSchema = z.infer<typeof BrandCreatedDTOSchema>;
export const BrandUpdateDTOSchema = z.object({
  name: z.string().min(2, ErrBrandTooShort.message).optional(),
  image: z.string().nullish(),
  tag_line: z.string().optional(),
  description: z.string().nullish(),
});
export type BrandUpdateDTOSchema = z.infer<typeof BrandUpdateDTOSchema>;

export type BrandCondDTO = {};
