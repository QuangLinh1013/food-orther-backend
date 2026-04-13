import { Request, Response } from 'express';
import { CategoryPersistence } from './repository/dto';
export const deleteCategoryApi = () => async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const category = await CategoryPersistence.findByPk(id);
  if (!category) {
    res.status(404).json({
      message: 'Category not found',
    });
    return;
  }

  await CategoryPersistence.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    data: true,
  });
};
