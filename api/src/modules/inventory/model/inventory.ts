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
export interface InventoryLogDTO {
  id: string;
  menuId: string;
  actionType: 'RESTOCK' | 'DEDUCT' | 'ROLLBACK';
  quantityChanged: number;
  balanceAfter: number;
  referenceId?: string; // Tùy chọn, dùng khi có mã hóa đơn
}

// 2. Schema Validate cho Hành động Nhập kho (Restock)
export const RestockInventorySchema = z.object({
  menuId: z.string().uuid('ID món ăn không hợp lệ'),
  quantity: z.number().int().min(1, 'Số lượng nhập kho phải lớn hơn 0'),
});
export type RestockInventoryDTO = z.infer<typeof RestockInventorySchema>;

// 3. Schema Validate cho Hành động Hoàn kho (Rollback)
export const RollbackInventorySchema = z.object({
  menuId: z.string().uuid('ID món ăn không hợp lệ'),
  quantity: z.number().int().min(1, 'Số lượng hoàn kho phải lớn hơn 0'),
  orderId: z.string().uuid('ID đơn hàng không hợp lệ'), // Bắt buộc phải có mã đơn hàng để ghi log
});
export type RollbackInventoryDTO = z.infer<typeof RollbackInventorySchema>;