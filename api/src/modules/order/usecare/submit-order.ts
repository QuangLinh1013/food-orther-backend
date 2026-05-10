/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { IMessageQueue } from '../../../share/interface/message-queue';
import { ICartRepository } from '../../cart/interface';

// Tái sử dụng lại DTO tạo order (chỉ cần lấy userId)
interface SubmitOrderDTO {
  userId: string;
}

export class SubmitOrderUseCase implements ICommandHandler<
  SubmitOrderDTO,
  string
> {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly messageQueue: IMessageQueue, // Tiêm Cổng Message Queue vào đây
  ) {}

  async execute(data: SubmitOrderDTO): Promise<string> {
    // 1. Kiểm tra nhanh: Giỏ hàng có đồ không?
    const cart = await this.cartRepo.getByUserId(data.userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống, không thể đặt hàng!');
    }

    // 2. Gom thông tin cần thiết để ném vào Queue
    // (Bao gồm userId và toàn bộ danh sách món ăn hiện có trong giỏ)
    const orderMessage = {
      userId: data.userId,
      items: cart.items, // Lấy từ Redis ra
      submittedAt: new Date().toISOString(),
    };

    // 3. Ném cục tin nhắn này vào hàng đợi tên là 'order_queue'
    await this.messageQueue.publish('order_queue', orderMessage);

    // 4. Có thể (tùy chọn) dọn dẹp giỏ hàng ngay lúc này cho sạch sẽ
    await this.cartRepo.clear(data.userId);

    // 5. Trả về thông báo ngay lập tức (Chưa tới 50ms!)
    return 'Hệ thống đã tiếp nhận đơn hàng. Vui lòng chờ xử lý!';

}
}