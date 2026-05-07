/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Op } from 'sequelize';
import { IInventoryRepository } from '../../interface';
import { InventoryDTO } from '../../model/inventory';
import { InventoryModel } from './dto';

export class InventoryMySQLRepository implements IInventoryRepository {
  async getByMenuId(menuId: string): Promise<InventoryDTO | null> {
    const inventory = await InventoryModel.findOne({
      where: { menu_id: menuId },
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
    const [updatedRows] = await InventoryModel.update(
      {
        quantity: InventoryModel.sequelize!.literal(
          `quantity - ${quantityToDeduct}`,
        ),
      },
      {
        where: {
          menuId: menuId,
          quantity: { [Op.gte]: quantityToDeduct },
        },
        transaction: t, // Nhận cái đũa thần ở đây
      },
    );

    return updatedRows > 0;
  }
}
