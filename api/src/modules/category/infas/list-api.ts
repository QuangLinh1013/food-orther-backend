import { Request, Response } from 'express';

export const listCategoryApi = (req: Request, res: Response) => {
  res.status(200).json({
    data: [],
  });
};
