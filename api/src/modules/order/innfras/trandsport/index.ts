/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { CancelOrderUseCase } from '../../usecare/cancel-order';
import { GetOrderHistorySchema } from '../../model/order';
import { GetOrderHistoryUseCase } from '../../usecare/get-order-history';
import { SubmitOrderUseCase } from '../../usecare/submit-order';

export class OrderHttpService {
  constructor(
    private readonly submitOrderUseCase: SubmitOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrderHistoryUseCase: GetOrderHistoryUseCase,
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';

      // Nhạc trưởng mới sẽ ném đơn vào Queue và trả kết quả ngay
      const message = await this.submitOrderUseCase.execute({ userId });

      res.status(202).json({
        // Dùng mã 202 (Accepted) để báo hiệu đơn đang chờ xử lý
        message: message,
        status: 'processing',
      });
    } catch (error: any) {
      res.status(400).json({ message: 'Lỗi đặt hàng', error: error.message });
    }
  }
  async cancelAPI(req: Request, res: Response) {
    try {
      // Trong thực tế, userId lấy từ Token. Tạm thời fix cứng hoặc lấy từ header để test.
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';
      const orderId = req.body?.orderId;

      await this.cancelOrderUseCase.execute({ orderId, userId });

      res
        .status(200)
        .json({ message: 'Đã hủy đơn hàng và hoàn tiền/hoàn kho thành công!' });
    } catch (error: any) {
      res.status(400).json({ message: 'Lỗi hủy đơn', error: error.message });
    }
  }
  async getHistoryAPI(req: Request, res: Response) {
    try {
      // 1. Lấy userId (Tạm fix cứng để test)
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';

      // 2. Validate và Ép kiểu query trên URL (Ví dụ: ?page=1&limit=5)
      // Nếu user không truyền gì, Zod sẽ tự động lấy mặc định page=1, limit=10
      const query = GetOrderHistorySchema.parse(req.query);

      // 3. Gọi Use Case
      const result = await this.getOrderHistoryUseCase.execute(userId, query);

      res.status(200).json({
        message: 'Lấy lịch sử đơn hàng thành công',
        ...result, // Trải phẳng object PaginatedOrderResult ra (data, meta)
      });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: 'Lỗi lấy lịch sử', error: error.message });
    }
  }
}
