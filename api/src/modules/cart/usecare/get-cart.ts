/* eslint-disable prettier/prettier */
import { IQueryHandler } from '../../../share/interface';
import { ICartRepository } from '../interface';
import { CartItemDTO } from '../model/cart';

export class GetCartUseCase implements IQueryHandler<string, CartItemDTO[]> {
  constructor(private readonly repository: ICartRepository) {}

  async execute(userId: string): Promise<CartItemDTO[]> {
    return await this.repository.getCart(userId);
  }
}
