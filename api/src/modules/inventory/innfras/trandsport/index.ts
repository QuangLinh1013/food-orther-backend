/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { DeductInventoryUseCase } from '../../usecare/deduct-inventory';
import { RollbackInventoryUseCase } from '../../usecare/rollback-inventory';
import { RestockInventoryUseCase } from '../../usecare/restock-inventory';

export class InventoryHttpService {
  constructor(
    private readonly deductInventoryUseCase: DeductInventoryUseCase,
    private readonly restockUseCase: RestockInventoryUseCase,
    private readonly rollbackUseCase: RollbackInventoryUseCase,
  ) {}

  async deductAPI(req: Request, res: Response) {
    try {
      await this.deductInventoryUseCase.execute(req.body);
      res
        .status(200)
        .json({ message: 'Đã khóa kho và trừ số lượng thành công!' });
    } catch (error: any) {
      // Trả về HTTP 409 (Conflict) nếu dính lỗi tranh giành version
      const statusCode = error.message.includes('nhanh tay mua mất')
        ? 409
        : 400;
      res
        .status(statusCode)
        .json({ message: 'Lỗi xử lý tồn kho', error: error.message });
    }
  }
  async restockAPI(req: Request, res: Response) {
    try {
      await this.restockUseCase.execute(req.body);
      res.status(200).json({ message: 'Nhập kho thành công!' });
    } catch (error: any) {
      res.status(400).json({ message: 'Lỗi nhập kho', error: error.message });
    }
  }

  // API Hoàn kho (MỚI)
  async rollbackAPI(req: Request, res: Response) {
    try {
      await this.rollbackUseCase.execute(req.body);
      res.status(200).json({ message: 'Hoàn kho thành công!' });
    } catch (error: any) {
      res.status(400).json({ message: 'Lỗi hoàn kho', error: error.message });
    }
  }
}
