import { Router } from 'express';
import { getCategoryApi } from './infas/get-api';
import { listCategoryApi } from './infas/list-api';
import { CreateCategoryApi } from './infas/create-api';
import { updateCategoryApi } from './infas/update-api';
import { deleteCategoryApi } from './infas/deleate-api';

export const setupCategoryModule = () => {
  const router = Router();
  router.get('/category', listCategoryApi);
  router.get('/category/:id', getCategoryApi);
  router.post('/category', CreateCategoryApi);
  router.patch('/category/:id', updateCategoryApi);
  router.delete('/category/:id', deleteCategoryApi);
  return router;
};
