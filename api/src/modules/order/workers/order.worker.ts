/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { IMessageQueue } from '../../../share/interface/message-queue';
import { CreateOrderUseCase } from '../usecare/create-order';

export class OrderWorker {
  constructor(
    private readonly messageQueue: IMessageQueue,
    private readonly createOrderUseCase: CreateOrderUseCase, // Tiêm Nhạc trưởng chốt đơn cũ vào đây
  ) {}

  // Hàm khởi động Worker
  async start() {
    // Lắng nghe cái ống 'order_queue'
    await this.messageQueue.consume('order_queue', async (message) => {
      console.log(
        '👷 [Worker] Đang xử lý đơn hàng mới từ user:',
        message.userId,
      );

      try {
        // Gọi lại Use Case tạo đơn hàng thật sự (Có Transaction, Trừ kho, Lưu DB...)
        // Lưu ý: data truyền vào đây cần phải khớp với những gì CreateOrderUseCase yêu cầu
        await this.createOrderUseCase.execute({
          userId: message.userId,
          items: message.items,
        });

        console.log(
          '✅ [Worker] Đã xử lý và chốt đơn thành công cho user:',
          message.userId,
        );
      } catch (error) {
        console.error('❌ [Worker] Xử lý đơn hàng thất bại:', error);
        // Ở thực tế: Nếu lỗi do hết kho -> Lưu DB trạng thái đơn là 'failed', hoặc trả tiền lại (nếu đã trừ).
      }
    });
  }
}
