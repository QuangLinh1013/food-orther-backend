/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { CategoryPersistence } from './repository/dto';
import { z } from 'zod';
const PagingDTOSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
type PagingDTO = z.infer<typeof PagingDTOSchema>;
export const listCategoryApi = async (req: Request, res: Response) => {
  try {
    const { success, data } = PagingDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({
        message: 'Invalid query parameters',
      });
      return;
    }
    const { page, limit } = data;
    // Lấy danh sách, nên sắp xếp theo ngày tạo (createdAt) mới nhất thay vì ID
    const categories = await CategoryPersistence.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      data: categories,
    });
  } catch (error: any) {
    // Bắt và in lỗi ra Terminal
    console.error('❌ Lỗi khi lấy danh sách Category:', error.message);
    console.error('Chi tiết lỗi:', error);

    res.status(500).json({
      message: 'Không thể lấy danh sách Category',
      error: error.message,
    });
  }
};
