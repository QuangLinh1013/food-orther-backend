/* eslint-disable prettier/prettier */
import { CartItemDTO } from '../model/cart';

export interface ICartRepository {
  // Thêm món vào giỏ (Nếu có rồi thì cộng dồn số lượng)
  addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<boolean>;

  // Lấy toàn bộ giỏ hàng của user
  getCart(userId: string): Promise<CartItemDTO[]>;

  // Xóa 1 món khỏi giỏ
  removeItem(userId: string, productId: string): Promise<boolean>;

  // Xóa sạch giỏ hàng (Dùng khi thanh toán xong)
  clearCart(userId: string): Promise<boolean>;
}
