/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { Router } from "express";
import { Sequelize } from "sequelize";
import { init } from "./innfras/repository/mysql-sequelize/dto";
import { BrandUseCase } from "./usecare";
import { CreateNewBrandCmdCommand } from "./usecare/create-new-brand";
import { MyBrandRepository } from "./innfras/repository/mysql-sequelize";
import { BrandHttpSevice } from "./innfras/trandsport";
import { GetBrandDetailQuery } from "./usecare/get-brand-detail";
import { UpdateNewBrandCmdHandler } from "./usecare/update-new-brand ";
import { DeleteNewBrandCmdHandler } from "./usecare/delete-new-brand  ";

export const setupBrandHexagon = (sequelize: Sequelize) => {
  init(sequelize);
  const repository = new MyBrandRepository(sequelize);
  const useCase = new BrandUseCase(repository);
  const createCmdHanler = new CreateNewBrandCmdCommand(repository);
  const getDetailQueryHandler = new GetBrandDetailQuery(repository);
  const updateCmdHandler = new UpdateNewBrandCmdHandler(repository);
  const deleteCmdHandler = new DeleteNewBrandCmdHandler(repository);
  const httpService = new BrandHttpSevice(createCmdHanler, getDetailQueryHandler, updateCmdHandler, deleteCmdHandler, useCase);
  const router = Router();

  router.get('/brands', httpService.listAPI.bind(httpService));
  router.get('/brands/:id', httpService.getDetail.bind(httpService));
  router.post('/brands', httpService.createAPI.bind(httpService));
  router.patch('/brands/:id', httpService.updateAPI.bind(httpService));
  router.delete('/brands/:id', httpService.deleteAPI.bind(httpService));

  return router;
};