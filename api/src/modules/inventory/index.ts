/* eslint-disable prettier/prettier */
import { Router } from 'express';
import { InventoryMySQLRepository } from './innfras/repository/index';
import { DeductInventoryUseCase } from './usecare/deduct-inventory';
import { InventoryHttpService } from './innfras/trandsport';
import { RollbackInventoryUseCase } from './usecare/rollback-inventory';
import { RestockInventoryUseCase } from './usecare/restock-inventory';

export function setupInventoryRouter(): Router {
  const router = Router();

  const repository = new InventoryMySQLRepository();
  const deductUseCase = new DeductInventoryUseCase(repository);
  const restockUseCase = new RestockInventoryUseCase(repository);
  const rollbackUseCase = new RollbackInventoryUseCase(repository);
  const httpService = new InventoryHttpService(deductUseCase, restockUseCase, rollbackUseCase);


  router.post('/inventory/deduct', httpService.deductAPI.bind(httpService));
  router.post('/inventory/restock', httpService.restockAPI.bind(httpService));
  router.post('/inventory/rollback', httpService.rollbackAPI.bind(httpService));
  return router;
}

// Xuất hàm initModel để file tổng có thể gọi đến
export { initInventoryModel } from './innfras/repository/dto';
