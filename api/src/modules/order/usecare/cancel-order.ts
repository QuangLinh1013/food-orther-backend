/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { IOrderRepository } from '../interface';
import { IInventoryRepository } from '../../inventory/interface';
import { Sequelize } from 'sequelize';
import { CancelOrderDTO, CancelOrderSchema } from '../model/order';

export class CancelOrderUseCase implements ICommandHandler<
  CancelOrderDTO & { userId: string },
  boolean
> {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly inventoryRepo: IInventoryRepository,
    private readonly sequelize: Sequelize, // Đũa thần Transaction
  ) {}

  async execute(data: CancelOrderDTO & { userId: string }): Promise<boolean> {
    // 1. Zod xác thực ID đơn hàng
    const validData = CancelOrderSchema.parse({ orderId: data.orderId });

    // 2. Tìm đơn hàng
    const order = await this.orderRepo.getById(validData.orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng này!');
    }

    // 3. Kiểm tra quyền sở hữu (Bảo mật: Không cho phép user hủy đơn của người khác)
    if (order.userId !== data.userId) {
      throw new Error('Bạn không có quyền hủy đơn hàng này!');
    }

    // 4. Kiểm tra trạng thái (Chỉ cho phép hủy khi đang pending)
    if (order.status !== 'pending') {
      throw new Error(
        `Không thể hủy đơn hàng đang ở trạng thái: ${order.status}`,
      );
    }

    // --- BẮT ĐẦU KÍCH HOẠT TRANSACTION ---
    const t = await this.sequelize.transaction();

    try {
      // 5. Cập nhật trạng thái đơn thành 'cancelled'
      await this.orderRepo.updateStatus(order.id, 'cancelled', t);

      // 6. Trả lại toàn bộ món ăn vào kho (Gọi sang module Inventory)
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await this.inventoryRepo.rollback(
            item.menuId,
            item.quantity,
            order.id,
            t,
          );
        }
      }

      // 7. Chốt giao dịch thành công!
      await t.commit();
      return true;
    } catch (error) {
      // Lỗi bất kỳ khâu nào (đổi trạng thái hoặc cộng kho) đều hoàn tác lại
      await t.rollback();
      throw error;
    }
  }
}
