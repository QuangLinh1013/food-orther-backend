/* eslint-disable prettier/prettier */
import { ICartRepository } from '../../../interface';
import { CartItemDTO } from '../../../model/cart';
import { RedisComponent } from '../.../../../../../../share/conponent/redis/index'; // Import Redis

export class CartRedisRepository implements ICartRepository {
  // Tạo chìa khóa độc nhất cho từng User (VD: cart:user-123)
  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<boolean> {
    const redis = await RedisComponent.getInstance();
    const key = this.getCartKey(userId);

    // HINCRBY: Lệnh siêu việt của Redis
    // Tự động tìm productId trong giỏ. Nếu có -> cộng dồn quantity. Nếu chưa có -> tạo mới.
    await redis.hIncrBy(key, productId, quantity);

    // Cài giờ tự hủy (TTL): Cho giỏ hàng sống tối đa 7 ngày (604800 giây)
    // Tránh việc Redis bị đầy rác nếu user bỏ app không dùng nữa
    await redis.expire(key, 604800);

    return true;
  }

  async getCart(userId: string): Promise<CartItemDTO[]> {
    const redis = await RedisComponent.getInstance();
    const key = this.getCartKey(userId);

    // HGETALL: Lấy toàn bộ [productId, quantity] trong cái túi của user
    const cartData = await redis.hGetAll(key);

    // Biến đổi dữ liệu thô của Redis thành mảng DTO chuẩn mực
    const items: CartItemDTO[] = Object.entries(cartData).map(([id, qty]) => ({
      productId: id,
      quantity: parseInt(qty, 10),
    }));

    return items;
  }

  async removeItem(userId: string, productId: string): Promise<boolean> {
    const redis = await RedisComponent.getInstance();
    const key = this.getCartKey(userId);

    // HDEL: Đá 1 món ra khỏi giỏ
    const deletedCount = await redis.hDel(key, productId);
    return deletedCount > 0;
  }

  async clear(userId: string): Promise<boolean> {
    const redis = await RedisComponent.getInstance();
    const key = this.getCartKey(userId);
    await redis.del(key);
    return true;
  }

  async getByUserId(userId: string): Promise<{ userId: string; items: CartItemDTO[] } | null> {
    const items = await this.getCart(userId);
    if (!items || items.length === 0) return null;
    return { userId, items };
  }
}
