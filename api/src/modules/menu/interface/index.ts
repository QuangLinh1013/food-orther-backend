import { Menu, MenuCondDTO, MenuUpdateDTO } from '../model/menu';

// Interface Repository chuyên dành cho Menu
export interface IMenuRepository {
  getById(productId: string): Promise<Menu | null>;
  get(id: string): Promise<Menu | null>;
  findByCond(cond: MenuCondDTO): Promise<Menu | null>;

  // Rất quan trọng cho Food App: API lấy toàn bộ danh sách menu để hiển thị
  list(cond: MenuCondDTO): Promise<Menu[]>;

  insert(data: Menu): Promise<boolean>;
  update(id: string, data: MenuUpdateDTO): Promise<boolean>;
  delete(id: string, isHard?: boolean): Promise<boolean>;
}

// (Lưu ý: Các interface ICommandHandler, IQueryHandler bạn có thể import từ file dùng chung giống như bên module User nhé)
