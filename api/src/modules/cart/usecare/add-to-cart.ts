/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { ICartRepository } from '../interface';
import { AddToCartDTO, AddToCartSchema } from '../model/cart';

export class AddToCartUseCase implements ICommandHandler<
  { userId: string; data: AddToCartDTO },
  boolean
> {
  constructor(private readonly repository: ICartRepository) {}

  async execute(payload: {
    userId: string;
    data: AddToCartDTO;
  }): Promise<boolean> {
    // 1. Zod xác thực dữ liệu đầu vào (phải có productId chuẩn UUID và quantity > 0)
    const validData = AddToCartSchema.parse(payload.data);

    // 2. Gọi xuống Adapter Redis để thêm món vào giỏ
    return await this.repository.addItem(
      payload.userId,
      validData.productId,
      validData.quantity,
    );
  }
}
