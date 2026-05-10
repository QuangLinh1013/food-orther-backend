/* eslint-disable prettier/prettier */
export interface IMessageQueue {
  // Hàm dùng cho Producer: Đẩy một tin nhắn (data) vào một hàng đợi (queueName)
  publish(queueName: string, data: any): Promise<boolean>;

  // Hàm dùng cho Consumer: Lắng nghe một hàng đợi, khi có tin nhắn thì gọi hàm callback để xử lý
  consume(
    queueName: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void>;
}
