import { Request, Response } from 'express';
export const getCategoryApi = (req: Request, res: Response) => {
  res.status(200).json({
    data: [],
  });
};
