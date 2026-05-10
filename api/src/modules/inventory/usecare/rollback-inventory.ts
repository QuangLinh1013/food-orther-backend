/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { IInventoryRepository } from '../interface';
import {
  RollbackInventoryDTO,
  RollbackInventorySchema,
} from '../model/inventory';

export class RollbackInventoryUseCase implements ICommandHandler<
  RollbackInventoryDTO,
  boolean
> {
  constructor(private readonly repository: IInventoryRepository) {}

  async execute(data: RollbackInventoryDTO): Promise<boolean> {
    // 1. Kiểm tra dữ liệu
    const validData = RollbackInventorySchema.parse(data);

    // 2. Thực hiện hoàn kho kèm theo mã đơn hàng để đối soát
    const result = await this.repository.rollback(
      validData.menuId,
      validData.quantity,
      validData.orderId,
    );

    return result;
  }
}
