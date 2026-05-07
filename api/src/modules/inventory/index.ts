/* eslint-disable prettier/prettier */
import { Router } from 'express';
import { InventoryMySQLRepository } from './innfras/repository/index';
import { DeductInventoryUseCase } from './usecare/deduct-inventory';
import { InventoryHttpService } from './innfras/trandsport';

export function setupInventoryRouter(): Router {
  const router = Router();

  const repository = new InventoryMySQLRepository();
  const deductUseCase = new DeductInventoryUseCase(repository);
  const httpService = new InventoryHttpService(deductUseCase);

  router.post('/inventory/deduct', httpService.deductAPI.bind(httpService));

  return router;
}

// Xuất hàm initModel để file tổng có thể gọi đến
export { initInventoryModel } from './innfras/repository/dto';
