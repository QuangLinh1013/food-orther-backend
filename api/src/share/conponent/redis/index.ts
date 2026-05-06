/* eslint-disable prettier/prettier */
import { createClient, RedisClientType } from 'redis';

// Khởi tạo một class Singleton để quản lý kết nối Redis cho toàn dự án
export class RedisComponent {
  private static instance: RedisClientType | null = null;

  static async getInstance(): Promise<RedisClientType> {
    if (!this.instance) {
      // Kết nối mặc định đến localhost:6379
      this.instance = createClient({
        url: 'redis://default:PvwGT7pWHITxNWzPy2N3r1tgCsVL47IN@redis-10512.c277.us-east-1-3.ec2.cloud.redislabs.com:10512', // Trong thực tế sẽ lấy từ file .env
      });

      this.instance.on('error', (err) =>
        console.error('Lỗi Redis Client:', err),
      );
      this.instance.on('connect', () =>
        console.log('✅ Đã kết nối Redis thành công!'),
      );

      await this.instance.connect();
    }
    return this.instance;
  }
}
