/* eslint-disable prettier/prettier */
import { z } from 'zod';

// 1. Schema kiểm tra dữ liệu khi khách hàng bấm "Thêm vào giỏ"
export const AddToCartSchema = z.object({
  productId: z.string().uuid('ID sản phẩm không hợp lệ'),
  quantity: z.number().int().min(1, 'Số lượng phải lớn hơn 0'),
});

// Xuất ra Type chuẩn để code có gợi ý
export type AddToCartDTO = z.infer<typeof AddToCartSchema>;

// 2. Cấu trúc 1 món hàng khi lấy từ Redis ra
export interface CartItemDTO {
  productId: string;
  quantity: number;
}

// 3. Cấu trúc toàn bộ Giỏ hàng trả về cho khách
export interface CartDTO {
  userId: string;
  items: CartItemDTO[];
}
