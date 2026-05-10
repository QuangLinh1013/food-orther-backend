/* eslint-disable prettier/prettier */
import { IOrderRepository } from '../interface';
import { GetOrderHistoryDTO, PaginatedOrderResult } from '../model/order';

export class GetOrderHistoryUseCase {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(
    userId: string,
    query: GetOrderHistoryDTO,
  ): Promise<PaginatedOrderResult> {
    // Gọi thẳng xuống Repository để lấy dữ liệu.
    // Mọi logic tính toán Offset đã được xử lý ở dưới DB rồi.
    return await this.orderRepo.getHistory(userId, query.page, query.limit);
  }
}
