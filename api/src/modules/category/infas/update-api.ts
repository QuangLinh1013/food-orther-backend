import { Request, Response } from 'express';
import { CategoryUpdateSchema } from '../model/dto';
import { CategoryPersistence } from './repository/dto';
import { CategoryStatus } from '../model/model';
export const updateCategoryApi = () => async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
  const category = await CategoryPersistence.findByPk(id);
  if (!category) {
    res.status(404).json({
      message: 'Category not found',
    });
    return;
  }
  if (category.status === CategoryStatus.DELETED) {
    res.status(400).json({
      message: 'Category cannot be updated if it is deleted',
    });
    return;
  }
  await CategoryPersistence.update(data, {
    where: {
      id,
    },
  });
  res.status(200).json({
    data: true,
  });
};
