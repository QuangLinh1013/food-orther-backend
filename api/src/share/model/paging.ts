/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import z from 'zod';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const PagingDTOSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type PagingDTO = z.infer<typeof PagingDTOSchema>;
