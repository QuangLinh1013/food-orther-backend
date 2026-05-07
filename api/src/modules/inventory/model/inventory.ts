/* eslint-disable prettier/prettier */
import { z } from 'zod';

export interface InventoryDTO {
  id: string;
  menuId: string;
  quantity: number;
  version: number;
}

// Lệnh trừ kho từ tầng Order gửi sang
export const DeductInventorySchema = z.object({
  menuId: z.string().uuid('ID món ăn không hợp lệ'),
  quantity: z.number().int().min(1, 'Số lượng trừ phải lớn hơn 0'),
});
export type DeductInventoryDTO = z.infer<typeof DeductInventorySchema>;
