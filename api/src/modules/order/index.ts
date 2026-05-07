/* eslint-disable prettier/prettier */
import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { OrderMySQLRepository } from './innfras/repository/mysql';
import { CartRedisRepository } from '../cart/innfras/repository/redis';
import { InventoryMySQLRepository } from '../inventory/innfras/repository';
import { MyMenuRepository } from '../menu/innfras/repository/mysql-sequelize';
import { CreateOrderUseCase } from './usecare/create-order';
import { OrderHttpService } from './innfras/trandsport';

// Chú ý: Hàm này cần nhận vào 'sequelize' từ file app gốc để làm đũa thần
export function setupOrderRouter(sequelize: Sequelize): Router {
  const router = Router();

  // 1. Khởi tạo 4 Nhạc công (Repositories)
  const orderRepo = new OrderMySQLRepository();
  const cartRepo = new CartRedisRepository();
  const inventoryRepo = new InventoryMySQLRepository();
  const menuRepo = new MyMenuRepository(sequelize);

  // 2. Trao quyền cho Nhạc trưởng
  const createOrderUseCase = new CreateOrderUseCase(
    orderRepo,
    cartRepo,
    inventoryRepo,
    menuRepo,
    sequelize, // Giao đũa thần Transaction
  );

  // 3. Khởi tạo Bảng điều khiển
  const httpService = new OrderHttpService(createOrderUseCase);

  // 4. Mở cổng API
  router.post('/order', httpService.createAPI.bind(httpService));

  return router;
}

// Xuất hàm khởi tạo bảng MySQL ra ngoài
export { initOrderModels } from './innfras/repository/mysql/dto';
