/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { CreateOrderUseCase } from '../../usecare/create-order';

export class OrderHttpService {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  async createAPI(req: Request, res: Response) {
    try {
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';

      const orderId = await this.createOrderUseCase.execute(userId);

      res.status(200).json({
        message: 'Đặt hàng thành công!',
        data: { orderId },
      });
    } catch (error: any) {
      res.status(400).json({ message: 'Lỗi đặt hàng', error: error.message });
    }
  }
}
