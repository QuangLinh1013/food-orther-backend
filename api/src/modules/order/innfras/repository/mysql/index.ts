/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Op } from 'sequelize';
import { IOrderRepository } from '../../../interface';
import { OrderDTO, OrderItemDTO } from '../../../model/order';
import { OrderModel, OrderItemModel } from './dto';
import { InventoryModel } from '../../../../inventory/innfras/repository/dto';

export class OrderMySQLRepository implements IOrderRepository {
  async create(
    order: OrderDTO,
    items: OrderItemDTO[],
    t?: any,
  ): Promise<boolean> {
    // Lưu thông tin đơn hàng tổng
    await OrderModel.create(
      {
        id: order.id,
        userId: order.userId,
        totalAmount: order.totalAmount,
        status: order.status,
      },
      { transaction: t },
    );

    // Lưu danh sách các món ăn trong đơn hàng
    // Dùng bulkCreate để lưu nhiều dòng cùng lúc cho nhanh
    const itemData = items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      menuId: item.menuId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItemModel.bulkCreate(itemData, { transaction: t });

    return true;
  }

  async getById(orderId: string): Promise<OrderDTO | null> {
    const order = await OrderModel.findByPk(orderId, {
      include: [{ model: OrderItemModel, as: 'items' }],
    });

    if (!order) return null;
    return order.toJSON() as OrderDTO;
  }
  async deduct(
    menuId: string,
    quantityToDeduct: number,
    t?: any,
  ): Promise<boolean> {
    const [updatedRows] = await InventoryModel.update(
      {
        quantity: InventoryModel.sequelize!.literal(
          `quantity - ${quantityToDeduct}`,
        ),
      },
      {
        where: { menuId: menuId, quantity: { [Op.gte]: quantityToDeduct } },
        transaction: t, // <--- THÊM DÒNG NÀY VÀO ĐÂY LÀ XONG
      },
    );
    return updatedRows > 0;
  }
}
