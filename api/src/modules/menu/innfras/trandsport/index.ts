/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { Menu, MenuCondDTO, MenuCreateDTO, MenuUpdateDTO } from '../../model/menu';

export class MenuHttpService {
  constructor(
    // Inject Use Case vào (Controller không biết DB là gì, chỉ biết Use Case)
    private readonly listMenuUseCase: IQueryHandler<MenuCondDTO, Menu[]>,
    private readonly createMenuUseCase: ICommandHandler<MenuCreateDTO, string>,
    private readonly updateMenuUseCase: ICommandHandler<{ id: string; data: MenuUpdateDTO }, boolean>,
    private readonly deleteMenuUseCase: ICommandHandler<string, boolean>,
  ) {}

  async listAPI(req: Request, res: Response) {
    try {
      // 1. Lấy điều kiện lọc từ query params trên URL (VD: /menus?status=active)
      const cond = req.query as MenuCondDTO;

      // 2. Gọi Use Case xử lý
      const menus = await this.listMenuUseCase.execute(cond);

      // 3. Trả về kết quả
      res.status(200).json({
        message: 'Lấy danh sách món ăn thành công',
        data: menus,
      });
    } catch (error: any | Error) {
      res.status(400).json({
        message: 'Lỗi khi lấy danh sách',
        error: error.message,
      });
    }
  }
  async createAPI(req: Request, res: Response) {
    try {
      const data = req.body as MenuCreateDTO;

      // Gọi Use Case xử lý
      const newMenuId = await this.createMenuUseCase.execute(data);

      res.status(201).json({
        message: 'Tạo món ăn mới thành công',
        data: newMenuId,
      });
    } catch (error: any | Error) {
      res.status(400).json({
        message: 'Lỗi khi tạo món ăn',
        error: error.message,
      });
    }
  }
  async updateAPI(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const data = req.body as MenuUpdateDTO;

      await this.updateMenuUseCase.execute({ id, data });

      res.status(200).json({ message: 'Cập nhật món ăn thành công' });
    } catch (error: any | Error) {
      res.status(400).json({ message: 'Lỗi cập nhật', error: error.message });
    }
  }

  async deleteAPI(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      await this.deleteMenuUseCase.execute(id);

      res.status(200).json({ message: 'Xóa món ăn thành công' });
    } catch (error: any | Error) {
      res.status(400).json({ message: 'Lỗi xóa món ăn', error: error.message });
    }
  }
}
