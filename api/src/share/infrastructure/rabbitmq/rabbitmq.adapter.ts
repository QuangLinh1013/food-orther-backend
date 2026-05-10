/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import amqp, { Channel } from 'amqplib';
import { IMessageQueue } from '../../interface/message-queue';

export class RabbitMQAdapter implements IMessageQueue {
  static getInstance(): IMessageQueue {
    throw new Error('Method not implemented.');
  }
  private connection: amqp.ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly url: string;

  // Truyền URL kết nối vào (Ví dụ: amqp://localhost:5672)
  constructor(url: string) {
    this.url = url;
  }

  // Hàm khởi tạo kết nối (Sẽ gọi lúc bật server Node.js)
  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      console.log('✅ Đã kết nối thành công tới RabbitMQ!');
    } catch (error) {
      console.error('❌ Lỗi kết nối RabbitMQ:', error);
      throw error;
    }
  }

  // 1. Gửi tin nhắn vào Queue
  async publish(queueName: string, data: any): Promise<boolean> {
    if (!this.channel) throw new Error('RabbitMQ Channel chưa được khởi tạo');

    // Đảm bảo Queue đã tồn tại (nếu chưa có thì tự tạo)
    await this.channel.assertQueue(queueName, { durable: true });

    // Chuyển object data thành chuỗi Buffer để gửi đi
    const messageBuffer = Buffer.from(JSON.stringify(data));

    // Gửi vào hàng đợi
    return this.channel.sendToQueue(queueName, messageBuffer, {
      persistent: true, // Đảm bảo tin nhắn không bị mất nếu RabbitMQ bị khởi động lại
    });
  }

  // 2. Lắng nghe Queue để xử lý
  async consume(
    queueName: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) throw new Error('RabbitMQ Channel chưa được khởi tạo');

    await this.channel.assertQueue(queueName, { durable: true });

    // Cấu hình: Mỗi lần chỉ lấy đúng 1 tin nhắn ra xử lý, xong mới lấy tiếp (Tránh ngợp)
    this.channel.prefetch(1);

    console.log(`🎧 Bắt đầu lắng nghe hàng đợi: [${queueName}]`);

    this.channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          // Chuyển Buffer ngược lại thành Object
          const data = JSON.parse(msg.content.toString());

          // Đưa data cho Nhạc trưởng xử lý
          await callback(data);

          // Báo cho RabbitMQ biết: "Xong rồi, xóa tin nhắn này đi"
          this.channel!.ack(msg);
        } catch (error) {
          console.error(
            `❌ Lỗi xử lý tin nhắn trong queue ${queueName}:`,
            error,
          );
          // Nếu lỗi, báo RabbitMQ trả tin nhắn lại vào hàng đợi (false) hoặc ném đi (tùy logic)
          // Ở đây tạm thời để nó bỏ qua (ack) để không bị kẹt vòng lặp vô tận, thực tế sẽ đưa vào Dead Letter Queue
          this.channel!.ack(msg);
        }
      }
    });
  }
}
