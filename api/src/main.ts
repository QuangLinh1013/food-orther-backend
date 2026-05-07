/* eslint-disable @typescript-eslint/require-await */
//import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import 'dotenv/config';
import { setupCategoryHexagon } from './modules/category';
import express from 'express';
import { sequelize } from './share/conponent/sequelize';
import { setupBrandHexagon } from './modules/bran';
import { setupUserHexagon } from './modules/users';
import { setupMenuRouter } from './modules/menu';
import { RedisComponent } from './share/conponent/redis';
import { setupCartRouter } from './modules/cart';
import { initInventoryModel, setupInventoryRouter } from './modules/inventory';
import { setupOrderRouter, initOrderModels } from './modules/order';
config();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
  setupCategoryHexagon(sequelize); // Init models
  initInventoryModel(sequelize);
  initOrderModels(sequelize);
  await sequelize.sync({ alter: true });
  console.log('✅ Đã đồng bộ các bảng (Database Synced)!');
  const app = express();
  app.use(express.json());
  app.use('/v1', setupCategoryHexagon(sequelize));
  app.use('/v1', setupBrandHexagon(sequelize));
  app.use('/v1', setupUserHexagon(sequelize));
  app.use('/v1', setupMenuRouter(sequelize));
  app.use('/v1', setupCartRouter());
  app.use('/v1', setupInventoryRouter());
  app.use('/v1', setupOrderRouter(sequelize)); // Truyền 'sequelize' vào đây để làm đũa thần Transaction
  const port = process.env.PORT ?? 3000;
  await RedisComponent.getInstance();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
