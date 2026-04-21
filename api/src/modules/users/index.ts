/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init } from './infras/repository/mysql-sequelize/dto'; // File dto.ts bạn đã tạo ở bước trước
import { MyUserRepository } from './infras/repository/mysql-sequelize';
import { CreateNewUserCmdHandler } from './usecare/create-new-user';
import { UserHttpService } from './infras/trandsport';
import { LoginUserCmdHandler } from './usecare/login-user';

export const setupUserHexagon = (sequelize: Sequelize) => {
  // 1. Init model Sequelize
  init(sequelize);

  // 2. Khởi tạo Repository (Secondary Adapter)
  const repository = new MyUserRepository(sequelize);
  
  // 3. Khởi tạo Use Case (Core CQRS)
  const createCmdHandler = new CreateNewUserCmdHandler(repository);
  const loginCmdHandler = new LoginUserCmdHandler(repository);
  // 4. Khởi tạo HTTP Service (Primary Adapter)
  const httpService = new UserHttpService(createCmdHandler, loginCmdHandler);

  // 5. Gắn vào Router
  const router = Router();

  // Endpoint đăng ký: POST /users/register
  router.post('/users/register', httpService.registerAPI.bind(httpService));
  // Endpoint đăng nhập: POST /users/login
  router.post('/users/login', httpService.loginAPI.bind(httpService));

  return router;
};
