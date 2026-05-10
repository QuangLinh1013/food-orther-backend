/* eslint-disable prettier/prettier */
import { z } from 'zod';

// 1. DTO cho Chi tiết đơn hàng
export interface OrderItemDTO {
  id: string;
  orderId: string;
  menuId: string;
  quantity: number;
  price: number;
}

// 2. DTO cho Đơn hàng tổng
export interface OrderDTO {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'completed';
  items?: OrderItemDTO[];
}

// 3. Schema để Validate khi user bấm "Đặt hàng"
// Rất đơn giản, user chỉ cần gửi lệnh, hệ thống sẽ tự động móc giỏ hàng ra.
// Nếu cẩn thận hơn có thể cho user gửi thêm mã giảm giá, địa chỉ giao hàng...
export const CreateOrderSchema = z.object({
  // Tạm thời chưa cần input gì phức tạp từ body, nhưng cứ để schema sẵn
  notes: z.string().optional(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
export const CancelOrderSchema = z.object({
  orderId: z.string().uuid('Mã đơn hàng không hợp lệ'),
});

export type CancelOrderDTO = z.infer<typeof CancelOrderSchema
>;
export const GetOrderHistorySchema = z.object({
  // Nhận vào chuỗi, kiểm tra có phải là số không, rồi ép kiểu sang Number. Mặc định là trang 1.
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  // Mặc định lấy 10 đơn mỗi trang
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
});

export type GetOrderHistoryDTO = z.infer<typeof GetOrderHistorySchema>;

// 2. DTO chuẩn hóa dữ liệu trả về cho Frontend
export interface PaginatedOrderResult {
  data: OrderDTO[];
  meta: {
    total: number;       // Tổng số đơn hàng
    page: number;        // Trang hiện tại
    limit: number;       // Số đơn/trang
    totalPages: number;  // Tổng số trang
  };
}

