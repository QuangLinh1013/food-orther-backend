/* eslint-disable prettier/prettier */
import { OrderDTO, OrderItemDTO } from '../model/order';

export interface IOrderRepository {
  // Lưu đơn hàng tổng và danh sách món ăn cùng một lúc
  // Chúng ta truyền vào một 'transaction' (tùy chọn) để dùng chung với các module khác nếu cần
  create(order: OrderDTO, items: OrderItemDTO[], t?: any): Promise<boolean>;

  // Lấy chi tiết đơn hàng (nếu cần)
  getById(orderId: string): Promise<OrderDTO | null>;
  deduct(menuId: string, quantityToDeduct: number, t?: any): Promise<boolean>;
}
