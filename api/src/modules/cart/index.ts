import { Router } from 'express';
import { CartRedisRepository } from './innfras/repository/redis';
import { AddToCartUseCase } from './usecare/add-to-cart';
import { GetCartUseCase } from './usecare/get-cart';
import { RemoveItemUseCase } from './usecare/remove-item';
import { ClearCartUseCase } from './usecare/clear-cart';
import { CartHttpService } from './innfras/trandsport';

export function setupCartRouter(): Router {
  const router = Router();

  // 1. Khởi tạo Repository (Redis)
  const repository = new CartRedisRepository();

  // 2. Bơm Repository vào Use Cases
  const addToCartUseCase = new AddToCartUseCase(repository);
  const getCartUseCase = new GetCartUseCase(repository);
  const removeItemUseCase = new RemoveItemUseCase(repository);
  const clearCartUseCase = new ClearCartUseCase(repository);

  // 3. Bơm Use Cases vào Controller
  const httpService = new CartHttpService(
    addToCartUseCase,
    getCartUseCase,
    removeItemUseCase,
    clearCartUseCase,
  );

  // 4. Đăng ký các Endpoint API
  router.post('/cart', httpService.addAPI.bind(httpService));
  router.get('/cart', httpService.getAPI.bind(httpService));
  router.delete('/cart/:productId', httpService.removeAPI.bind(httpService));
  router.delete('/cart', httpService.clearAPI.bind(httpService));

  return router;
}
