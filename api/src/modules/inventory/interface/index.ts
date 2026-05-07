/* eslint-disable prettier/prettier */
import { InventoryDTO } from '../model/inventory';

export interface IInventoryRepository {
  // Lấy tồn kho hiện tại để xem số lượng và lấy cái version quan trọng
  getByMenuId(menuId: string): Promise<InventoryDTO | null>;

  // Hành động trừ kho chứa logic bóp nghẹt Race Condition
  deduct(menuId: string, quantityToDeduct: number, t?: any): Promise<boolean>;
}
