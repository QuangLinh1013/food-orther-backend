import { Request, Response } from 'express';
export const updateCategoryApi = (req: Request, res: Response) => {
  res.status(200).json({
    data: true,
  });
};
