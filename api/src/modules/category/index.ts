/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from 'express';
import { init, modelName } from './infas/repository/dto';
import { Sequelize } from 'sequelize';
import { MySQLCategoryRepository } from './infas/repository/repo';
import { CategoryUseCase } from './usecase';
import { CategoryHttpService } from './infas/transport/http-sevice';

export const setupCategoryHexagon = (sequelize: Sequelize) => {
  init(sequelize);
  const repository = new MySQLCategoryRepository(sequelize, modelName);
  const useCase = new CategoryUseCase(repository);
  const httpService = new CategoryHttpService(useCase);
  const router = Router();

  router.get('/categories', httpService.listCategoryAPI.bind(httpService));
  router.get('/categories/:id', httpService.getDetailCategoryAPI.bind(httpService));
  router.post('/categories', httpService.createANewCategoryAPI.bind(httpService));
  router.patch('/categories/:id', httpService.updateCategoryAPI.bind(httpService));
  router.delete('/categories/:id', httpService.deleteCategoryAPI.bind(httpService));

  return router;
};
