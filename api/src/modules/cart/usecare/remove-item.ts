/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { ICartRepository } from '../interface';

export class RemoveItemUseCase implements ICommandHandler<
  { userId: string; productId: string },
  boolean
> {
  constructor(private readonly repository: ICartRepository) {}

  async execute(payload: {
    userId: string;
    productId: string;
  }): Promise<boolean> {
    const isSuccess = await this.repository.removeItem(
      payload.userId,
      payload.productId,
    );
    if (!isSuccess) {
      throw new Error('Không tìm thấy sản phẩm trong giỏ hàng để xóa');
    }
    return true;
  }
}
