import { Request, Response } from 'express';

export const CreateCategoryApi = (req: Request, res: Response) => {
  //   const { id } = req.params;

  //   const category = categories.find((c) => c.id === id);

  //   if (!category) {
  //     res.status(404).json({
  //       message: 'Category not found',
  //     });

  //     return;
  //   }

  res.status(200).json({
    data: [],
  });
};
