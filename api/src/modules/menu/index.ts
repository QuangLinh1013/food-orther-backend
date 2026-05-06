/* eslint-disable prettier/prettier */
import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { MyMenuRepository } from './innfras/repository/mysql-sequelize';
import { ListMenuUseCase } from './usecare/list-menu';
import { MenuHttpService } from './innfras/trandsport';
import { CreateMenuUseCase } from './usecare/create-menu';
import { UpdateMenuUseCase } from './usecare/update-menu';
import { DeleteMenuUseCase } from './usecare/delete-menu';

export function setupMenuRouter(sequelize: Sequelize): Router {
  const router = Router();

  // 1. Khởi tạo Adapter DB (Kết nối thực tế)
  const repository = new MyMenuRepository(sequelize);

  // 2. Khởi tạo Use Case (Bơm DB vào lõi)
  const listMenuUseCase = new ListMenuUseCase(repository);
  const createMenuUseCase = new CreateMenuUseCase(repository);
  const updateMenuUseCase = new UpdateMenuUseCase(repository);
  const deleteMenuUseCase = new DeleteMenuUseCase(repository);
  // 3. Khởi tạo Controller (Bơm Lõi vào Controller)
  const httpService = new MenuHttpService(listMenuUseCase, createMenuUseCase, updateMenuUseCase, deleteMenuUseCase);

  // 4. Gắn các Router API
  // API lấy danh sách (Tạm thời là public, ai cũng xem được menu)
  router.get('/menus', httpService.listAPI.bind(httpService));
  router.post('/create', httpService.createAPI.bind(httpService));
  router.patch('/menus/:id', httpService.updateAPI.bind(httpService));
  router.delete('/menus/:id', httpService.deleteAPI.bind(httpService));
  return router;
}
