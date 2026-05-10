/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Op } from 'sequelize';
import { IInventoryRepository } from '../../interface';
import { InventoryDTO, InventoryLogDTO } from '../../model/inventory';
import { InventoryLogModel, InventoryModel } from './dto';
import { v4 as uuidv4 } from 'uuid';

export class InventoryMySQLRepository implements IInventoryRepository {
  // Các method này đã được implement phía dưới, không cần stub nữa
  async getByMenuId(menuId: string): Promise<InventoryDTO | null> {
    const inventory = await InventoryModel.findOne({
      where: { menuId },
    });
    if (!inventory) return null;

    return {
      id: inventory.id,
      menuId: inventory.menuId,
      quantity: inventory.quantity,
      version: inventory.version,
    };
  }

  async deduct(
    menuId: string,
    quantityToDeduct: number,
    t?: any,
  ): Promise<boolean> {
    if (!menuId) {
      throw new Error('menuId không hợp lệ.');
    }
    if (!Number.isInteger(quantityToDeduct) || quantityToDeduct <= 0) {
      throw new Error('quantityToDeduct không hợp lệ.');
    }
    // Log kiểm tra giá trị đầu vào
    const inventory = await InventoryModel.findOne({ where: { menuId } });
    console.log('[deduct] menuId:', menuId, '| quantityToDeduct:', quantityToDeduct, '| inventory:', inventory ? inventory.quantity : 'not found');

    const [updatedRows] = await InventoryModel.update(
      {
        quantity: InventoryModel.sequelize!.literal(
          `quantity - ${quantityToDeduct}`,
        ),
      },
      {
        where: {
          menuId,
          quantity: { [Op.gte]: quantityToDeduct },
        },
        transaction: t, // Nhận cái đũa thần ở đây
      },
    );

    console.log('[deduct] updatedRows:', updatedRows);
    return updatedRows > 0;
  }
  async writeLog(logData: InventoryLogDTO, t?: any): Promise<void> {
    await InventoryLogModel.create(
      {
        id: logData.id,
        menuId: logData.menuId,
        actionType: logData.actionType,
        quantityChanged: logData.quantityChanged,
        balanceAfter: logData.balanceAfter,
        referenceId: logData.referenceId ?? null,
      },
      { transaction: t },
    );
  }

  // 2. Hàm Nhập kho (Có Transaction bảo vệ)
  async restock(menuId: string, quantityToAdd: number): Promise<boolean> {
    const t = await InventoryModel.sequelize!.transaction();
    try {
      // Tìm dòng tồn kho và KHÓA LẠI (Row-level Lock)
      const inventory = await InventoryModel.findOne({
        where: { menuId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!inventory) throw new Error('Không tìm thấy món ăn trong kho');

      // Cộng dồn số lượng
      inventory.quantity += quantityToAdd;
      await inventory.save({ transaction: t });

      // Ghi sổ Nam Tào
      await this.writeLog(
        {
          id: uuidv4(),
          menuId: menuId,
          actionType: 'RESTOCK',
          quantityChanged: quantityToAdd,
          balanceAfter: inventory.quantity, // Số lượng sau khi cộng
        },
        t,
      );

      await t.commit(); // Chốt giao dịch!
      return true;
    } catch (error) {
      await t.rollback(); // Có lỗi là hủy hết
      throw error;
    }
  }

  // 3. Hàm Hoàn kho (Y hệt Nhập kho, chỉ khác ghi chú là ROLLBACK)
  async rollback(
    menuId: string,
    quantityToReturn: number,
    orderId: string,
    t?: any,
  ): Promise<boolean> {
    // 1. Tuyệt đối KHÔNG khởi tạo Transaction ở đây (không có const t = ...)
    // 2. Không dùng try...catch, cứ để lỗi văng ra ngoài cho Nhạc trưởng hứng

    const inventory = await InventoryModel.findOne({
      where: { menuId },
      transaction: t,
      lock: t?.LOCK.UPDATE,
    });

    if (!inventory) throw new Error('Không tìm thấy món ăn trong kho');

    // Cộng trả lại kho
    inventory.quantity += quantityToReturn;
    await inventory.save({ transaction: t });

    // Ghi sổ Nam Tào
    await this.writeLog(
      {
        id: uuidv4(),
        menuId: menuId,
        actionType: 'ROLLBACK',
        quantityChanged: quantityToReturn,
        balanceAfter: inventory.quantity,
        referenceId: orderId,
      },
      t,
    );

    return true;
    // KHÔNG CÓ t.commit() Ở ĐÂY NỮA!
  }
}
