/* eslint-disable prettier/prettier */
import { InventoryDTO, InventoryLogDTO } from '../model/inventory';

export interface IInventoryRepository {
  // Lấy tồn kho hiện tại để xem số lượng và lấy cái version quan trọng
  getByMenuId(menuId: string): Promise<InventoryDTO | null>;

  // Hành động trừ kho chứa logic bóp nghẹt Race Condition
  deduct(menuId: string, quantityToDeduct: number, t?: any): Promise<boolean>;
  restock(menuId: string, quantityToAdd: number): Promise<boolean>;

  // 2. Hoàn lại hàng (sau khi hủy đơn)
  rollback(
    menuId: string,
    quantityToReturn: number,
    orderId: string,
  ): Promise<boolean>;

  // 3. Ghi sổ nhật ký (Hàm này sẽ được gọi ẩn bên trong các hàm deduct, restock, rollback)
  writeLog(logData: InventoryLogDTO, t?: any): Promise<void>;
  rollback(menuId: string, quantityToReturn: number, orderId: string, t?: any): Promise<boolean>;
}
