/* eslint-disable prettier/prettier */
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export class SocketAdapter {
  private io: Server | null = null;

  // Khởi tạo trạm phát sóng, gắn vào server HTTP của Express
  initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*', // Trong thực tế nên để domain của frontend (vd: http://localhost:3000)
        methods: ['GET', 'POST']
      }
    });

    // Lắng nghe khi có một user mở trang web và kết nối vào
    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Một client vừa kết nối: ${socket.id}`);

      // Lắng nghe sự kiện frontend báo cáo danh tính (user đăng nhập)
      socket.on('register_user', (userId: string) => {
        // Đưa user này vào một "Căn phòng" (Room) riêng mang tên ID của họ
        socket.join(userId);
        console.log(`👤 User [${userId}] đã vào phòng nhận thông báo.`);
      });

      socket.on('disconnect', () => {
        console.log(`❌ Client ngắt kết nối: ${socket.id}`);
      });
    });
  }

  // Hàm dùng để "bắn" thông báo cho một user cụ thể
  sendToUser(userId: string, eventName: string, data: any) {
    if (!this.io) {
      console.error('Socket.io chưa được khởi tạo!');
      return;
    }
    // Phát tin nhắn vào đúng "Căn phòng" của user đó
    this.io.to(userId).emit(eventName, data);
  }
}

// Xuất ra một instance duy nhất (Singleton) để dùng chung toàn app
export const socketService = new SocketAdapter();