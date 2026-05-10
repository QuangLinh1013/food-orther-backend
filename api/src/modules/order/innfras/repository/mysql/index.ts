/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Op } from 'sequelize';
import { IOrderRepository } from '../../../interface';
import { OrderDTO, OrderItemDTO, PaginatedOrderResult } from '../../../model/order';
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
  // hàm lấy chi tiết đơn hàng (Có Transaction bảo vệ nếu cần, nhưng thường chỉ để đọc nên không bắt buộc)
  async getById(orderId: string): Promise<OrderDTO | null> {
    const order = await OrderModel.findByPk(orderId, {
      include: [{ model: OrderItemModel, as: 'items' }],
    });

    if (!order) return null;
    return order.toJSON() as OrderDTO;
  }
  //hàm trừ kho (Có Transaction bảo vệ)
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
  // ... (Giữ nguyên các hàm create và getById)
  // Hàm cập nhật trạng thái đơn hàng (Có Transaction bảo vệ nếu cần)/
  async updateStatus(
    orderId: string,
    status: string,
    t?: any,
  ): Promise<boolean> {
    const [updatedRows] = await OrderModel.update(
      { status: status },
      {
        where: { id: orderId },
        transaction: t,
      },
    );

    return updatedRows > 0;
  }
  // ... (Giữ nguyên các hàm cũ)

  async getHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedOrderResult> {
    // Công thức tính điểm bắt đầu lấy dữ liệu (Offset)
    // Ví dụ: Trang 1 (1-1)*10 = 0 (Lấy từ dòng 0). Trang 2 (2-1)*10 = 10 (Lấy từ dòng 10)
    const offset = (page - 1) * limit;

    const { rows, count } = await OrderModel.findAndCountAll({
      where: { userId },
      limit: limit,
      offset: offset,
      order: [['created_at', 'DESC']], // Sắp xếp: Đơn mới nhất lên đầu
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ], // Eager Loading: Gắn luôn danh sách món ăn vào kết quả
    });

    return {
      data: rows.map((row) => row.toJSON() as OrderDTO),
      meta: {
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit), // Tính tổng số trang (Ví dụ: 25 đơn / 10 = 3 trang)
      },
    };
  }
}
