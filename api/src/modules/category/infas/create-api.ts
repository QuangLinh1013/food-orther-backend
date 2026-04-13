/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { CategoryCreateSchema } from '../model/dto';
import { CategoryPersistence } from './repository/dto';
import { v7 } from 'uuid';

export async function CreateCategoryApi(
  req: Request,
  res: Response,
): Promise<void> {
  // 1. Validate dữ liệu đầu vào
  const { success, data, error } = CategoryCreateSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  // 2. Thêm try...catch để xử lý lỗi Database
  try {
    const newId = v7();
    const payload = { id: newId, ...data };

    // Log ra để xem chúng ta đang thực sự truyền cái gì vào DB
    console.log('🚀 Dữ liệu chuẩn bị Insert:', payload);

    // Thực hiện lưu vào DB
    await CategoryPersistence.create(payload);

    res.status(200).json({
      data: newId,
    });
  } catch (dbError: any) {
    // Bắt lỗi và in ra chính xác MySQL đang phàn nàn điều gì
    console.error('❌ Lỗi Sequelize/MySQL:', dbError.message);
    console.error('Chi tiết lỗi:', dbError);

    // Trả về lỗi 500 cho Client thay vì để request bị treo
    res.status(500).json({
      message: 'Không thể tạo Category trong Database',
      error: dbError.message,
    });
  }
}
