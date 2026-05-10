/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { IInventoryRepository } from '../interface';
import {
  RestockInventoryDTO,
  RestockInventorySchema,
} from '../model/inventory';

export class RestockInventoryUseCase implements ICommandHandler<
  RestockInventoryDTO,
  boolean
> {
  constructor(private readonly repository: IInventoryRepository) {}

  async execute(data: RestockInventoryDTO): Promise<boolean> {
    // 1. Kiểm tra dữ liệu đầu vào (Số lượng phải > 0)
    const validData = RestockInventorySchema.parse(data);

    // 2. Gọi Repository để thực hiện cộng kho và ghi log
    const result = await this.repository.restock(
      validData.menuId,
      validData.quantity,
    );

    return result;
  }
}
