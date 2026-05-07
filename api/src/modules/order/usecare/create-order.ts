/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { IOrderRepository } from '../interface';
import { ICartRepository } from '../../cart/interface';
import { IInventoryRepository } from '../../inventory/interface';
import { IMenuRepository } from '../../menu/interface';
import { Sequelize } from 'sequelize';
import { OrderDTO, OrderItemDTO } from '../model/order';

export class CreateOrderUseCase implements ICommandHandler<string, string> {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly cartRepo: ICartRepository,
    private readonly inventoryRepo: IInventoryRepository,
    private readonly menuRepo: IMenuRepository,
    private readonly sequelize: Sequelize, // Đũa thần Transaction
  ) {}

  async execute(userId: string): Promise<string> {
    // 1. Kéo giỏ hàng từ Redis lên
    const cartItems = await this.cartRepo.getCart(userId);
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Giỏ hàng của bạn đang trống!');
    }

    // 2. Kích hoạt đũa thần (Bắt đầu Transaction)
    const t = await this.sequelize.transaction();

    try {
      const orderId = uuidv4();
      let totalAmount = 0;
      const orderItemsToSave: OrderItemDTO[] = [];

      // 3. Duyệt qua từng món trong giỏ hàng
      for (const item of cartItems) {
        // 3.1. TRỪ KHO (Gắn đũa thần 't' vào)
        const isDeducted = await this.inventoryRepo.deduct(
          item.productId,
          item.quantity,
          t,
        );
        if (!isDeducted) {
          throw new Error(
            `Món ăn đã hết hàng hoặc không đủ số lượng. Vui lòng kiểm tra lại!`,
          );
        }

        // 3.2. LẤY GIÁ BÁN HIỆN TẠI (Đề phòng giá menu mới bị đổi)
        const menu = await this.menuRepo.getById(item.productId);
        if (!menu) {
          throw new Error('Món ăn không còn tồn tại trên hệ thống!');
        }

        // 3.3. Tính tiền và gom vào danh sách order_items
        const price = menu.price;
        totalAmount += price * item.quantity;

        orderItemsToSave.push({
          id: uuidv4(),
          orderId: orderId,
          menuId: item.productId,
          quantity: item.quantity,
          price: price,
        });
      }

      const newOrder: OrderDTO = {
        id: orderId,
        userId: userId,
        totalAmount: totalAmount,
        status: 'pending',
      };

      // 4. LƯU ĐƠN HÀNG (Gắn đũa thần 't')
      await this.orderRepo.create(newOrder, orderItemsToSave, t);

      // 5. MỌI THỨ HOÀN HẢO -> CHỐT GIAO DỊCH
      await t.commit();

      // 6. XÓA SẠCH GIỎ HÀNG BẰNG REDIS (Vì đã mua xong rồi)
      await this.cartRepo.clearCart(userId);

      return orderId;
    } catch (error) {
      // 🚨 CÓ BIẾN! LỖI BẤT KỲ KHÂU NÀO ĐỀU ROLLBACK TẤT CẢ VỀ NHƯ CŨ
      await t.rollback();
      throw error;
    }
  }
}
