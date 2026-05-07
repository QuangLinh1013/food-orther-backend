/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { ICartRepository } from '../interface';

export class ClearCartUseCase implements ICommandHandler<string, boolean> {
  constructor(private readonly repository: ICartRepository) {}

  async execute(userId: string): Promise<boolean> {
    return await this.repository.clearCart(userId);
  }
}
