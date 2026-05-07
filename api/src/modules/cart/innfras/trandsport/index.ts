/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { AddToCartUseCase } from '../../usecare/add-to-cart';
import { GetCartUseCase } from '../../usecare/get-cart';
import { ClearCartUseCase } from '../../usecare/clear-cart';
import { RemoveItemUseCase } from '../../usecare/remove-item';

export class CartHttpService {
  constructor(
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly removeItemUseCase: RemoveItemUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  async addAPI(req: Request, res: Response) {
    try {
      // Trong thực tế, userId sẽ lấy từ Token của người đăng nhập (res.locals.requester.id).
      // Tạm thời để dễ test, ta ưu tiên lấy từ Header, nếu không có thì gán bừa ID 'user-test-123'
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';

      await this.addToCartUseCase.execute({ userId, data: req.body });

      res
        .status(200)
        .json({ message: 'Đã thêm sản phẩm vào giỏ hàng thành công!' });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: 'Lỗi thêm vào giỏ', error: error.message });
    }
  }

  async getAPI(req: Request, res: Response) {
    try {
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';

      const cart = await this.getCartUseCase.execute(userId as string);

      res.status(200).json({ data: cart });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: 'Lỗi lấy giỏ hàng', error: error.message });
    }
  }
  async removeAPI(req: Request, res: Response) {
    try {
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';
      const { productId } = req.params; // Lấy ID món ăn từ URL

      await this.removeItemUseCase.execute({ userId, productId: productId as string });

      res.status(200).json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: 'Lỗi xóa sản phẩm', error: error.message });
    }
  }

  // API Xóa sạch giỏ hàng
  async clearAPI(req: Request, res: Response) {
    try {
      const userId =
        res.locals.requester?.id || req.headers['x-user-id'] || 'user-test-123';

      await this.clearCartUseCase.execute(userId);

      res.status(200).json({ message: 'Đã dọn sạch giỏ hàng' });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: 'Lỗi dọn giỏ hàng', error: error.message });
    }
  }
}
