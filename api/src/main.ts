/* eslint-disable @typescript-eslint/require-await */
//import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import 'dotenv/config';
import { setupCategoryModule } from './modules/category';
import express from 'express';
import { sequelize } from './share/conponent/sequelize';
config();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
  await sequelize.sync({ alter: true });
  console.log('✅ Đã đồng bộ các bảng (Database Synced)!');
  const app = express();
  app.use(express.json());
  app.use('/v1', setupCategoryModule(sequelize));
  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
