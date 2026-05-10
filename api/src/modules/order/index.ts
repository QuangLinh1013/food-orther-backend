/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { OrderMySQLRepository } from './innfras/repository/mysql';
import { CartRedisRepository } from '../cart/innfras/repository/redis';
import { InventoryMySQLRepository } from '../inventory/innfras/repository';
import { MyMenuRepository } from '../menu/innfras/repository/mysql-sequelize';
import { CreateOrderUseCase } from './usecare/create-order';
import { OrderHttpService } from './innfras/trandsport';
import { CancelOrderUseCase } from './usecare/cancel-order';
import { GetOrderHistoryUseCase } from './usecare/get-order-history';
import { OrderWorker } from './workers/order.worker';
import { SubmitOrderUseCase } from './usecare/submit-order';
import { IMessageQueue } from '../../share/interface/message-queue';
// Chú ý: Hàm này cần nhận vào 'sequelize' từ file app gốc để làm đũa thần
export function setupOrderRouter(
  sequelize: Sequelize,
  messageQueue: IMessageQueue,
): Router {
  const router = Router();

  // 1. Khởi tạo 4 Nhạc công (Repositories)
  const orderRepo = new OrderMySQLRepository();
  const cartRepo = new CartRedisRepository();
  const inventoryRepo = new InventoryMySQLRepository();
  const menuRepo = new MyMenuRepository(sequelize);

  // 2. Trao quyền cho Nhạc trưởng
  const submitOrderUseCase = new SubmitOrderUseCase(cartRepo, messageQueue);

  // 2. Use Case cho Worker (Consumer)
  const createOrderUseCase = new CreateOrderUseCase(
    orderRepo,
    cartRepo,
    inventoryRepo,
    menuRepo,
    sequelize,
  );

  // 3. Khởi động Worker để lắng nghe RabbitMQ
  const orderWorker = new OrderWorker(messageQueue, createOrderUseCase);
  orderWorker.start(); // Bật chế độ lắng nghe ngầm

  const cancelOrderUseCase = new CancelOrderUseCase(
    orderRepo,
    inventoryRepo,
    sequelize,
  );
  const getOrderHistoryUseCase = new GetOrderHistoryUseCase(orderRepo);

  const httpService = new OrderHttpService(
    submitOrderUseCase,
    cancelOrderUseCase,
    getOrderHistoryUseCase,
  );
  // 4. Mở cổng API
  router.post('/order', httpService.createAPI.bind(httpService));
  router.post('/order/cancel', httpService.cancelAPI.bind(httpService));
  router.get('/order', httpService.getHistoryAPI.bind(httpService));
  return router;
}

// Xuất hàm khởi tạo bảng MySQL ra ngoài
export { initOrderModels } from './innfras/repository/mysql/dto';
